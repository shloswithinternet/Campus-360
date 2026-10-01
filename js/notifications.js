function renderNotifications() {
  const panel = document.getElementById('notification-list');
  if (!panel) return;

  const items = Storage.get(STORAGE_KEYS.notifications, campusData.notifications);
  panel.innerHTML = items.length ? items.map(item => `
    <div class="notification-item">
      <span class="notification-dot" ${item.read ? 'style="background: var(--text-soft);"' : ''}></span>
      <div>
        <strong>${item.text}</strong>
        <div class="meta-line"><span>${item.time}</span></div>
      </div>
    </div>
  `).join('') : '<div class="empty-state">You are all caught up.</div>';

  renderNotificationBadge();
}
