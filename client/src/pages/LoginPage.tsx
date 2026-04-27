import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Mock login - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
            Sign in to your account
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            Or{' '}
            <Link to="/register" style={{ color: 'white', fontWeight: '600', textDecoration: 'underline' }}>
              create a new account
            </Link>
          </p>
        </div>

        <form style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{ 
                    appearance: 'none', 
                    display: 'block', 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: errors.email ? '2px solid #ef4444' : '2px solid #d1d5db', 
                    borderRadius: '0.5rem', 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{ 
                    appearance: 'none', 
                    display: 'block', 
                    width: '100%', 
                    padding: '0.75rem 2.5rem 0.75rem 1rem', 
                    border: errors.password ? '2px solid #ef4444' : '2px solid #d1d5db', 
                    borderRadius: '0.5rem', 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  ) : (
                    <EyeIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  )}
                </button>
                {errors.password && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={{ height: '1rem', width: '1rem', color: '#2563eb', border: '#d1d5db', borderRadius: '0.25rem' }}
              />
              <label htmlFor="remember-me" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#111827' }}>
                Remember me
              </label>
            </div>

            <div>
              <Link to="/reset-password" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              disabled={isLoading}
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
                backgroundColor: '#667eea', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#5568d3')}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#667eea')}
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
