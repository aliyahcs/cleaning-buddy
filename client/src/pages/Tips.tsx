import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

const TIPS = [
  { id: 1, category: 'kitchen', icon: '🍳', title: 'Clean As You Cook', content: 'Wipe spills immediately to prevent them from hardening. Keep a damp cloth nearby while cooking and your post-meal cleanup takes half the time.' },
  { id: 2, category: 'kitchen', icon: '🍋', title: 'Steam-Clean Your Microwave', content: 'Heat a bowl of water with a few lemon slices for 5 minutes. The steam loosens grime so you can wipe it away effortlessly — no scrubbing, no harsh chemicals.' },
  { id: 3, category: 'kitchen', icon: '🔥', title: 'Degrease Stovetop Monthly', content: 'Remove burner grates and soak them in hot soapy water for 30 minutes. This makes degreasing effortless and avoids the need for harsh oven cleaners.' },
  { id: 4, category: 'kitchen', icon: '❄️', title: 'Wipe the Fridge Weekly', content: 'A quick wipe of fridge shelves and the door seal every week prevents odors and mold from taking hold. A damp cloth with baking soda neutralizes smells fast.' },
  { id: 5, category: 'kitchen', icon: '🫧', title: 'Deep-Clean Your Dishwasher', content: 'Once a month, run an empty cycle with a cup of white vinegar in the bottom rack. It removes grease buildup and eliminates musty odors from the machine.' },
  { id: 6, category: 'bathroom', icon: '🚿', title: 'Use a Daily Shower Spray', content: 'After each shower, spray walls with a mix of water, white vinegar, and a drop of dish soap. It prevents soap scum from forming between deep cleans.' },
  { id: 7, category: 'bathroom', icon: '🪥', title: 'Scrub Grout With a Toothbrush', content: 'An old toothbrush dipped in baking soda paste is the most effective grout cleaner you can use. Work it into the lines before your monthly deep clean.' },
  { id: 8, category: 'bathroom', icon: '💧', title: 'Squeegee Your Shower Glass', content: 'Taking 20 seconds to squeegee the glass after each use nearly eliminates water spots and mineral deposits, cutting your deep-clean frequency in half.' },
  { id: 9, category: 'bathroom', icon: '🪣', title: 'Sanitize Your Toilet Brush', content: 'Once a month, soak your toilet brush and holder in diluted bleach solution for 30 minutes, then rinse. It prevents bacteria from spreading each time you clean.' },
  { id: 10, category: 'bedroom', icon: '🛏', title: 'Wash Pillowcases Every Week', content: 'Pillowcases collect more oils and bacteria than any other bedding. Weekly washing noticeably reduces morning allergies and skin breakouts.' },
  { id: 11, category: 'bedroom', icon: '🔄', title: 'Rotate Your Mattress Seasonally', content: 'Rotating your mattress 180 degrees every 3 months evens out wear and prevents body impressions from forming, significantly extending its lifespan.' },
  { id: 12, category: 'bedroom', icon: '🪟', title: 'Always Dust Top-Down', content: 'Dust ceiling fan blades, blinds, and shelves before you vacuum the floor. Dust falls — if you vacuum first, you\'ll just have to do it again.' },
  { id: 13, category: 'living-room', icon: '🛋', title: 'Vacuum Upholstery Weekly', content: 'Use your vacuum\'s upholstery attachment on sofas and chairs weekly. It removes dust and pet hair before they work their way deep into the fabric.' },
  { id: 14, category: 'living-room', icon: '📺', title: 'Microfiber Cloth for Electronics', content: 'Only use a dry microfiber cloth on screens and electronics. It attracts dust electrostatically without scratching surfaces or leaving streaks.' },
  { id: 15, category: 'living-room', icon: '🧹', title: 'Treat Carpet Stains Immediately', content: 'Blot fresh stains with cold water — never rub, as that spreads the stain. Acting within the first few minutes prevents permanent setting.' },
  { id: 16, category: 'laundry', icon: '🧺', title: 'Clean the Washing Machine Monthly', content: 'Run an empty hot cycle with two cups of white vinegar to dissolve detergent buildup and kill mildew. Your clothes will smell noticeably fresher.' },
  { id: 17, category: 'laundry', icon: '👕', title: 'Sort by Fabric, Not Just Color', content: 'Washing heavy items like jeans with lightweight fabrics causes friction that pills and damages delicate pieces. Separate by weight to extend garment life.' },
  { id: 18, category: 'laundry', icon: '🚪', title: 'Leave the Washer Door Open', content: 'After every load, leave the washer door ajar for at least 30 minutes so the drum and seal can dry out. This is the main way to prevent musty smells.' },
  { id: 19, category: 'general', icon: '➡️', title: 'Clean Top-Down, Left to Right', content: 'Work from ceiling to floor, left to right in every room. Falling dust always gets cleaned up on the next pass — you never re-clean an area you\'ve already done.' },
  { id: 20, category: 'general', icon: '🧴', title: 'Use a Cleaning Caddy', content: 'Keeping all your supplies in one portable caddy means one trip to set up, no walking back and forth between rooms. It cuts dead time out of your cleaning session.' },
  { id: 21, category: 'general', icon: '⏱️', title: 'The 2-Minute Rule', content: 'If a cleaning task takes less than 2 minutes — wiping a surface, spraying a mirror — do it immediately. These quick wins prevent buildup from ever getting serious.' },
];

const CATEGORY_LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  bedroom: 'Bedroom',
  'living-room': 'Living Room',
  laundry: 'Laundry',
  general: 'General',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  kitchen: { bg: '#fef9c3', text: '#854d0e' },
  bathroom: { bg: '#dbeafe', text: '#1e40af' },
  bedroom: { bg: '#f3e8ff', text: '#6b21a8' },
  'living-room': { bg: '#dcfce7', text: '#166534' },
  laundry: { bg: '#ffedd5', text: '#9a3412' },
  general: { bg: '#f1f5f9', text: '#475569' },
};

export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/login'); };
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState(1);

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
              <Link to="/help" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Help</Link>
              <button onClick={handleSignOut} style={{ color: '#dc2626', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'} onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}>Sign Out</button>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Cleaning Tips</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expert advice to make your cleaning more efficient and effective</p>
        </div>

        <div className="cb-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {TIPS.map((tip) => {
            const colors = CATEGORY_COLORS[tip.category] || CATEGORY_COLORS.general;
            return (
              <div key={tip.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem', flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.375rem' }}>{tip.title}</h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: colors.bg, color: colors.text }}>
                        {CATEGORY_LABELS[tip.category]}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.625' }}>{tip.content}</p>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setSelectedTip(tip); setShowAddTaskModal(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                      Apply to Tasks
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
