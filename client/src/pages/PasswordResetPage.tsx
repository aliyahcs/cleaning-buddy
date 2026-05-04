import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    
    // Mock password reset - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <div style={{ height: '4rem', width: '4rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>CB</span>
            </div>
          </Link>
          <h2 style={{ marginTop: '1.5rem', fontSize: '2rem', fontWeight: '800', color: 'white' }}>
            Reset your password
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <EnvelopeIcon style={{ height: '1.25rem', width: '1.25rem', color: 'rgba(255, 255, 255, 0.5)' }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleChange}
                  style={{
                    appearance: 'none',
                    display: 'block',
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: `1px solid ${error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="Enter your email"
                />
                {error && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: isLoading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                    Sending reset link...
                  </div>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link
                to="/login"
                style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
              >
                <ArrowLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                Back to sign in
              </Link>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ margin: '0 auto', height: '4rem', width: '4rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EnvelopeIcon style={{ height: '2rem', width: '2rem', color: '#22c55e' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
              Check your email
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              We've sent a password reset link to{' '}
              <span style={{ fontWeight: '500', color: 'white' }}>{email}</span>
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                try again
              </button>
            </p>
            <div style={{ paddingTop: '1rem' }}>
              <Link
                to="/login"
                style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
              >
                <ArrowLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
