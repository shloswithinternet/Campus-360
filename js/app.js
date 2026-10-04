document.addEventListener('DOMContentLoaded', () => {
  const initialTheme = Storage.getTheme();
  applyTheme(initialTheme);
  bindGlobalControls();
  renderStats();
  renderToday();
  renderAnnouncements();
  renderNews();
  renderBlogs();
  renderEvents();
  renderCanteen();
  renderLibrary();
  renderMap();
  renderLostFound();
  renderClubs();
  renderDepartments();
  renderFacilities();
  renderCalendar();
  renderReports();
  renderFeedback();
  renderNotifications();
  renderProfile();
  renderSearchSuggestions();
  renderNotificationBadge();
});

function applyTheme(theme = Storage.getTheme()) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.textContent = isDark ? '🌙' : '☀️';
  });
  Storage.setTheme(theme);
}

function bindGlobalControls() {
  document.getElementById('hero-search')?.addEventListener('focus', openSearchModal);
  document.getElementById('hero-search')?.addEventListener('input', (event) => {
    const term = event.target.value.trim();
    renderSearchResults(term);
  });

  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    const items = Storage.get(STORAGE_KEYS.notifications, campusData.notifications);
    Storage.set(STORAGE_KEYS.notifications, items.map(item => ({ ...item, read: true })));
    renderNotifications();
    renderNotificationBadge();
    showToast('All notifications marked as read.');
  });

  document.querySelectorAll('.quick-card').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (target) {
        const element = document.querySelector(target);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('[data-close="modal"]').forEach(trigger => {
    trigger.addEventListener('click', closeModal);
  });

  document.querySelector('.modal-close')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      closeSearchModal();
      const panel = document.getElementById('notification-panel');
      panel?.classList.remove('open');
      panel?.setAttribute('aria-hidden', 'true');
    }
  });
}

function openModal(content) {
  const modal = document.getElementById('generic-modal');
  const panel = document.getElementById('modal-content');
  panel.innerHTML = content;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('generic-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function openSearchModal() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.getElementById('search-input')?.focus();
}

function closeSearchModal() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

function openProfileDashboard() {
  const profile = getProfileData();
  const html = `
    <div class="profile-modal">
      <div class="profile-top">
        <div class="avatar large">AS</div>
        <div>
          <h2>${profile.name}</h2>
          <p>${profile.department} • Semester ${profile.semester}</p>
        </div>
      </div>
      <div class="mini-grid">
        <div class="mini-card"><strong>Student ID</strong><span>${profile.studentId}</span></div>
        <div class="mini-card"><strong>Upcoming Events</strong><span>${profile.upcomingEvents}</span></div>
        <div class="mini-card"><strong>Reports</strong><span>${profile.reportCount}</span></div>
        <div class="mini-card"><strong>Canteen Orders</strong><span>${profile.orderCount}</span></div>
      </div>
      <div class="profile-section">
        <h3>My Campus Dashboard</h3>
        <div class="stats-grid compact">
          ${[
            ['Upcoming Events', profile.upcomingEvents],
            ['My Registrations', profile.registrations],
            ['My Reports', profile.reportCount],
            ['Lost & Found', profile.lostItems],
            ['Library Activity', profile.libraryActivity],
            ['Canteen Orders', profile.orderCount],
            ['Saved Articles', profile.savedArticles],
            ['Notifications', profile.notificationCount]
          ].map(([label, value]) => `
            <div class="stat-card">
              <div class="kicker"><span>${label}</span></div>
              <div class="stat-value">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  openModal(html);
}

function getProfileData() {
  const registrations = Storage.get(STORAGE_KEYS.registeredEvents, []);
  const orders = Storage.get(STORAGE_KEYS.orders, []);
  const reports = Storage.get(STORAGE_KEYS.reports, []);
  const notifications = Storage.get(STORAGE_KEYS.notifications, campusData.notifications);
  const likes = Storage.get(STORAGE_KEYS.savedBlogs, []);
  const lost = Storage.get(STORAGE_KEYS.lostFoundEntries, campusData.lostFound);
  return {
    name: 'Alex Student',
    department: 'Computer Engineering',
    semester: '3',
    studentId: 'C360-DEMO-001',
    upcomingEvents: registrations.length || 2,
    registrations: registrations.length || 1,
    reportCount: reports.length || 1,
    lostItems: lost.length || 2,
    libraryActivity: 4,
    orderCount: orders.length || 1,
    savedArticles: likes.length || 3,
    notificationCount: notifications.filter(item => !item.read).length || 2
  };
}

function showToast(message) {
  const stack = document.getElementById('toast-stack');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2200);
}

function renderNotificationBadge() {
  const items = Storage.get(STORAGE_KEYS.notifications, campusData.notifications);
  const unread = items.filter(item => !item.read).length;
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread ? 'grid' : 'none';
  }
}

window.renderStats = renderStats;
window.renderToday = renderToday;
window.renderEvents = renderEvents;
window.renderAnnouncements = renderAnnouncements;
window.renderNews = renderNews;
window.renderBlogs = renderBlogs;
window.renderCanteen = renderCanteen;
window.renderLibrary = renderLibrary;
window.renderMap = renderMap;
window.renderLostFound = renderLostFound;
window.renderClubs = renderClubs;
window.renderDepartments = renderDepartments;
window.renderFacilities = renderFacilities;
window.renderCalendar = renderCalendar;
window.renderReports = renderReports;
window.renderFeedback = renderFeedback;
window.renderNotifications = renderNotifications;
window.renderProfile = renderProfile;
window.renderSearchSuggestions = renderSearchSuggestions;
window.renderSearchResults = renderSearchResults;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
