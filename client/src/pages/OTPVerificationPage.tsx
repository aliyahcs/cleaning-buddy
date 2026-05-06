import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

export const OTPVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').slice(0, 6);
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.some(digit => digit === '')) {
      alert('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setVerifyError('');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.join(''),
      type: 'signup',
    });

    setIsLoading(false);

    if (error) {
      setVerifyError(error.message);
      return;
    }

    navigate('/setup');
  };

  const handleResend = async () => {
    setIsResending(true);
    setVerifyError('');

    const { error } = await supabase.auth.resend({
      email,
      type: 'signup',
    });

    setIsResending(false);

    if (error) {
      setVerifyError(error.message);
      return;
    }

    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
  };

  const isExpired = timeLeft === 0;

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
            Verify your email
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>
              Enter verification code
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={{ 
                    width: '3rem', 
                    height: '3.5rem', 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    border: '2px solid #d1d5db', 
                    borderRadius: '0.5rem', 
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              ))}
            </div>
            {isExpired && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>
                Code expired. Please request a new one.
              </p>
            )}
            {verifyError && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }}>
                {verifyError}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {isExpired ? 'Code expired' : `Code expires in ${formatTime(timeLeft)}`}
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || !isExpired}
              style={{ 
                marginTop: '0.5rem', 
                background: 'none', 
                border: 'none', 
                color: isExpired ? '#667eea' : '#9ca3af', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                cursor: (isExpired && !isResending) ? 'pointer' : 'not-allowed',
                textDecoration: 'underline'
              }}
              onMouseOver={(e) => isExpired && !isResending && (e.currentTarget.style.color = '#5568d3')}
              onMouseOut={(e) => isExpired && !isResending && (e.currentTarget.style.color = '#667eea')}
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <button
              type="submit"
              disabled={isLoading || isExpired || otp.some(digit => digit === '')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '0.875rem 1rem', 
                border: 'none', 
                borderRadius: '0.5rem', 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: 'white', 
                backgroundColor: (isLoading || isExpired) ? '#9ca3af' : '#667eea', 
                cursor: (isLoading || isExpired) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => !isLoading && !isExpired && (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseOut={(e) => !isLoading && !isExpired && (e.currentTarget.style.backgroundColor = '#667eea')}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    animation: 'spin 1s linear infinite', 
                    borderRadius: '50%', 
                    height: '1rem', 
                    width: '1rem', 
                    border: '2px solid white', 
                    borderTopColor: 'transparent',
                    marginRight: '0.5rem'
                  }}></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>

            <Link 
              to="/login" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '0.875rem 1rem', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
