import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, HomeIcon } from '@heroicons/react/24/outline';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '32rem', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Logo/Icon */}
          <div style={{ margin: '0 auto', height: '5rem', width: '5rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
            <SparklesIcon style={{ height: '2.5rem', width: '2.5rem', color: 'white' }} />
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
            Cleaning Buddy
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', marginBottom: '2rem', fontWeight: '400' }}>
            Your personal assistant for maintaining a clean and organized home
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/login"
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '1rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem', 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: 'white', 
                backgroundColor: '#667eea', 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#5568d3';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Sign In
            </Link>
            
            <Link
              to="/register"
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '1rem 1.5rem', 
                border: '2px solid #667eea', 
                borderRadius: '0.5rem', 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#667eea', 
                backgroundColor: 'transparent', 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Create Account
            </Link>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '2px solid #e5e7eb' }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span style={{ padding: '0 1rem', backgroundColor: 'white', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Or continue with</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <button style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                backgroundColor: 'white', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.backgroundColor = '#f8f7ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }}
              >
                Google
              </button>

              <button style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                backgroundColor: 'white', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.backgroundColor = '#f8f7ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }}
              >
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>
            Why Cleaning Buddy?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '1rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <HomeIcon style={{ height: '1.5rem', width: '1.5rem', color: '#4ade80', marginRight: '0.75rem' }} />
              <span style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>Personalized cleaning schedules</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '1rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <SparklesIcon style={{ height: '1.5rem', width: '1.5rem', color: '#60a5fa', marginRight: '0.75rem' }} />
              <span style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>Track your cleaning progress</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '1rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <HomeIcon style={{ height: '1.5rem', width: '1.5rem', color: '#c084fc', marginRight: '0.75rem' }} />
              <span style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>Room-specific checklists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
