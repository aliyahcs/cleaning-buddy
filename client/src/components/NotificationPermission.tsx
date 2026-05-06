import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationPermissionProps {
  onRequestPermission: (granted: boolean) => void;
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onRequestPermission }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we've already asked for permission
    const hasAskedBefore = localStorage.getItem('notificationPermissionAsked');
    const permissionGranted = localStorage.getItem('notificationPermissionGranted') === 'true';
    
    if (!hasAskedBefore && !permissionGranted && 'Notification' in window) {
      setIsVisible(true);
    }
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        
        localStorage.setItem('notificationPermissionAsked', 'true');
        localStorage.setItem('notificationPermissionGranted', granted.toString());
        
        onRequestPermission(granted);
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      localStorage.setItem('notificationPermissionAsked', 'true');
      localStorage.setItem('notificationPermissionGranted', 'false');
      onRequestPermission(false);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem('notificationPermissionAsked', 'true');
    localStorage.setItem('notificationPermissionGranted', 'false');
    onRequestPermission(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '28rem',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            height: '3rem',
            width: '3rem',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <BellIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Enable Notifications
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', margin: 0 }}>
              Stay on top of your cleaning schedule with timely reminders
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={requestPermission}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              color: 'white',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
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
                Requesting...
              </div>
            ) : (
              'Enable Notifications'
            )}
          </button>

          <button
            onClick={dismiss}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              backgroundColor: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};
