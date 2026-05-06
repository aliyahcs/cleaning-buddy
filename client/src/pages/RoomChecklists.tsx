import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  postponed: boolean;
  isOverdue: boolean;
  dueDate?: string;
  isCustom?: boolean;
}

interface Room {
  id: number;
  name: string;
  icon: string;
  tasks: Task[];
}

const DWELLING_ROOMS: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [1, 2, 3, 4, 5],
  3: [1, 2, 3, 4, 5],
};

const DEFAULT_ROOMS: Room[] = [
  { id: 1, name: 'Kitchen', icon: '🍳', tasks: [] },
  { id: 2, name: 'Bathroom', icon: '🚿', tasks: [] },
  { id: 3, name: 'Bedroom', icon: '🛏', tasks: [] },
  { id: 4, name: 'Living Room', icon: '🛋', tasks: [] },
  { id: 5, name: 'Laundry', icon: '🧺', tasks: [] },
];

export const RoomChecklists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');

  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowedRoomIds, setAllowedRoomIds] = useState<number[]>([1, 2, 3, 4, 5]);
  const [userId, setUserId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);

        const newTaskName = searchParams.get('newTask');
        const targetRoomId = searchParams.get('room');

        const [{ data: templates, error: templatesError }, { data: profileData }, { data: completionsData }, { data: customTasksData }] = await Promise.all([
          supabase.from('task_templates').select('*').eq('is_active', true).order('display_order'),
          user ? supabase.from('user_profiles').select('dwelling_type_id').eq('user_id', user.id).single() : Promise.resolve({ data: null }),
          user ? supabase.from('user_task_completions').select('task_template_id, postponed, due_date').eq('user_id', user.id) : Promise.resolve({ data: [] }),
          user ? supabase.from('user_custom_tasks').select('*').eq('user_id', user.id) : Promise.resolve({ data: [] }),
        ]);
        if (templatesError) throw templatesError;

        const dwellingId: number = (profileData as any)?.dwelling_type_id ?? 2;
        setAllowedRoomIds(DWELLING_ROOMS[dwellingId] ?? [1, 2, 3, 4, 5]);

        const completedIds = new Set(
          (completionsData || []).filter((c: any) => !c.postponed).map((c: any) => c.task_template_id)
        );
        const postponedMap = new Map(
          (completionsData || []).filter((c: any) => c.postponed).map((c: any) => [c.task_template_id, c.due_date as string | undefined])
        );

        let allCustomTasks = [...(customTasksData || [])];

        if (newTaskName && targetRoomId && user) {
          const { data: inserted } = await supabase
            .from('user_custom_tasks')
            .insert({ user_id: user.id, room_id: parseInt(targetRoomId), task_name: decodeURIComponent(newTaskName), completed: false, postponed: false })
            .select('*')
            .single();
          if (inserted) allCustomTasks.push(inserted);
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('newTask');
          window.history.replaceState({}, '', newUrl.toString());
        }

        setRooms(DEFAULT_ROOMS.map(room => {
          const templateTasks: Task[] = templates!
            .filter((t: any) => t.room_id === room.id)
            .map((t: any) => ({
              id: t.task_template_id,
              name: t.task_name,
              completed: completedIds.has(t.task_template_id),
              postponed: postponedMap.has(t.task_template_id),
              isOverdue: false,
              dueDate: postponedMap.get(t.task_template_id),
              isCustom: false,
            }));
          const dbCustomTasks: Task[] = allCustomTasks
            .filter((ct: any) => ct.room_id === room.id)
            .map((ct: any) => ({
              id: ct.custom_task_id,
              name: ct.task_name,
              completed: !!ct.completed && !ct.postponed,
              postponed: !!ct.postponed,
              isOverdue: false,
              dueDate: ct.due_date ?? undefined,
              isCustom: true,
            }));
          return { ...room, tasks: [...templateTasks, ...dbCustomTasks] };
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('roomChecklists', JSON.stringify(rooms));
    }
  }, [rooms, loading]);

  const displayRooms = rooms.filter(r => allowedRoomIds.includes(r.id));
  const currentRoom = (roomId ? displayRooms.find(room => room.id.toString() === roomId) : null) || displayRooms[0] || rooms[0];
  const completedTasks = currentRoom.tasks.filter(task => task.completed).length;
  const totalTasks = currentRoom.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.min(Math.round((completedTasks / totalTasks) * 100), 100) : 0;

  const toggleTask = (taskId: number) => {
    const task = currentRoom.tasks.find(t => t.id === taskId);
    if (!task || !userId) return;

    const willBeCompleted = !task.completed;

    if (task.isCustom) {
      supabase.from('user_custom_tasks')
        .update({ completed: willBeCompleted, postponed: false, due_date: null })
        .eq('custom_task_id', taskId)
        .eq('user_id', userId)
        .then(() => {});
    } else {
      if (willBeCompleted) {
        supabase.from('user_task_completions')
          .upsert({ user_id: userId, task_template_id: taskId, postponed: false, due_date: null })
          .then(() => {});
      } else {
        supabase.from('user_task_completions')
          .delete()
          .eq('user_id', userId)
          .eq('task_template_id', taskId)
          .then(() => {});
      }
    }

    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === currentRoom.id) {
        return {
          ...room,
          tasks: room.tasks.map(t =>
            t.id === taskId ? { ...t, completed: willBeCompleted, postponed: false, dueDate: undefined } : t
          ),
        };
      }
      return room;
    }));
  };

  const openPostponeModal = (task: Task) => {
    setSelectedTask(task);
    setShowPostponeModal(true);
  };

  const handlePostpone = (type: 'tomorrow' | 'next-week' | 'custom') => {
    if (!selectedTask) return;

    let newDueDate = '';
    if (type === 'tomorrow') {
      const originalTime = selectedTask.dueDate || 'Tomorrow, 09:00 AM';
      const timePart = originalTime.split(', ')[1] || '09:00 AM';
      const [hours, minutes] = timePart.split(':');
      const ampm = minutes.split(' ')[1] || 'AM';
      const mins = minutes.split(' ')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      let hour = parseInt(hours);
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      tomorrow.setHours(hour, parseInt(mins), 0, 0);
      const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      newDueDate = `${dayName}, ${timeStr}`;
    } else if (type === 'next-week') {
      const originalTime = selectedTask.dueDate || 'Tomorrow, 09:00 AM';
      const timePart = originalTime.split(', ')[1] || '09:00 AM';
      const [hours, minutes] = timePart.split(':');
      const ampm = minutes.split(' ')[1] || 'AM';
      const mins = minutes.split(' ')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
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

    if (userId) {
      if (selectedTask.isCustom) {
        supabase.from('user_custom_tasks')
          .update({ postponed: true, due_date: newDueDate, completed: false })
          .eq('custom_task_id', selectedTask.id)
          .eq('user_id', userId)
          .then(() => {});
      } else {
        supabase.from('user_task_completions')
          .upsert({ user_id: userId, task_template_id: selectedTask.id, postponed: true, due_date: newDueDate })
          .then(() => {});
      }
    }

    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === currentRoom.id) {
        return {
          ...room,
          tasks: room.tasks.map(task =>
            task.id === selectedTask.id
              ? { ...task, dueDate: newDueDate, postponed: true, completed: false }
              : task
          ),
        };
      }
      return room;
    }));

    setShowPostponeModal(false);
    setShowDatePicker(false);
    setSelectedDate('');
    setSelectedTask(null);
  };

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
              {displayRooms.map(room => (
                <Link key={room.id} to={`/room-checklists?room=${room.id}`} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', backgroundColor: currentRoom.id === room.id ? '#dbeafe' : 'transparent', color: currentRoom.id === room.id ? '#1d4ed8' : '#6b7280' }} onMouseOver={(e) => { if (currentRoom.id !== room.id) e.currentTarget.style.backgroundColor = '#f3f4f6' }} onMouseOut={(e) => { if (currentRoom.id !== room.id) e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <span style={{ marginRight: '0.5rem' }}>{room.icon}</span>
                  {room.name}
                </Link>
              ))}
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
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '0.5rem', border: task.completed ? '1px solid #bbf7d0' : task.isOverdue ? '1px solid #fecaca' : task.postponed ? '1px solid #fef9c3' : '1px solid #e5e7eb', backgroundColor: task.completed ? '#f0fdf4' : task.isOverdue ? '#fef2f2' : task.postponed ? '#fefce8' : 'white' }}>
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb', borderRadius: '0.25rem', cursor: 'pointer', border: '1px solid #d1d5db' }} />
                  <div style={{ marginLeft: '1rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: task.completed ? '#166534' : '#111827', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.name}
                        </h3>
                        {task.dueDate && !task.completed && (
                          <p style={{ fontSize: '0.875rem', color: task.isOverdue ? '#dc2626' : '#6b7280', marginTop: '0.25rem', fontWeight: task.isOverdue ? '600' : 'normal' }}>
                            {task.isOverdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
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
