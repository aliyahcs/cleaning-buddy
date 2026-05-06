import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  BellIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { notificationService } from '../lib/notifications';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dwellingTypeIdMap: Record<string, number> = { 'Apartment': 1, 'House': 2, 'Studio': 3 };

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cleaningDay: 'Saturday',
    cleaningTime: '09:00',
    dwellingType: '',
    neatFreakScore: 0,
    neatFreakCategory: '',
    priorityRooms: [] as string[],
    notifications: {
      pushEnabled: true,
      inAppEnabled: true,
      soundId: 1,
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [userRes, profileRes, roomsRes, notifRes] = await Promise.all([
          supabase.from('users').select('first_name, last_name').eq('user_id', user.id).single(),
          supabase.from('user_profiles').select('selected_cleaning_weekday, selected_cleaning_time, neat_freak_score, dwelling_type_id, cleaner_categories(name)').eq('user_id', user.id).single(),
          supabase.from('user_room_priorities').select('rooms(name)').eq('user_id', user.id).order('priority_rank'),
          supabase.from('user_notification_preferences').select('enable_push, enable_in_app, sound_id').eq('user_id', user.id).single(),
        ]);

        const p = profileRes.data;
        const roomNames = (roomsRes.data || []).map((r: any) => r.rooms?.name).filter(Boolean);

        setUserProfile({
          firstName: userRes.data?.first_name || '',
          lastName: userRes.data?.last_name || '',
          email: user.email || '',
          cleaningDay: p?.selected_cleaning_weekday != null ? dayNames[p.selected_cleaning_weekday] : 'Saturday',
          cleaningTime: p?.selected_cleaning_time ? p.selected_cleaning_time.slice(0, 5) : '09:00',
          dwellingType: ({ 1: 'Apartment', 2: 'House', 3: 'Studio' } as Record<number, string>)[p?.dwelling_type_id] || 'Apartment',
          neatFreakScore: p?.neat_freak_score || 0,
          neatFreakCategory: (p?.cleaner_categories as any)?.name || '',
          priorityRooms: roomNames,
          notifications: {
            pushEnabled: notifRes.data?.enable_push ?? true,
            inAppEnabled: notifRes.data?.enable_in_app ?? true,
            soundId: notifRes.data?.sound_id ?? 1,
          }
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const dayIndex = dayNames.indexOf(userProfile.cleaningDay);
      const dwellingId = dwellingTypeIdMap[userProfile.dwellingType];
      await Promise.all([
        supabase.from('users').update({ first_name: userProfile.firstName, last_name: userProfile.lastName }).eq('user_id', user.id),
        supabase.from('user_profiles').update({
          selected_cleaning_weekday: dayIndex,
          selected_cleaning_time: userProfile.cleaningTime,
          ...(dwellingId ? { dwelling_type_id: dwellingId } : {}),
        }).eq('user_id', user.id),
      ]);
      alert('Profile saved successfully!');
    } catch (err) {
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Save to database
      await supabase.from('user_notification_preferences').upsert({
        user_id: user.id,
        enable_push: userProfile.notifications.pushEnabled,
        enable_in_app: userProfile.notifications.inAppEnabled,
        sound_id: userProfile.notifications.soundId,
      });
      
      // Request permission if enabling push, then schedule
      if (userProfile.notifications.pushEnabled && notificationService.isSupported()) {
        const granted = Notification.permission === 'granted'
          ? true
          : await notificationService.requestPermission();
        if (granted) {
          notificationService.scheduleNotification(
            userProfile.cleaningTime,
            'Time to start your cleaning routine!'
          );
        }
      }

      alert('Notification preferences saved!');
    } catch (err) {
      alert('Failed to save notifications.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'about', name: 'About', icon: DocumentTextIcon }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem 0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '2rem', width: '2rem', backgroundColor: '#2563eb', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>CB</span>
                </div>
                <span style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Cleaning Buddy</span>
              </Link>
            </div>
            <nav style={{ display: 'flex', gap: '2rem' }}>
              <Link to="/dashboard" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Dashboard</Link>
              <Link to="/tasks" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>My Tasks</Link>
              <Link to="/room-checklists" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Checklists</Link>
              <Link to="/analytics" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Analytics</Link>
              <Link to="/tips" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Tips</Link>
              <Link to="/settings" style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>Settings</Link>
              <Link to="/help" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Help</Link>
              <button onClick={handleSignOut} style={{ color: '#dc2626', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'} onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}>Sign Out</button>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <nav style={{ display: 'flex', gap: '2rem' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '1rem 0', borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent', fontSize: '0.875rem', fontWeight: '500', color: activeTab === tab.id ? '#2563eb' : '#6b7280', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseOver={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = '#111827' }}
                  onMouseOut={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = '#6b7280' }}
                >
                  <tab.icon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Profile Settings</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>First Name</label>
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                      style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Last Name</label>
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                      style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    disabled
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Cleaning Day</label>
                    <select
                      value={userProfile.cleaningDay}
                      onChange={(e) => setUserProfile({...userProfile, cleaningDay: e.target.value})}
                      style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Cleaning Time</label>
                    <input
                      type="time"
                      value={userProfile.cleaningTime}
                      onChange={(e) => setUserProfile({...userProfile, cleaningTime: e.target.value})}
                      style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Dwelling Type</label>
                  <select
                    value={userProfile.dwellingType}
                    onChange={(e) => setUserProfile({...userProfile, dwellingType: e.target.value})}
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Priority Rooms</label>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    {userProfile.priorityRooms.join(', ')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: saving ? '#9ca3af' : '#2563eb', cursor: saving ? 'not-allowed' : 'pointer' }}
                    onMouseOver={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                    onMouseOut={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>Sign out of your account on this device.</p>
                  <button
                    onClick={handleSignOut}
                    style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1px solid #fca5a5', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#dc2626', backgroundColor: 'white', cursor: 'pointer' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Notification Settings</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <BellIcon style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af', marginRight: '0.75rem' }} />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Push Notifications</h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Receive reminders on your mobile device</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUserProfile({
                        ...userProfile,
                        notifications: {
                          ...userProfile.notifications,
                          pushEnabled: !userProfile.notifications.pushEnabled
                        }
                      })}
                      style={{ position: 'relative', display: 'inline-flex', height: '1.5rem', width: '2.75rem', flexShrink: 0, cursor: 'pointer', borderRadius: '9999px', border: '2px solid transparent', transition: 'colors 0.2s ease-in-out', backgroundColor: userProfile.notifications.pushEnabled ? '#2563eb' : '#e5e7eb' }}
                    >
                      <span
                        style={{ display: 'inline-block', height: '1.25rem', width: '1.25rem', borderRadius: '9999px', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', transform: userProfile.notifications.pushEnabled ? 'translateX(1.25rem)' : 'translateX(0)', transition: 'transform 0.2s ease-in-out' }}
                      />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <BellIcon style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af', marginRight: '0.75rem' }} />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>In-App Notifications</h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>See notifications within the app</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUserProfile({
                        ...userProfile,
                        notifications: {
                          ...userProfile.notifications,
                          inAppEnabled: !userProfile.notifications.inAppEnabled
                        }
                      })}
                      style={{ position: 'relative', display: 'inline-flex', height: '1.5rem', width: '2.75rem', flexShrink: 0, cursor: 'pointer', borderRadius: '9999px', border: '2px solid transparent', transition: 'colors 0.2s ease-in-out', backgroundColor: userProfile.notifications.inAppEnabled ? '#2563eb' : '#e5e7eb' }}
                    >
                      <span
                        style={{ display: 'inline-block', height: '1.25rem', width: '1.25rem', borderRadius: '9999px', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', transform: userProfile.notifications.inAppEnabled ? 'translateX(1.25rem)' : 'translateX(0)', transition: 'transform 0.2s ease-in-out' }}
                      />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Cog6ToothIcon style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af', marginRight: '0.75rem' }} />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Notification Sound</h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Choose alert sound</p>
                      </div>
                    </div>
                    <select
                      value={userProfile.notifications.soundId}
                      onChange={(e) => setUserProfile({
                        ...userProfile,
                        notifications: {
                          ...userProfile.notifications,
                          soundId: parseInt(e.target.value)
                        }
                      })}
                      style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}
                    >
                      <option value={1}>Default Chime</option>
                      <option value={2}>Gentle Bell</option>
                      <option value={3}>Soft Alert</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ClockIcon style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af', marginRight: '0.75rem' }} />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Reminder Time</h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Notifications are sent at your cleaning start time</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {userProfile.cleaningTime}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    onClick={saveNotifications}
                    disabled={saving}
                    style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: saving ? '#9ca3af' : '#2563eb', cursor: saving ? 'not-allowed' : 'pointer' }}
                    onMouseOver={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                    onMouseOut={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                  >
                    {saving ? 'Saving...' : 'Save Notifications'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>About Cleaning Buddy</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ height: '4rem', width: '4rem', backgroundColor: '#2563eb', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>CB</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginTop: '1rem' }}>Cleaning Buddy</h3>
                    <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>Version 1.0.0</p>
                    <p style={{ color: '#4b5563' }}>
                      Your personal assistant for maintaining a clean and organized home.
                      Built with React, TypeScript, Express, and Supabase.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>Features</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', listStyle: 'none', padding: 0 }}>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#22c55e', borderRadius: '9999px', marginRight: '0.5rem' }}></div>
                          Personalized cleaning schedules
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#22c55e', borderRadius: '9999px', marginRight: '0.5rem' }}></div>
                          Room-specific checklists
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#22c55e', borderRadius: '9999px', marginRight: '0.5rem' }}></div>
                          Progress tracking and analytics
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#22c55e', borderRadius: '9999px', marginRight: '0.5rem' }}></div>
                          Cleaning tips and best practices
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
