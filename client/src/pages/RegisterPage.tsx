import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Mock registration - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/otp-verification?email=${encodeURIComponent(formData.email)}`);
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
            Create your account
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </div>

        <form style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  First name
                </label>
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ 
                      appearance: 'none', 
                      display: 'block', 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: errors.firstName ? '2px solid #ef4444' : '2px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Last name
                </label>
                <div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ 
                      appearance: 'none', 
                      display: 'block', 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: errors.lastName ? '2px solid #ef4444' : '2px solid #d1d5db', 
                      borderRadius: '0.5rem', 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <div>
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
                  autoComplete="new-password"
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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ 
                    appearance: 'none', 
                    display: 'block', 
                    width: '100%', 
                    padding: '0.75rem 2.5rem 0.75rem 1rem', 
                    border: errors.confirmPassword ? '2px solid #ef4444' : '2px solid #d1d5db', 
                    borderRadius: '0.5rem', 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  ) : (
                    <EyeIcon style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
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
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
