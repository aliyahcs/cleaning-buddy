import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [priorityRooms, setPriorityRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) { setError('Not authenticated'); return; }

        const [userRes, profileRes, priorityRes, roomsRes, templateRes, completionsRes, customTasksRes] = await Promise.all([
          supabase.from('users').select('first_name, last_name').eq('user_id', user.id).single(),
          supabase.from('user_profiles').select('selected_cleaning_weekday, selected_cleaning_time, neat_freak_score, cleaner_categories(name)').eq('user_id', user.id).single(),
          supabase.from('user_room_priorities').select('room_id, priority_rank').eq('user_id', user.id).order('priority_rank'),
          supabase.from('rooms').select('room_id, name'),
          supabase.from('task_templates').select('task_template_id, room_id').eq('is_active', true),
          supabase.from('user_task_completions').select('task_template_id, postponed').eq('user_id', user.id),
          supabase.from('user_custom_tasks').select('room_id, completed, postponed').eq('user_id', user.id),
        ]);

        if (userRes.error) throw userRes.error;

        const iconMap: Record<string, string> = { 'kitchen': '🍳', 'bathroom': '🚿', 'bedroom': '🛏', 'living room': '🛋', 'laundry': '🧺' };
        const roomNameMap: Record<number, string> = {};
        (roomsRes.data || []).forEach((r: any) => { roomNameMap[r.room_id] = r.name; });

        const templateRoomMap: Record<number, number> = {};
        const taskCounts: Record<number, number> = {};
        (templateRes.data || []).forEach((t: any) => {
          templateRoomMap[t.task_template_id] = t.room_id;
          taskCounts[t.room_id] = (taskCounts[t.room_id] || 0) + 1;
        });
        (customTasksRes.data || []).forEach((ct: any) => {
          taskCounts[ct.room_id] = (taskCounts[ct.room_id] || 0) + 1;
        });

        const completedCounts: Record<number, number> = {};
        (completionsRes.data || []).filter((c: any) => !c.postponed).forEach((c: any) => {
          const rId = templateRoomMap[c.task_template_id];
          if (rId) completedCounts[rId] = (completedCounts[rId] || 0) + 1;
        });
        (customTasksRes.data || []).filter((ct: any) => ct.completed && !ct.postponed).forEach((ct: any) => {
          completedCounts[ct.room_id] = (completedCounts[ct.room_id] || 0) + 1;
        });

        setPriorityRooms((priorityRes.data || []).map((p: any) => {
          const name = roomNameMap[p.room_id] || 'Unknown';
          return {
            roomId: p.room_id,
            rank: p.priority_rank,
            name,
            icon: iconMap[name.toLowerCase()] || '🏠',
            completed: completedCounts[p.room_id] || 0,
            total: taskCounts[p.room_id] || 0,
          };
        }));

        setUserData({ ...userRes.data, profile: profileRes.data });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#dc2626' }}>Error: {error}</div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const userName = userData?.first_name || 'User';
  const cleaningDay = userData?.profile?.selected_cleaning_weekday != null
    ? dayNames[userData.profile.selected_cleaning_weekday] : '—';
  const cleaningTime = userData?.profile?.selected_cleaning_time
    ? formatTime(userData.profile.selected_cleaning_time) : '—';
  const weeklyHealthScore = userData?.profile?.neat_freak_score ?? '—';
  const neatFreakCategory = (userData?.profile?.cleaner_categories as any)?.name || 'Cleaning Buddy';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Navigation Header */}
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
              <Link
                to="/dashboard"
                style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                My Tasks
              </Link>
              <Link
                to="/room-checklists"
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Checklists
              </Link>
              <Link
                to="/analytics"
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Analytics
              </Link>
              <Link
                to="/tips"
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Tips
              </Link>
              <Link
                to="/settings"
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        {/* Welcome Section - Centered */}
        <div style={{ 
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Welcome back, {userName}!
          </h1>
          <p style={{ color: '#dbeafe', marginBottom: '1rem' }}>
            Your next cleaning day is <span style={{ fontWeight: '600' }}>{cleaningDay}</span> at <span style={{ fontWeight: '600' }}>{cleaningTime}</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <SparklesIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{neatFreakCategory}</span>
          </div>
        </div>

        <div className="cb-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Weekly Health Score Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, backgroundColor: '#22c55e', borderRadius: '0.375rem', padding: '0.625rem' }}>
                  <FireIcon style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
                </div>
                <div style={{ marginLeft: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Weekly Health Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>{weeklyHealthScore}%</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1rem', marginTop: '1rem', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#16a34a' }}>
                  <span style={{ fontWeight: '500' }}>Great job!</span> You're above average this week.
                </div>
              </div>
            </div>
          </div>

          {/* Cleaning Day Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, backgroundColor: '#3b82f6', borderRadius: '0.375rem', padding: '0.625rem' }}>
                  <CalendarIcon style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
                </div>
                <div style={{ marginLeft: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Next Cleaning Day</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{cleaningDay}</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1rem', marginTop: '1rem', borderRadius: '0.375rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                  <ClockIcon style={{ height: '0.875rem', width: '0.875rem', marginRight: '0.25rem' }} />
                  Scheduled for {cleaningTime}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, backgroundColor: '#8b5cf6', borderRadius: '0.375rem', padding: '0.625rem' }}>
                  <HomeIcon style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
                </div>
                <div style={{ marginLeft: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Quick Actions</div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                      to="/room-checklists"
                      style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}
                    >
                      <CheckCircleIcon style={{ height: '0.875rem', width: '0.875rem', marginRight: '0.25rem' }} />
                      Start Cleaning
                    </Link>
                    <Link
                      to="/tasks"
                      style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}
                    >
                      <CalendarIcon style={{ height: '0.875rem', width: '0.875rem', marginRight: '0.25rem' }} />
                      View Schedule
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Rooms Section */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Priority Rooms</h2>
            <Link to="/tasks" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}>
              View all rooms →
            </Link>
          </div>

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.375rem', overflow: 'hidden' }}>
            {priorityRooms.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                No priority rooms set yet. Complete the initial setup to flag your most important rooms.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {priorityRooms.map((room) => (
                  <li key={room.roomId} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{room.icon}</span>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{room.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {room.total > 0 ? `${room.completed}/${room.total} tasks complete` : 'Flagged as high priority'}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {room.total > 0 && room.completed === room.total ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                          ✓ Done
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: room.rank === 1 ? '#fee2e2' : '#fef9c3', color: room.rank === 1 ? '#dc2626' : '#92400e' }}>
                          ★ Priority {room.rank}
                        </span>
                      )}
                      <Link to={`/room-checklists?room=${room.roomId}`} style={{ padding: '0.375rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '500', color: '#374151', textDecoration: 'none', backgroundColor: 'white' }}>
                        View Tasks
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
