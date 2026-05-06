import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

const TASKS_BY_DWELLING: Record<number, number> = {
  1: 31, // Apartment: Kitchen + Bathroom + Bedroom + Living Room
  2: 36, // House: all 5 rooms
  3: 23, // Studio: Kitchen + Bathroom + Living Room
};

export const Analytics: React.FC = () => {
  const [scoreCopied, setScoreCopied] = useState(false);
  const [weeklyHealthScore, setWeeklyHealthScore] = useState<number | null>(null);
  const [totalTasks, setTotalTasks] = useState(36);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('neat_freak_score, dwelling_type_id')
          .eq('user_id', user.id)
          .single();
        setWeeklyHealthScore(profile?.neat_freak_score ?? null);
        setTotalTasks(TASKS_BY_DWELLING[profile?.dwelling_type_id ?? 2] ?? 36);
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
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <ChartBarIcon style={{ height: '2.5rem', width: '2.5rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>No history yet</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Complete your first cleaning session to see room stats here.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Monthly Trends</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <ChartBarIcon style={{ height: '2.5rem', width: '2.5rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>No history yet</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Your weekly scores will appear here after you complete cleaning sessions.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
