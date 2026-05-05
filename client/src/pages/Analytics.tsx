import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const Analytics: React.FC = () => {
  // Get user profile from localStorage
  const getUserProfile = () => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      dwellingType: 'House' // default
    };
  };

  const userProfile = getUserProfile();
  
  // Calculate tasks based on dwelling type
  const getTasksForDwellingType = (dwellingType: string) => {
    const taskCounts = {
      'Kitchen': 11,
      'Bathroom': 7, 
      'Bedroom': 8,
      'Living Room': 5,
      'Laundry': 5
    };

    switch (dwellingType) {
      case 'Studio':
        // Studio: Kitchen + Bathroom + Living Room (Bedroom combined with Living Room)
        return taskCounts['Kitchen'] + taskCounts['Bathroom'] + taskCounts['Living Room'];
      case 'Apartment':
        // Apartment: All rooms except Laundry is optional
        return taskCounts['Kitchen'] + taskCounts['Bathroom'] + taskCounts['Bedroom'] + taskCounts['Living Room'] + Math.floor(taskCounts['Laundry'] * 0.5);
      case 'House':
      default:
        // House: All rooms
        return taskCounts['Kitchen'] + taskCounts['Bathroom'] + taskCounts['Bedroom'] + taskCounts['Living Room'] + taskCounts['Laundry'];
    }
  };

  // Mock data - replace with actual API calls
  const weeklyHealthScore = 85;
  const weeklyTrend = '+12% from last week';
  const tasksThisWeek = getTasksForDwellingType(userProfile.dwellingType);
  const roomStats = [
    { room: 'Kitchen', completionRate: 92, timeSpent: 45, mostMissed: false },
    { room: 'Bathroom', completionRate: 100, timeSpent: 30, mostMissed: false },
    { room: 'Bedroom', completionRate: 67, timeSpent: 25, mostMissed: true },
    { room: 'Living Room', completionRate: 80, timeSpent: 20, mostMissed: false },
    { room: 'Laundry', completionRate: 75, timeSpent: 35, mostMissed: false }
  ];

  const monthlyData = [
    { week: 'Week 1', score: 75, completed: 28, total: 35 },
    { week: 'Week 2', score: 82, completed: 32, total: 39 },
    { week: 'Week 3', score: 88, completed: 34, total: 38 },
    { week: 'Week 4', score: 85, completed: 30, total: 35 }
  ];

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? (
      <ArrowUpIcon className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-5 w-5 text-red-500" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: '#dcfce7', text: '#16a34a' };
    if (score >= 75) return { bg: '#dbeafe', text: '#2563eb' };
    if (score >= 60) return { bg: '#fef9c3', text: '#ca8a04' };
    return { bg: '#fee2e2', text: '#dc2626' };
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return { bg: '#dcfce7', text: '#16a34a' };
    if (rate >= 75) return { bg: '#dbeafe', text: '#2563eb' };
    if (rate >= 60) return { bg: '#fef9c3', text: '#ca8a04' };
    return { bg: '#fee2e2', text: '#dc2626' };
  };

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
                      <span style={{ fontSize: '2.25rem', fontWeight: 'bold', color: getScoreColor(weeklyHealthScore).text }}>
                        {weeklyHealthScore}%
                      </span>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {getTrendIcon(weeklyTrend)}
                        <span style={{ marginLeft: '0.25rem' }}>{weeklyTrend}</span>
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
              <div style={{ marginTop: '1rem', backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  <span style={{ fontWeight: '500', color: '#16a34a' }}>Great improvement!</span> You're {weeklyTrend.toLowerCase()} than last week.
                </p>
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
                      <dd style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>3 weeks</dd>
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
            <div style={{ padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {roomStats.map((room) => (
                  <div key={room.room} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{room.room}</div>
                      {room.mostMissed && (
                        <span style={{ marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                          Most Missed
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getCompletionColor(room.completionRate).text }}>
                        {room.completionRate}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {room.timeSpent} min this week
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Monthly Trends</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Weekly Scores</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>4-week average:</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#2563eb' }}>82.5%</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {monthlyData.map((week) => (
                  <div key={week.week} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '6rem', fontSize: '0.875rem', color: '#4b5563', textAlign: 'right', paddingRight: '0.5rem' }}>
                      {week.week}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '1.5rem', position: 'relative' }}>
                        <div style={{ backgroundColor: '#2563eb', height: '1.5rem', borderRadius: '9999px', transition: 'all 0.3s ease', width: `${(week.score / 100) * 100}%` }} />
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '500', color: 'white' }}>
                          {week.score}%
                        </span>
                      </div>
                    </div>
                    <div style={{ width: '4rem', fontSize: '0.875rem', color: '#4b5563', paddingLeft: '0.5rem' }}>
                      {week.completed}/{week.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <button onClick={() => alert('Exporting analytics data as PDF...')} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
              <ChartBarIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Export as PDF
            </button>
            <button onClick={() => alert('Exporting analytics data as CSV...')} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer', marginLeft: '0.25rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
              <ChartBarIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Export as CSV
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
