document.addEventListener('DOMContentLoaded', () => {
  initializeGlobalOverlayStates();
  const initialTheme = Storage.getTheme();
  applyTheme(initialTheme);
  bindGlobalControls();
  renderStats();
  renderToday();
  renderAnnouncements();
  renderDashboardStats();
  renderDashboardUpdates();
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

function renderDashboardStats() {
  if (document.body.dataset.page !== 'dashboard') return;
  const container = document.getElementById('stats-grid');
  if (!container) return;

  const metrics = [
    ['Event registrations', Storage.get(STORAGE_KEYS.registeredEvents, []).length],
    ['Saved articles', Storage.get(STORAGE_KEYS.savedBlogs, []).length],
    ['Open reports', Storage.get(STORAGE_KEYS.reports, []).filter(report => report.status !== 'Resolved').length],
    ['Canteen orders', Storage.get(STORAGE_KEYS.orders, []).length]
  ];
  container.innerHTML = metrics.map(([label, value]) => `
    <div class="stat-card">
      <div class="kicker"><span>${label}</span></div>
      <div class="stat-value">${value}</div>
    </div>
  `).join('');
}

function renderDashboardUpdates() {
  const container = document.getElementById('dashboard-announcements');
  if (!container) return;

  const announcements = getAnnouncementsData()
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  container.innerHTML = announcements.map(item => `
    <article class="announcement priority-${item.priority.toLowerCase().replace(' ', '-')} ${item.read ? 'is-read' : 'is-unread'}">
      <div class="meta-line">
        <span class="badge-pill ${item.priority === 'Urgent' ? 'danger' : item.priority === 'Important' ? 'warning' : 'success'}">${item.priority}</span>
        <span>${item.date}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.department} · ${item.category}</p>
    </article>
  `).join('') || '<p class="muted">There are no recent announcements.</p>';
}

function applyTheme(theme = Storage.getTheme()) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.setAttribute('aria-pressed', String(isDark));
  });
  Storage.setTheme(theme);
}

function initializeGlobalOverlayStates() {
  const modal = document.getElementById('generic-modal');
  const modalPanel = modal?.querySelector('.modal-panel');
  const searchOverlay = document.getElementById('search-overlay');
  const searchDialog = searchOverlay?.querySelector('.search-modal');
  const notificationPanel = document.getElementById('notification-panel');
  const searchHeading = searchDialog?.querySelector('.search-header h3');

  [[modal, modalPanel, 'Campus 360 details'], [searchOverlay, searchDialog, 'Search Campus 360'], [notificationPanel, null, 'Notifications']]
    .forEach(([overlay, dialog, label]) => {
      if (!overlay) return;
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('inert', '');
      if (dialog) {
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'false');
        dialog.setAttribute('aria-label', label);
      }
    });

  if (searchHeading && searchDialog) {
    searchHeading.id = 'search-dialog-title';
    searchDialog.removeAttribute('aria-label');
    searchDialog.setAttribute('aria-labelledby', 'search-dialog-title');
  }

  notificationPanel?.setAttribute('role', 'region');
  notificationPanel?.setAttribute('aria-label', 'Notifications');
}

function updateModalBackgroundState() {
  const hasOpenDialog = ['generic-modal', 'search-overlay'].some(id =>
    document.getElementById(id)?.classList.contains('open')
  );

  document.querySelectorAll('.page-shell, #nav-drawer-root').forEach(element => {
    if (hasOpenDialog) {
      element.setAttribute('inert', '');
    } else {
      element.removeAttribute('inert');
    }
  });

  const notificationPanel = document.getElementById('notification-panel');
  if (notificationPanel) {
    if (hasOpenDialog) {
      notificationPanel.setAttribute('inert', '');
    } else if (notificationPanel.classList.contains('open')) {
      notificationPanel.removeAttribute('inert');
    } else {
      notificationPanel.setAttribute('inert', '');
    }
  }
}

function focusableElements(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]'));
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

  document.querySelectorAll('[data-placement-action]').forEach(button => {
    button.addEventListener('click', () => {
      showToast('Sample opportunity only. Confirm application details with official sources.');
    });
  });

  document.querySelectorAll('[data-close="modal"]').forEach(trigger => {
    trigger.addEventListener('click', closeModal);
  });

  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.getElementById('search-overlay')?.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeSearchModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const activeDialog = [
        { overlay: document.getElementById('generic-modal'), dialog: document.querySelector('#generic-modal .modal-panel') },
        { overlay: document.getElementById('search-overlay'), dialog: document.querySelector('#search-overlay .search-modal') }
      ].find(item => item.overlay?.classList.contains('open') && item.dialog);

      if (activeDialog) {
        const focusable = focusableElements(activeDialog.dialog);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) {
          event.preventDefault();
          activeDialog.dialog.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (!activeDialog.dialog.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    if (event.key === 'Escape') {
      closeModal();
      closeSearchModal();
      const panel = document.getElementById('notification-panel');
      if (panel?.classList.contains('open')) {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('inert', '');
        document.querySelector('.notification-trigger')?.setAttribute('aria-expanded', 'false');
        if (window.notificationReturnFocus instanceof HTMLElement && window.notificationReturnFocus.isConnected) {
          window.notificationReturnFocus.focus();
        }
      }
    }
  });
}

function openModal(content) {
  const modal = document.getElementById('generic-modal');
  const panel = document.getElementById('modal-content');
  const dialog = modal.querySelector('.modal-panel');
  window.modalReturnFocus = document.activeElement;
  panel.innerHTML = content;
  modal.removeAttribute('inert');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  dialog.setAttribute('aria-modal', 'true');
  updateModalBackgroundState();
  modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
  const modal = document.getElementById('generic-modal');
  const wasOpen = modal.classList.contains('open');
  const dialog = modal.querySelector('.modal-panel');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  dialog.setAttribute('aria-modal', 'false');
  modal.setAttribute('inert', '');
  updateModalBackgroundState();
  if (wasOpen && window.modalReturnFocus instanceof HTMLElement && window.modalReturnFocus.isConnected) {
    window.modalReturnFocus.focus();
  }
}

function openSearchModal() {
  const overlay = document.getElementById('search-overlay');
  window.searchReturnFocus = document.activeElement;
  overlay.removeAttribute('inert');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.querySelector('.search-modal').setAttribute('aria-modal', 'true');
  document.querySelector('.search-trigger')?.setAttribute('aria-expanded', 'true');
  updateModalBackgroundState();
  document.getElementById('search-input')?.focus();
}

function closeSearchModal() {
  const overlay = document.getElementById('search-overlay');
  const wasOpen = overlay.classList.contains('open');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.querySelector('.search-modal').setAttribute('aria-modal', 'false');
  overlay.setAttribute('inert', '');
  document.querySelector('.search-trigger')?.setAttribute('aria-expanded', 'false');
  updateModalBackgroundState();
  if (wasOpen && window.searchReturnFocus instanceof HTMLElement && window.searchReturnFocus.isConnected) {
    window.searchReturnFocus.focus();
  }
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
  const trigger = document.querySelector('.notification-trigger');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread ? 'grid' : 'none';
  }
  if (trigger) {
    const isOpen = document.getElementById('notification-panel')?.classList.contains('open');
    const action = isOpen ? 'Close' : 'Open';
    trigger.setAttribute('aria-label', `${action} notifications${unread ? `, ${unread} unread` : ''}`);
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
