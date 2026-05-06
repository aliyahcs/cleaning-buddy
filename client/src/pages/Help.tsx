import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export const Help: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Create Account" button on the landing page. Fill in your email, create a password, and follow the setup process to get your personalized cleaning schedule.',
          video: false
        },
        {
          question: 'What is the Cleanliness Quiz?',
          answer: 'The Cleanliness Quiz is an 8-question assessment that determines your cleaning personality type. Based on your answers, you\'ll get a "Neat Freak Score" from 0-100 and be categorized as Minimalist Maintainer, Casual Cleaner, Routine Ready, Neat Freak, or Spotless Specialist.',
          video: false
        },
        {
          question: 'How do I set up my cleaning schedule?',
          answer: 'After completing the quiz, select your dwelling type (Apartment, House, Studio), choose your top 2 priority rooms, pick your preferred cleaning day and time, and configure notifications. This creates your personalized weekly cleaning schedule.',
          video: false
        }
      ]
    },
    {
      id: 'tasks',
      name: 'Tasks & Checklists',
      icon: '✅',
      items: [
        {
          question: 'How do I add a new task?',
          answer: 'Go to "My Tasks" page and click the "Quick Add Task" button, or navigate to "Room Checklists" to add tasks to specific rooms. You can set due dates, priorities, and add detailed descriptions.',
          video: false
        },
        {
          question: 'What does the postpone feature do?',
          answer: 'The postpone feature allows you to reschedule tasks. When viewing a task, click the postpone button and choose between "Tomorrow at this time", "This time next week", or select a custom date from the calendar.',
          video: false
        },
        {
          question: 'How do I mark tasks as complete?',
          answer: 'In Room Checklists, check the box next to each task. The task will be marked as complete and your progress will be updated. You can also add notes about how the task went.',
          video: false
        },
        {
          question: 'Can I edit tasks after creating them?',
          answer: 'Yes, you can edit tasks by clicking on them in the Room Checklists. You can modify the task name, description, due date, priority, and other details.',
          video: false
        }
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: '🔔',
      items: [
        {
          question: 'How do I enable push notifications?',
          answer: 'Go to Settings > Notifications and toggle "Push Notifications" on. You can also configure in-app notifications, choose notification sounds, and set reminder times.',
          video: false
        },
        {
          question: 'What notification options are available?',
          answer: 'You can choose between push notifications (for mobile devices) and in-app notifications. Available sounds include Default Chime, Gentle Bell, and Soft Alert. You can also set custom reminder times.',
          video: false
        },
        {
          question: 'Why am I not receiving notifications?',
          answer: 'Check your device notification settings and ensure the app has permission to send notifications. Also verify your notification preferences are correctly configured in the app settings.',
          video: false
        }
      ]
    },
    {
      id: 'account',
      name: 'Account & Privacy',
      icon: '👤',
      items: [
        {
          question: 'How do I change my password?',
          answer: 'Go to Settings > Privacy and click "Reset Password". Enter your email address and follow the instructions sent to your email to create a new password.',
          video: false
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Navigate to Settings > Profile to update your name, email, dwelling type, cleaning preferences, and other personal information.',
          video: false
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Privacy and click "Delete Account". Follow the confirmation steps to permanently delete your account and all associated data.',
          video: false
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, all data is encrypted and stored securely. We use industry-standard security practices and never share your personal information with third parties without your consent.',
          video: false
        }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔧',
      items: [
        {
          question: 'The app is not loading properly',
          answer: 'Try clearing your browser cache and restarting the app. Ensure you have a stable internet connection. If the problem persists, try using a different browser or updating to the latest version.',
          video: false
        },
        {
          question: 'Tasks are not syncing',
          answer: 'Check your internet connection and try refreshing the app. Pull down to refresh the page. If issues persist, log out and log back in to reset your session.',
          video: false
        },
        {
          question: 'I forgot my cleaning day',
          answer: 'Go to Settings > Profile to update your preferred cleaning day. Your schedule will automatically adjust for future weeks based on your selection.',
          video: false
        },
        {
          question: 'The app is running slowly',
          answer: 'Try closing other apps and browser tabs to free up memory. Clear your browser cache and ensure you\'re using the latest version of your browser.',
          video: false
        }
      ]
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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
              <Link to="/analytics" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Analytics</Link>
              <Link to="/tips" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Tips</Link>
              <Link to="/settings" style={{ color: '#6b7280', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#111827'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>Settings</Link>
              <Link to="/help" style={{ color: '#111827', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>Help</Link>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Help & Support</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Find answers to common questions and get the most out of Cleaning Buddy</p>
        </div>

        <div style={{ marginBottom: '1.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <QuestionMarkCircleIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for help..."
              style={{ display: 'block', width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: '#6b7280', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredCategories.map((category) => (
            <div key={category.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleCategory(category.id)}
                style={{ width: '100%', padding: '1rem 1.5rem', textAlign: 'left', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{category.icon}</span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{category.name}</h3>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronDownIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  ) : (
                    <ChevronRightIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  )}
                </div>
              </button>

              {expandedCategory === category.id && (
                <div style={{ borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {category.items.map((item, index) => (
                      <div key={index} style={{ borderBottom: index < category.items.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: index < category.items.length - 1 ? '1rem' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div style={{ flexShrink: 0, backgroundColor: '#dbeafe', borderRadius: '0.375rem', padding: '0.5rem' }}>
                            <QuestionMarkCircleIcon style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb' }} />
                          </div>
                          <div style={{ marginLeft: '0.75rem', flex: 1 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>{item.question}</h4>
                            <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.625' }}>{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
