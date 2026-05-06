import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

const TASKS_BY_DWELLING: Record<number, number> = {
  1: 36,
  2: 36,
  3: 36,
};

function getLast6Months(): { year: number; month: number; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString('default', { month: 'short' }),
    });
  }
  return result;
}

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/login'); };
  const [scoreCopied, setScoreCopied] = useState(false);
  const [weeklyHealthScore, setWeeklyHealthScore] = useState<number | null>(null);
  const [totalTasks, setTotalTasks] = useState(36);
  const [roomStats, setRoomStats] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<{ label: string; pct: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [{ data: profile }, { data: templates }, { data: completionsData }, { data: customTasksData }, { data: roomsData }] = await Promise.all([
          supabase.from('user_profiles').select('neat_freak_score, dwelling_type_id').eq('user_id', user.id).single(),
          supabase.from('task_templates').select('task_template_id, room_id').eq('is_active', true),
          supabase.from('user_task_completions').select('task_template_id, postponed, created_at').eq('user_id', user.id),
          supabase.from('user_custom_tasks').select('room_id, completed, postponed, created_at').eq('user_id', user.id),
          supabase.from('rooms').select('room_id, name').order('room_id'),
        ]);

        setWeeklyHealthScore(profile?.neat_freak_score ?? null);

        const iconMap: Record<string, string> = { 'kitchen': '🍳', 'bathroom': '🚿', 'bedroom': '🛏', 'living room': '🛋', 'laundry': '🧺' };
        const templateRoomMap: Record<number, number> = {};
        const taskCounts: Record<number, number> = {};
        (templates || []).forEach((t: any) => {
          templateRoomMap[t.task_template_id] = t.room_id;
          taskCounts[t.room_id] = (taskCounts[t.room_id] || 0) + 1;
        });
        (customTasksData || []).forEach((ct: any) => {
          taskCounts[ct.room_id] = (taskCounts[ct.room_id] || 0) + 1;
        });

        const completedCounts: Record<number, number> = {};
        (completionsData || []).filter((c: any) => !c.postponed).forEach((c: any) => {
          const rId = templateRoomMap[c.task_template_id];
          if (rId) completedCounts[rId] = (completedCounts[rId] || 0) + 1;
        });
        (customTasksData || []).filter((ct: any) => ct.completed && !ct.postponed).forEach((ct: any) => {
          completedCounts[ct.room_id] = (completedCounts[ct.room_id] || 0) + 1;
        });

        const dbTotal = Object.values(taskCounts).reduce((sum, n) => sum + n, 0);
        const total = dbTotal || (TASKS_BY_DWELLING[profile?.dwelling_type_id ?? 2] ?? 36);
        setTotalTasks(total);

        const trends = getLast6Months().map(({ year, month, label }) => {
          const templateCompletions = (completionsData || []).filter((c: any) => {
            if (c.postponed || !c.created_at) return false;
            const d = new Date(c.created_at);
            return d.getFullYear() === year && d.getMonth() === month;
          }).length;
          const customCompletions = (customTasksData || []).filter((ct: any) => {
            if (!ct.completed || ct.postponed || !ct.created_at) return false;
            const d = new Date(ct.created_at);
            return d.getFullYear() === year && d.getMonth() === month;
          }).length;
          const pct = total > 0 ? Math.min(Math.round(((templateCompletions + customCompletions) / total) * 100), 100) : 0;
          return { label, pct };
        });
        setMonthlyTrends(trends);

        setRoomStats(
          (roomsData || [])
            .filter((r: any) => taskCounts[r.room_id] > 0)
            .map((r: any) => ({
              name: r.name,
              icon: iconMap[r.name.toLowerCase()] || '🏠',
              completed: completedCounts[r.room_id] || 0,
              total: taskCounts[r.room_id] || 0,
            }))
        );
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const score = weeklyHealthScore ?? 0;
  const tasksThisWeek = totalTasks;

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: '#dcfce7', text: '#16a34a' };
    if (score >= 75) return { bg: '#dbeafe', text: '#2563eb' };
    if (score >= 60) return { bg: '#fef9c3', text: '#ca8a04' };
    return { bg: '#fee2e2', text: '#dc2626' };
  };

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
              <Link to="/analytics" style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>Analytics</Link>
              <Link to="/tips" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Tips</Link>
              <Link to="/settings" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Settings</Link>
              <Link to="/help" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Help</Link>
              <button onClick={handleSignOut} style={{ color: '#dc2626', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'} onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}>Sign Out</button>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Analytics</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Track your cleaning progress and identify patterns</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, background: 'linear-gradient(to right, #3b82f6, #9333ea)', borderRadius: '0.375rem', padding: '0.75rem' }}>
                  <FireIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                </div>
                <div style={{ marginLeft: '1.25rem', flex: 1 }}>
                  <dl>
                    <dt style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Weekly Health Score</dt>
                    <dd style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '2.25rem', fontWeight: 'bold', color: getScoreColor(score).text }}>
                        {score}%
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
              <div style={{ marginTop: '1rem', backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                  Your cleanliness score based on your quiz results.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`My Cleaning Buddy health score: ${score}% 🧹`);
                    setScoreCopied(true);
                    setTimeout(() => setScoreCopied(false), 2000);
                  }}
                  style={{ marginLeft: '1rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '500', color: scoreCopied ? '#16a34a' : '#374151', backgroundColor: scoreCopied ? '#f0fdf4' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {scoreCopied ? '✓ Copied!' : '📋 Share Score'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flexShrink: 0, backgroundColor: '#22c55e', borderRadius: '0.375rem', padding: '0.75rem' }}>
                    <CheckCircleIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ marginLeft: '1.25rem', flex: 1 }}>
                    <dl>
                      <dt style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Current Streak</dt>
                      <dd style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>0 weeks</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flexShrink: 0, backgroundColor: '#3b82f6', borderRadius: '0.375rem', padding: '0.75rem' }}>
                    <CalendarIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ marginLeft: '1.25rem', flex: 1 }}>
                    <dl>
                      <dt style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tasks This Week</dt>
                      <dd style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{tasksThisWeek}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Room Performance</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            {roomStats.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <ChartBarIcon style={{ height: '2.5rem', width: '2.5rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>No history yet</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Visit your checklists and start marking tasks complete to see stats here.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {roomStats.map((room) => {
                  const pct = room.total > 0 ? Math.min(Math.round((room.completed / room.total) * 100), 100) : 0;
                  const isComplete = pct === 100;
                  return (
                    <li key={room.name} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{room.icon}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{room.name}</span>
                          {isComplete && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#dcfce7', color: '#16a34a' }}>✓ Complete</span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{room.completed}/{room.total}</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                        <div style={{ backgroundColor: isComplete ? '#22c55e' : '#2563eb', height: '0.5rem', borderRadius: '9999px', width: `${pct}%`, transition: 'width 0.3s ease' }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Monthly Trends</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
            {monthlyTrends.every(m => m.pct === 0) ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <ChartBarIcon style={{ height: '2.5rem', width: '2.5rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>No history yet</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Complete tasks to see your monthly completion trends.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '8rem' }}>
                  {monthlyTrends.map(({ label, pct }) => (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{pct > 0 ? `${pct}%` : ''}</span>
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: pct >= 75 ? '#22c55e' : pct >= 40 ? '#3b82f6' : '#e5e7eb',
                          borderRadius: '0.25rem 0.25rem 0 0',
                          height: pct > 0 ? `${Math.max(pct, 4)}%` : '4%',
                          transition: 'height 0.4s ease',
                          minHeight: '3px',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {monthlyTrends.map(({ label }) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>{label}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', backgroundColor: '#22c55e', borderRadius: '2px' }} /> 75%+</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', backgroundColor: '#3b82f6', borderRadius: '2px' }} /> 40–74%</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '2px' }} /> Under 40%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
