import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  postponed: boolean;
  dueDate?: string; // Full date and time string
}

interface Room {
  id: number;
  name: string;
  icon: string;
  tasks: Task[];
}

export const RoomChecklists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
  // Default rooms data
  const defaultRooms: Room[] = [
    {
      id: 1,
      name: 'Kitchen',
      icon: '🍳',
      tasks: [
        { id: 1, name: 'Wipe down counter tops', completed: true, postponed: false, dueDate: 'Tomorrow, 9:00 AM' },
        { id: 2, name: 'Clean out refrigerator', completed: true, postponed: false, dueDate: 'Tomorrow, 9:30 AM' },
        { id: 3, name: 'Wipe down stove', completed: false, postponed: false, dueDate: 'Tomorrow, 10:00 AM' },
        { id: 4, name: 'Clean oven', completed: false, postponed: false, dueDate: 'Tomorrow, 10:30 AM' },
        { id: 5, name: 'Wash dishes', completed: true, postponed: false, dueDate: 'Tomorrow, 11:00 AM' },
        { id: 6, name: 'Wipe down walls', completed: false, postponed: false, dueDate: 'Tomorrow, 11:30 AM' },
        { id: 7, name: 'Sweep floor', completed: true, postponed: false, dueDate: 'Tomorrow, 12:00 PM' },
        { id: 8, name: 'Mop floors', completed: false, postponed: false, dueDate: 'Tomorrow, 12:30 PM' },
        { id: 9, name: 'Clean microwave', completed: true, postponed: false, dueDate: 'Tomorrow, 1:00 PM' },
        { id: 10, name: 'Clean cabinet under sink', completed: false, postponed: false, dueDate: 'Tomorrow, 1:30 PM' },
        { id: 11, name: 'Take out trash/recyclables', completed: false, postponed: false, dueDate: 'Tomorrow, 6:00 PM' }
      ]
    },
    {
      id: 2,
      name: 'Bathroom',
      icon: '🚿',
      tasks: [
        { id: 12, name: 'Clean toilet', completed: true, postponed: false, dueDate: 'Tomorrow, 9:00 AM' },
        { id: 13, name: 'Clean bathtub/shower', completed: false, postponed: false, dueDate: 'Tomorrow, 10:30 AM' },
        { id: 14, name: 'Sweep floor', completed: true, postponed: false, dueDate: 'Tomorrow, 11:00 AM' },
        { id: 15, name: 'Mop floor', completed: false, postponed: false, dueDate: 'Tomorrow, 11:30 AM' },
        { id: 16, name: 'Clean mirror', completed: true, postponed: false, dueDate: 'Tomorrow, 12:00 PM' },
        { id: 17, name: 'Clean sink and countertop', completed: false, postponed: false, dueDate: 'Tomorrow, 12:30 PM' },
        { id: 18, name: 'Clean cabinet under sink', completed: false, postponed: false, dueDate: 'Tomorrow, 1:00 PM' }
      ]
    },
    {
      id: 3,
      name: 'Bedroom',
      icon: '🛏',
      tasks: [
        { id: 19, name: 'Make bed', completed: true, postponed: false, dueDate: 'Tomorrow, 9:00 AM' },
        { id: 20, name: 'Vacuum', completed: false, postponed: false, dueDate: 'Tomorrow, 11:00 AM' },
        { id: 21, name: 'Clean window seals', completed: false, postponed: false, dueDate: 'Tomorrow, 11:30 AM' },
        { id: 22, name: 'Clean baseboards', completed: false, postponed: false, dueDate: 'Tomorrow, 12:00 PM' },
        { id: 23, name: 'Remove dishes/debris', completed: true, postponed: false, dueDate: 'Tomorrow, 12:30 PM' },
        { id: 24, name: 'Dust', completed: false, postponed: false, dueDate: 'Tomorrow, 1:00 PM' },
        { id: 25, name: 'Clean off dresser', completed: false, postponed: false, dueDate: 'Tomorrow, 1:30 PM' },
        { id: 26, name: 'Clean windowsill', completed: false, postponed: false, dueDate: 'Tomorrow, 2:00 PM' }
      ]
    },
    {
      id: 4,
      name: 'Living Room',
      icon: '🛋',
      tasks: [
        { id: 27, name: 'Vacuum floor', completed: false, postponed: false, dueDate: 'Tomorrow, 11:30 AM' },
        { id: 28, name: 'Wipe down furniture with pledge', completed: false, postponed: false, dueDate: 'Tomorrow, 12:00 PM' },
        { id: 29, name: 'Dust', completed: false, postponed: false, dueDate: 'Tomorrow, 12:30 PM' },
        { id: 30, name: 'Discard debris', completed: true, postponed: false, dueDate: 'Tomorrow, 1:00 PM' },
        { id: 31, name: 'Clean windowsill', completed: false, postponed: false, dueDate: 'Tomorrow, 1:30 PM' }
      ]
    },
    {
      id: 5,
      name: 'Laundry',
      icon: '🧺',
      tasks: [
        { id: 32, name: 'Separate clothes', completed: false, postponed: false, dueDate: 'Tomorrow, 2:00 PM' },
        { id: 33, name: 'Wash whites', completed: false, postponed: false, dueDate: 'Tomorrow, 2:30 PM' },
        { id: 34, name: 'Wash colors', completed: false, postponed: false, dueDate: 'Tomorrow, 3:00 PM' },
        { id: 35, name: 'Fold clothes', completed: false, postponed: false, dueDate: 'Tomorrow, 3:30 PM' },
        { id: 36, name: 'Put clothes away', completed: false, postponed: false, dueDate: 'Tomorrow, 4:00 PM' }
      ]
    }
  ];

  const [rooms, setRooms] = useState<Room[]>(defaultRooms);

  // Load rooms from localStorage on mount
  useEffect(() => {
    const loadRooms = () => {
      const saved = localStorage.getItem('roomChecklists');
      if (saved) {
        try {
          setRooms(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved rooms:', e);
        }
      }
    };
    
    loadRooms();
    
    // Check if there's a new task to add from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const newTaskName = urlParams.get('newTask');
    const newTaskRoom = urlParams.get('room');
    
    if (newTaskName && newTaskRoom) {
      setRooms(prevRooms => {
        const roomIndex = prevRooms.findIndex(r => r.id.toString() === newTaskRoom);
        if (roomIndex !== -1) {
          const newTaskId = Math.max(...prevRooms[roomIndex].tasks.map(t => t.id), 0) + 1;
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
          const timeStr = tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          
          const updatedRooms = [...prevRooms];
          updatedRooms[roomIndex] = {
            ...updatedRooms[roomIndex],
            tasks: [...updatedRooms[roomIndex].tasks, {
              id: newTaskId,
              name: newTaskName,
              completed: false,
              postponed: false,
              dueDate: `${dayName}, ${timeStr}`
            }]
          };
          
          // Save to localStorage
          localStorage.setItem('roomChecklists', JSON.stringify(updatedRooms));
          
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname + '?room=' + newTaskRoom);
          
          return updatedRooms;
        }
        return prevRooms;
      });
    }
    
    // Listen for custom event when tasks are added from other pages
    const handleStorageChange = () => {
      loadRooms();
    };
    
    window.addEventListener('roomChecklistsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('roomChecklistsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save rooms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roomChecklists', JSON.stringify(rooms));
  }, [rooms]);

  const currentRoom = rooms.find(room => room.id.toString() === roomId) || rooms[0];
  const completedTasks = currentRoom.tasks.filter(task => task.completed).length;
  const totalTasks = currentRoom.tasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (taskId: number) => {
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id === currentRoom.id) {
          return {
            ...room,
            tasks: room.tasks.map(task => 
              task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
            )
          };
        }
        return room;
      });
    });
  };

  const openPostponeModal = (task: Task) => {
    setSelectedTask(task);
    setShowPostponeModal(true);
  };

  const handlePostpone = (type: 'tomorrow' | 'next-week' | 'custom') => {
    if (!selectedTask) return;

    let newDueDate = '';
    if (type === 'tomorrow') {
      // Parse the original task's time if it exists
      const originalTime = selectedTask.dueDate || 'Tomorrow, 09:00 AM';
      const timePart = originalTime.split(', ')[1] || '09:00 AM';
      const [hours, minutes] = timePart.split(':');
      const ampm = minutes.split(' ')[1] || 'AM';
      const mins = minutes.split(' ')[0];
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Set the time to match the original task's time
      let hour = parseInt(hours);
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      
      tomorrow.setHours(hour, parseInt(mins), 0, 0);
      const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      newDueDate = `${dayName}, ${timeStr}`;
    } else if (type === 'next-week') {
      // Parse the original task's time if it exists
      const originalTime = selectedTask.dueDate || 'Tomorrow, 09:00 AM';
      const timePart = originalTime.split(', ')[1] || '09:00 AM';
      const [hours, minutes] = timePart.split(':');
      const ampm = minutes.split(' ')[1] || 'AM';
      const mins = minutes.split(' ')[0];
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      // Set the time to match the original task's time
      let hour = parseInt(hours);
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      
      nextWeek.setHours(hour, parseInt(mins), 0, 0);
      const dayName = nextWeek.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = nextWeek.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      newDueDate = `${dayName}, ${timeStr}`;
    } else if (type === 'custom' && selectedDate) {
      const customDate = new Date(selectedDate);
      const dayName = customDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = customDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      newDueDate = `${dayName}, ${timeStr}`;
    }

    // Update the task's due date in state
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id === currentRoom.id) {
          return {
            ...room,
            tasks: room.tasks.map(task => 
              task.id === selectedTask.id 
                ? { ...task, dueDate: newDueDate, postponed: true }
                : task
            )
          };
        }
        return room;
      });
    });
    
    setShowPostponeModal(false);
    setShowDatePicker(false);
    setSelectedDate('');
    setSelectedTask(null);
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
              <Link to="/room-checklists" style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>Checklists</Link>
              <Link to="/analytics" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Analytics</Link>
              <Link to="/tips" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Tips</Link>
              <Link to="/settings" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem 0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/room-checklists?room=1" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === 1 ? '#dbeafe' : 'transparent', color: currentRoom.id === 1 ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== 1) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== 1) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ marginRight: '0.5rem' }}>🍳</span>
                Kitchen
              </Link>
              <Link to="/room-checklists?room=2" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === 2 ? '#dbeafe' : 'transparent', color: currentRoom.id === 2 ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== 2) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== 2) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ marginRight: '0.5rem' }}>🚿</span>
                Bathroom
              </Link>
              <Link to="/room-checklists?room=3" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === 3 ? '#dbeafe' : 'transparent', color: currentRoom.id === 3 ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== 3) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== 3) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ marginRight: '0.5rem' }}>🛏</span>
                Bedroom
              </Link>
              <Link to="/room-checklists?room=4" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === 4 ? '#dbeafe' : 'transparent', color: currentRoom.id === 4 ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== 4) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== 4) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ marginRight: '0.5rem' }}>🛋</span>
                Living Room
              </Link>
              <Link to="/room-checklists?room=5" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === 5 ? '#dbeafe' : 'transparent', color: currentRoom.id === 5 ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== 5) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== 5) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ marginRight: '0.5rem' }}>🧺</span>
                Laundry
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.875rem', marginRight: '0.75rem' }}>{currentRoom.icon}</span>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{currentRoom.name}</h1>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: completionPercentage === 100 ? '#dcfce7' : '#dbeafe', color: completionPercentage === 100 ? '#16a34a' : '#1d4ed8' }}>
                  {completionPercentage === 100 ? 'Complete' : 'In Progress'}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.75rem' }}>
                <div style={{ backgroundColor: '#2563eb', height: '0.75rem', borderRadius: '9999px', transition: 'all 0.3s ease', width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentRoom.tasks.map((task) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '0.5rem', border: task.completed ? '1px solid #bbf7d0' : task.postponed ? '1px solid #fef9c3' : '1px solid #e5e7eb', backgroundColor: task.completed ? '#f0fdf4' : task.postponed ? '#fefce8' : 'white' }}>
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb', borderRadius: '0.25rem', cursor: 'pointer', border: '1px solid #d1d5db' }} />
                  <div style={{ marginLeft: '1rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: task.completed ? '#166534' : '#111827', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.name}
                        </h3>
                        {task.dueDate && !task.completed && (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            Due: {task.dueDate}
                          </p>
                        )}
                      </div>
                      {!task.completed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button onClick={() => openPostponeModal(task)} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', border: '1px solid #d1d5db', fontSize: '0.75rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer', borderRadius: '0.375rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                            <ClockIcon style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                            Postpone
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showPostponeModal && selectedTask && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.5)', overflowY: 'auto', height: '100%', width: '100%', zIndex: 50 }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '28rem', width: '100%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Postpone Task</h3>
                <button onClick={() => setShowPostponeModal(false)} style={{ color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  <XMarkIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                </button>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#111827', fontWeight: '500', marginBottom: '0.5rem' }}>{selectedTask.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Select when you want to reschedule this task:</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => handlePostpone('tomorrow')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <CalendarDaysIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
                  Tomorrow at this time
                </button>
                <button onClick={() => handlePostpone('next-week')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <CalendarDaysIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
                  This time next week
                </button>
                <button onClick={() => setShowDatePicker(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <CalendarDaysIcon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
                  Choose custom date
                </button>
              </div>
              {showDatePicker && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Select Date and Time
                  </label>
                  <input type="datetime-local" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }} min={new Date().toISOString().slice(0, 16)} />
                </div>
              )}
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowPostponeModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Cancel
                </button>
                {showDatePicker && (
                  <button onClick={() => handlePostpone('custom')} disabled={!selectedDate} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer', opacity: !selectedDate ? 0.5 : 1 }} onMouseOver={(e) => { if (selectedDate) e.currentTarget.style.backgroundColor = '#1d4ed8' }} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
                    Confirm Postpone
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
