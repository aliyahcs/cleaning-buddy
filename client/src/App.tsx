import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { OTPVerificationPage } from './pages/OTPVerificationPage.tsx';
import { PasswordResetPage } from './pages/PasswordResetPage.tsx';
import { InitialSetupFlow } from './pages/InitialSetupFlow.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { MyTasks } from './pages/MyTasks.tsx';
import { RoomChecklists } from './pages/RoomChecklists.tsx';
import { Analytics } from './pages/Analytics.tsx';
import { Tips } from './pages/Tips.tsx';
import { Settings } from './pages/Settings.tsx';
import { Help } from './pages/Help.tsx';
import { NotificationPermission } from './components/NotificationPermission.tsx';
import { notificationService } from './lib/notifications';
import { supabase } from './lib/supabase.ts';

function PublicRoute({ element }: { element: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setChecking(false);
    });
  }, []);
  if (checking) return null;
  if (authed) return <Navigate to="/dashboard" replace />;
  return <>{element}</>;
}

function App() {
  const [showNotificationPermission, setShowNotificationPermission] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'default') return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setShowNotificationPermission(true);
    });
  }, []);

  const handleNotificationPermission = (granted: boolean) => {
    setShowNotificationPermission(false);
    if (!granted) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('selected_cleaning_time')
        .eq('user_id', user.id)
        .single();
      const time = data?.selected_cleaning_time?.slice(0, 5) || '09:00';
      notificationService.scheduleNotification(time, 'Time to start your cleaning routine!');
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {showNotificationPermission && (
          <NotificationPermission onRequestPermission={handleNotificationPermission} />
        )}
        <Routes>
          <Route path="/" element={<PublicRoute element={<LandingPage />} />} />
          <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/setup" element={<InitialSetupFlow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/room-checklists" element={<RoomChecklists />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
