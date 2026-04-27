import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const MyTasks: React.FC = () => {
  const navigate = useNavigate();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  
  // Default rooms data
  const defaultRooms = [
    { 
      id: 1, 
      name: 'Kitchen', 
      icon: '🍳',
      totalTasks: 11,
      completedTasks: 8,
      status: 'in-progress',
      nextScheduled: 'Tomorrow, 9:00 AM'
    },
    { 
      id: 2, 
      name: 'Bathroom', 
      icon: '🚿',
      totalTasks: 7,
      completedTasks: 7,
      status: 'completed',
      nextScheduled: 'Next week, 9:00 AM'
    },
    { 
      id: 3, 
      name: 'Bedroom', 
      icon: '🛏',
      totalTasks: 8,
      completedTasks: 3,
      status: 'pending',
      nextScheduled: 'Saturday, 10:00 AM'
    },
    { 
      id: 4, 
      name: 'Living Room', 
      icon: '🛋',
      totalTasks: 5,
      completedTasks: 2,
      status: 'pending',
      nextScheduled: 'Saturday, 11:00 AM'
    },
    { 
      id: 5, 
      name: 'Laundry', 
      icon: '🧺',
      totalTasks: 5,
      completedTasks: 0,
      status: 'pending',
      nextScheduled: 'Saturday, 2:00 PM'
    }
  ];
  
  const [rooms, setRooms] = useState(defaultRooms);

  // Load rooms from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rooms');
    if (saved) {
      try {
        setRooms(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved rooms:', e);
      }
    }
  }, []);

  // Save rooms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  const currentWeek = 'March 24 - March 30, 2026';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' };
      case 'in-progress': return { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' };
      case 'pending': return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
      default: return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

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
                style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
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
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>My Tasks</h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cleaning Schedule for {currentWeek}</p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <PlusIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Quick Add Task
            </button>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {rooms.map((room) => {
            const completionPercentage = getCompletionPercentage(room.completedTasks, room.totalTasks);
            const statusColors = getStatusColor(room.status);
            
            return (
              <div key={room.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden', transition: 'box-shadow 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px 0 rgba(0, 0, 0, 0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}>
                <div style={{ padding: '1.5rem' }}>
                  {/* Room Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '2rem', marginRight: '0.75rem' }}>{room.icon}</div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{room.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {room.completedTasks} of {room.totalTasks} tasks complete
                        </p>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: statusColors.bg, color: statusColors.text }}>
                      {room.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                      <span>Progress</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                      <div
                        style={{ backgroundColor: '#2563eb', height: '0.5rem', borderRadius: '9999px', transition: 'all 0.3s ease', width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Room Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                      <CheckCircleIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', color: '#22c55e' }} />
                      <span>Completed: {room.completedTasks}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                      <div style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
                      <span>Remaining: {room.totalTasks - room.completedTasks}</span>
                    </div>

                    {room.nextScheduled && (
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                        <ClockIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', color: '#6b7280' }} />
                        <span>Next: {room.nextScheduled}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <Link
                      to={`/room-checklists?room=${room.id}`}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.625rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      View Tasks
                      <ChevronRightIcon style={{ height: '1rem', width: '1rem', marginLeft: '0.5rem' }} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>Weekly Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {rooms.reduce((sum, room) => sum + room.completedTasks, 0)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {rooms.reduce((sum, room) => sum + room.totalTasks, 0)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Tasks</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                {Math.round(
                  (rooms.reduce((sum, room) => sum + room.completedTasks, 0) /
                   rooms.reduce((sum, room) => sum + room.totalTasks, 0)) * 100
                )}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completion Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                {rooms.filter(room => room.status === 'completed').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rooms Completed</div>
            </div>
          </div>
        </div>
      </main>

      {showAddTaskModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.5)', overflowY: 'auto', height: '100%', width: '100%', zIndex: 50 }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '28rem', width: '100%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Quick Add Task</h3>
                <button onClick={() => setShowAddTaskModal(false)} style={{ color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  <XMarkIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Task Name</label>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter task name..."
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Room</label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => { setShowAddTaskModal(false); setNewTaskName(''); }} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Cancel
                </button>
                <button onClick={() => { if (newTaskName.trim()) { 
                  // Navigate to room-checklists with task in URL params
                  navigate(`/room-checklists?room=${selectedRoomId}&newTask=${encodeURIComponent(newTaskName)}`);
                  setShowAddTaskModal(false); 
                  setNewTaskName('');
                } }} disabled={!newTaskName.trim()} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer', opacity: !newTaskName.trim() ? 0.5 : 1 }} onMouseOver={(e) => { if (newTaskName.trim()) e.currentTarget.style.backgroundColor = '#1d4ed8' }} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
