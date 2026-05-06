interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleNotification(time: string, message: string): void;
  showNotification(title: string, body: string): void;
  isSupported(): boolean;
}

class BrowserNotificationService implements NotificationService {
  private audioContext: AudioContext | null = null;
  private notificationSound: string = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVohDbq2/EA';

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  scheduleNotification(time: string, message: string): void {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        this.showNotification('Cleaning Reminder', message);
      }, timeUntilNotification);
    }
  }

  showNotification(title: string, body: string): void {
    if (!this.isSupported()) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'cleaning-reminder',
        requireInteraction: false,
        silent: false
      });

      // Play notification sound
      this.playNotificationSound();

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  private playNotificationSound(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const buffer = atob(this.notificationSound.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(buffer.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < buffer.length; i++) {
        view[i] = buffer.charCodeAt(i);
      }

      this.audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        const source = this.audioContext!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext!.destination);
        source.start(0);
      });
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}

export const notificationService: NotificationService = new BrowserNotificationService();
