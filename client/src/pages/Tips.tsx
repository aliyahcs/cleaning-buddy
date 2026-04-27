import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookmarkIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState(1);

  const cleaningTips = [
    {
      id: 1,
      category: 'general',
      title: 'Dust before sweeping',
      content: 'Always dust surfaces before sweeping or vacuuming to avoid spreading dust around your home. Start from high surfaces and work your way down to capture falling dust particles.',
      icon: '🧹'
    },
    {
      id: 2,
      category: 'general',
      title: 'Always clean top to bottom',
      content: 'Start cleaning from high surfaces and work your way down to avoid re-cleaning areas. Gravity will help pull dust and debris downward, making your cleaning more efficient.',
      icon: '⬇️'
    },
    {
      id: 3,
      category: 'general',
      title: 'Always dry clean before wet clean',
      content: 'Use dry cleaning methods (dusting, sweeping) before wet methods (mopping, wiping). This prevents mud streaks and makes wet cleaning more effective.',
      icon: '🧹'
    },
    {
      id: 4,
      category: 'general',
      title: 'Empty your vacuum',
      content: 'Empty vacuum bag or canister regularly for better suction and performance. A full vacuum reduces efficiency and can spread odors.',
      icon: '🌪'
    },
    {
      id: 5,
      category: 'general',
      title: 'Have towels on hand',
      content: 'Keep cleaning towels readily available to wipe up spills immediately. Quick action prevents stains from setting and makes cleanup faster.',
      icon: '🧻'
    },
    {
      id: 6,
      category: 'general',
      title: 'Replenish your cleaning supplies',
      content: 'Restock cleaning supplies before you run out to avoid interruptions. Keep a checklist of frequently used items and check it regularly.',
      icon: '📦'
    },
    {
      id: 7,
      category: 'kitchen',
      title: 'Clean microwave with lemon',
      content: 'Place a microwave-safe bowl with water and lemon slices inside. Microwave for 2-3 minutes, then let sit for 5 minutes. The steam helps loosen grime for easy cleaning.',
      icon: '🍋'
    },
    {
      id: 8,
      category: 'kitchen',
      title: 'Use baking soda for tough stains',
      content: 'Make a paste with baking soda and water for tough kitchen stains. Let it sit for 15 minutes before scrubbing. Natural and effective.',
      icon: '🧪'
    },
    {
      id: 9,
      category: 'bathroom',
      title: 'Clean shower head with vinegar',
      content: 'Remove shower head and soak in white vinegar for 1 hour to dissolve mineral deposits. Rinse thoroughly before reattaching.',
      icon: '🚿'
    },
    {
      id: 10,
      category: 'bathroom',
      title: 'Prevent soap scum',
      content: 'Apply a thin layer of baby oil or car wax on shower doors and glass after cleaning. This prevents soap scum buildup and makes future cleaning easier.',
      icon: '🚿'
    },
    {
      id: 11,
      category: 'bathroom',
      title: 'Clean grout with toothbrush',
      content: 'Use an old toothbrush and baking soda paste to clean grout lines. The small bristles reach tight spaces that sponges can\'t access.',
      icon: '🦷'
    },
    {
      id: 12,
      category: 'bedroom',
      title: 'Flip mattresses regularly',
      content: 'Rotate and flip your mattress every 3-6 months to ensure even wear and prevent sagging. Mark the date on your calendar.',
      icon: '🛏'
    },
    {
      id: 13,
      category: 'bedroom',
      title: 'Use lint roller on clothes',
      content: 'Use a lint roller on clothes before washing to remove lint and pet hair. This prevents lint buildup in the washer and on clean clothes.',
      icon: '👔'
    },
    {
      id: 14,
      category: 'bedroom',
      title: 'Organize closet by season',
      content: 'Organize your closet by season and store off-season clothes in vacuum bags. This makes finding items easier and frees up space.',
      icon: '👗'
    },
    {
      id: 15,
      category: 'living-room',
      title: 'Clean electronics with microfiber',
      content: 'Use microfiber cloths to clean electronics and screens. They trap dust effectively without leaving lint or scratches.',
      icon: '📺'
    },
    {
      id: 16,
      category: 'living-room',
      title: 'Vacuum in different directions',
      content: 'Vacuum carpet in different directions each time (north-south, then east-west). This lifts carpet fibers and removes more embedded dirt.',
      icon: '🌪'
    },
    {
      id: 17,
      category: 'living-room',
      title: 'Use white vinegar on windows',
      content: 'Mix equal parts white vinegar and water in a spray bottle. Perfect for streak-free window cleaning and much cheaper than commercial cleaners.',
      icon: '🪟'
    },
    {
      id: 18,
      category: 'laundry',
      title: 'Sort laundry properly',
      content: 'Sort laundry by color, fabric type, and washing temperature. This prevents color bleeding and fabric damage. Use mesh bags for delicates.',
      icon: '🧺'
    },
    {
      id: 19,
      category: 'laundry',
      title: 'Don\'t overload washer',
      content: 'Fill washer only 3/4 full to allow proper agitation and cleaning. Overloading prevents clothes from getting clean and can damage the machine.',
      icon: '🌊'
    },
    {
      id: 20,
      category: 'laundry',
      title: 'Clean dryer lint filter',
      content: 'Clean dryer lint filter after every use. A clogged filter reduces efficiency, increases drying time, and can be a fire hazard.',
      icon: '🔥'
    }
  ];

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
