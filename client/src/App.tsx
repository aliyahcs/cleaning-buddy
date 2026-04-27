import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { PasswordResetPage } from './pages/PasswordResetPage.tsx';
import { InitialSetupFlow } from './pages/InitialSetupFlow.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { MyTasks } from './pages/MyTasks.tsx';
import { RoomChecklists } from './pages/RoomChecklists.tsx';
import { Analytics } from './pages/Analytics.tsx';
import { Tips } from './pages/Tips.tsx';
import { Settings } from './pages/Settings.tsx';
import { Help } from './pages/Help.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
