const STORAGE_KEYS = {
  theme: 'campus360-theme',
  registeredEvents: 'campus360-registered-events',
  savedBlogs: 'campus360-saved-blogs',
  notifications: 'campus360-notifications',
  lostFoundEntries: 'campus360-lost-found',
  reports: 'campus360-reports',
  feedback: 'campus360-feedback',
  cart: 'campus360-cart',
  orders: 'campus360-orders',
  memberships: 'campus360-memberships',
  profilePreferences: 'campus360-profile-preferences'
};

const Storage = {
  get(key, fallback = []) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  addToList(key, item) {
    const current = this.get(key, []);
    const next = Array.isArray(current) ? current : [];
    next.unshift(item);
    this.set(key, next);
  },
  toggleValue(key, value) {
    const current = this.get(key, []);
    const exists = current.includes(value);
    const next = exists ? current.filter(item => item !== value) : [...current, value];
    this.set(key, next);
    return next;
  },
  markAsRead(notificationId) {
    const notifications = this.get(STORAGE_KEYS.notifications, []);
    const updated = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    this.set(STORAGE_KEYS.notifications, updated);
    return updated;
  },
  getTheme() {
    return this.get(STORAGE_KEYS.theme, 'light');
  },
  setTheme(theme) {
    this.set(STORAGE_KEYS.theme, theme);
  }
};

window.Storage = Storage;
window.STORAGE_KEYS = STORAGE_KEYS;
