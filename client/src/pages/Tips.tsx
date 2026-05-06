import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookmarkIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cleaningTips, setCleaningTips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const { data: tips, error: tipsError } = await supabase
          .from('cleaning_tips')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        if (tipsError) throw tipsError;

        setCleaningTips(tips.map((tip: any) => ({
          id: tip.tip_id,
          category: 'general',
          title: tip.title,
          content: tip.tip_text,
          icon: '💡'
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const categories = [
    { id: 'all', name: 'All Tips', icon: '📚' },
    { id: 'general', name: 'General', icon: '🧹' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏' },
    { id: 'living-room', name: 'Living Room', icon: '🛋' },
    { id: 'laundry', name: 'Laundry', icon: '🧺' }
  ];

  const filteredTips = cleaningTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <Link to="/room-checklists" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Checklists</Link>
              <Link to="/analytics" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Analytics</Link>
              <Link to="/tips" style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>Tips</Link>
              <Link to="/settings" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Settings</Link>
            </nav>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Cleaning Tips</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expert advice to make your cleaning more efficient and effective</p>
        </div>
        <div style={{ marginBottom: '1.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <MagnifyingGlassIcon style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
                </div>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tips..." style={{ display: 'block', width: '100%', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: '#6b7280', fontSize: '0.875rem', outline: 'none' }} />
              </div>
            </div>
            <div style={{ width: '16rem' }}>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {filteredTips.map((tip) => (
            <div key={tip.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{tip.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{tip.title}</h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af' }}>{tip.category.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <button style={{ color: '#9ca3af', backgroundColor: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                    <BookmarkIcon style={{ height: '1rem', width: '1rem' }} />
                  </button>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.625' }}>{tip.content}</p>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => { setSelectedTip(tip); setShowAddTaskModal(true); }} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
                      Apply to Tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              <MagnifyingGlassIcon style={{ height: '2rem', width: '2rem', margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>No tips found</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Try adjusting your search terms or category filter to find relevant cleaning tips.</p>
          </div>
        )}
      </main>

      {showAddTaskModal && selectedTip && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(75, 85, 99, 0.5)', overflowY: 'auto', height: '100%', width: '100%', zIndex: 50 }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '28rem', width: '100%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Add Task from Tip</h3>
                <button onClick={() => setShowAddTaskModal(false)} style={{ color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  <XMarkIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Task Name</label>
                  <input
                    type="text"
                    value={selectedTip.title}
                    readOnly
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: '#f9fafb', color: '#6b7280' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Room</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value={1}>Kitchen</option>
                    <option value={2}>Bathroom</option>
                    <option value={3}>Bedroom</option>
                    <option value={4}>Living Room</option>
                    <option value={5}>Laundry</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowAddTaskModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Navigate to room-checklists with task in URL params
                    navigate(`/room-checklists?room=${selectedRoom}&newTask=${encodeURIComponent(selectedTip.title)}`);
                    setShowAddTaskModal(false);
                  }}
                  style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer' }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
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
