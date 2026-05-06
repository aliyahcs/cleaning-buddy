import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

export const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setEmailError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Email is invalid'); return; }

    setIsLoading(true);
    setEmailError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);
    if (error) {
      setEmailError(error.message);
    } else {
      setRequestSent(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setPasswordError('Password is required'); return; }
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters'); return; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordError('Password must contain uppercase, lowercase, and a number');
      return;
    }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }

    setIsLoading(true);
    setPasswordError('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsLoading(false);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordUpdated(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    appearance: 'none',
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    border: `2px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.5rem',
    color: '#111827',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: 'white',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  };

  const errorStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#dc2626',
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
            {isRecoveryMode ? 'Set new password' : 'Reset your password'}
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            {isRecoveryMode
              ? 'Enter a new password for your account.'
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {/* ── SET NEW PASSWORD (recovery mode) ── */}
        {isRecoveryMode && !passwordUpdated && (
          <form onSubmit={handleUpdatePassword} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                  style={{ ...inputStyle(!!passwordError), paddingRight: '2.5rem' }}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  {showNewPassword ? <EyeSlashIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} /> : <EyeIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Confirm new password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                  style={{ ...inputStyle(!!passwordError), paddingRight: '2.5rem' }}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  {showConfirmPassword ? <EyeSlashIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} /> : <EyeIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />}
                </button>
              </div>
              {passwordError && <p style={errorStyle}>{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.875rem 1rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', color: 'white', backgroundColor: isLoading ? '#9ca3af' : '#667eea', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#5568d3'; }}
              onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#667eea'; }}
            >
              {isLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        {/* ── PASSWORD UPDATED SUCCESS ── */}
        {isRecoveryMode && passwordUpdated && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 1.5rem', height: '4rem', width: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.75rem' }}>✓</span>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Password updated!</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Redirecting you to sign in...</p>
          </div>
        )}

        {/* ── REQUEST RESET (default) ── */}
        {!isRecoveryMode && !requestSent && (
          <form onSubmit={handleRequestReset} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <EnvelopeIcon style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: '#9ca3af', pointerEvents: 'none' }} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  style={{ ...inputStyle(!!emailError), paddingLeft: '2.5rem' }}
                  placeholder="Enter your email"
                />
              </div>
              {emailError && <p style={errorStyle}>{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.875rem 1rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', color: 'white', backgroundColor: isLoading ? '#9ca3af' : '#667eea', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#5568d3'; }}
              onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#667eea'; }}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: '#667eea', textDecoration: 'none' }}>
                <ArrowLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                Back to sign in
              </Link>
            </div>
          </form>
        )}

        {/* ── RESET EMAIL SENT ── */}
        {!isRecoveryMode && requestSent && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ margin: '0 auto', height: '4rem', width: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EnvelopeIcon style={{ height: '2rem', width: '2rem', color: '#16a34a' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Check your email</h3>
            <p style={{ color: '#6b7280' }}>
              We sent a password reset link to{' '}
              <span style={{ fontWeight: '600', color: '#111827' }}>{email}</span>
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Didn't get it? Check your spam folder or{' '}
              <button onClick={() => setRequestSent(false)} style={{ color: '#667eea', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                try again
              </button>
            </p>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: '#667eea', textDecoration: 'none' }}>
              <ArrowLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
              Back to sign in
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
