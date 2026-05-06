interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleNotification(time: string, message: string): void;
  showNotification(title: string, body: string): void;
  isSupported(): boolean;
}

class BrowserNotificationService implements NotificationService {
  private swReg: ServiceWorkerRegistration | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.registerServiceWorker();
  }

  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;
    try {
      this.swReg = await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.error('Service worker registration failed:', err);
    }
  }

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
    if (this.timer) clearTimeout(this.timer);

    const [h, m] = time.split(':').map(Number);
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= new Date()) next.setDate(next.getDate() + 1);

    const delay = next.getTime() - Date.now();

    this.timer = setTimeout(() => {
      this.showNotification('Cleaning Reminder', message);
      this.scheduleNotification(time, message);
    }, delay);
  }

  showNotification(title: string, body: string): void {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const options: NotificationOptions = {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'cleaning-reminder',
      requireInteraction: false,
    };

    if (this.swReg) {
      this.swReg.showNotification(title, options);
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, options))
        .catch(() => new Notification(title, options));
    } else {
      new Notification(title, options);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}

export const notificationService: NotificationService = new BrowserNotificationService();
