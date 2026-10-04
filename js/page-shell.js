document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  const isNested = window.location.pathname.includes('/pages/');

  const pagePath = (target) => {
    if (!target) return '#';
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#')) {
      return target;
    }
    if (!isNested) {
      return target;
    } else {
      if (target === 'index.html') {
        return '../index.html';
      }
      if (target.startsWith('pages/')) {
        return target.replace(/^pages\//, '');
      }
      return target;
    }
  };

  const currentTheme = (typeof Storage !== 'undefined' && Storage.getTheme) ? Storage.getTheme() : 'light';
  document.body.classList.toggle('dark', currentTheme === 'dark');

  const notifications = (typeof Storage !== 'undefined' && typeof STORAGE_KEYS !== 'undefined')
    ? Storage.get(STORAGE_KEYS.notifications, (typeof campusData !== 'undefined' ? campusData.notifications : []))
    : [];
  const unreadNotifications = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  const registeredEvents = (typeof Storage !== 'undefined' && typeof STORAGE_KEYS !== 'undefined')
    ? Storage.get(STORAGE_KEYS.registeredEvents, [])
    : [];
  const ticketCount = Array.isArray(registeredEvents) ? registeredEvents.length : 0;

  const icon = (name) => {
    const paths = {
      search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
      notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
      theme: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>',
      profile: '<circle cx="12" cy="8" r="4"></circle><path d="M5 21a7 7 0 0 1 14 0"></path>',
      more: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
      close: '<path d="m18 6-12 12M6 6l12 12"></path>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
  };

  // Keep the primary bar short; secondary destinations live in the More drawer.
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.innerHTML = `
      <div class="nav-left">
        <a href="${pagePath('index.html')}" class="brand" aria-label="Campus 360 Home">
          <span class="brand-mark">C</span>
          <span class="brand-name">Campus 360</span>
        </a>
      </div>

      <div class="nav-center">
        <a href="${pagePath('index.html')}" class="nav-link ${page === 'home' ? 'active' : ''}" data-nav="home" ${page === 'home' ? 'aria-current="page"' : ''}>Home</a>
        <a href="${pagePath('pages/events.html')}" class="nav-link ${page === 'events' ? 'active' : ''}" data-nav="events" ${page === 'events' ? 'aria-current="page"' : ''}>Events</a>
        <a href="${pagePath('pages/news.html')}" class="nav-link ${page === 'news' ? 'active' : ''}" data-nav="news" ${page === 'news' ? 'aria-current="page"' : ''}>News</a>
        <a href="${pagePath('pages/campus-map.html')}" class="nav-link ${['campus-map', 'facilities', 'departments', 'clubs'].includes(page) ? 'active' : ''}" data-nav="campus" ${page === 'campus-map' ? 'aria-current="page"' : ''}>Campus</a>
      </div>

      <div class="nav-right">
        <button class="icon-btn search-trigger" type="button" aria-label="Search Campus 360" aria-controls="search-overlay" aria-expanded="false" title="Search">${icon('search')}</button>
        <button class="icon-btn notification-trigger" type="button" aria-label="${unreadNotifications ? `Open notifications, ${unreadNotifications} unread` : 'Open notifications'}" aria-controls="notification-panel" aria-expanded="false">
          ${icon('notifications')}
          <span class="badge" id="notification-badge" style="${unreadNotifications > 0 ? '' : 'display: none;'}">${unreadNotifications}</span>
        </button>
        <button class="icon-btn theme-toggle" type="button" aria-label="${currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}" aria-pressed="${currentTheme === 'dark'}" title="${currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}">${icon('theme')}</button>
        <a href="${pagePath('pages/profile.html')}" class="profile-pill ${page === 'profile' ? 'active' : ''}" id="profile-button" aria-label="Open profile" ${page === 'profile' ? 'aria-current="page"' : ''}>
          ${icon('profile')}<span class="profile-label">Profile</span>
        </a>
        <button class="more-menu-trigger" type="button" aria-label="Open More navigation" aria-expanded="false" aria-controls="global-sidebar">
          ${icon('more')}<span>More</span>
        </button>
      </div>
    `;
    if (!document.querySelector('.demo-disclosure')) {
      nav.insertAdjacentHTML('afterend', '<p class="demo-disclosure" role="note"><span>Prototype</span> Sample content is not verified APSIT information.</p>');
    }
  }

  // Ensure Global Sidebar Drawer exists in DOM
  let drawer = document.getElementById('global-sidebar');
  let overlay = document.getElementById('nav-drawer-backdrop');

  if (!drawer || !overlay) {
    const drawerRoot = document.createElement('div');
    drawerRoot.id = 'nav-drawer-root';
    drawerRoot.innerHTML = `
      <div class="nav-drawer-backdrop" id="nav-drawer-backdrop"></div>
      <aside class="nav-drawer" id="global-sidebar" aria-hidden="true" inert role="dialog" aria-modal="false" aria-labelledby="nav-drawer-title">
        <div class="nav-drawer-header">
          <div class="brand">
            <span class="brand-mark">C</span>
            <span id="nav-drawer-title" class="brand-name">More from Campus 360</span>
          </div>
          <button class="nav-drawer-close" type="button" aria-label="Close menu">${icon('close')}</button>
        </div>
        <div class="nav-drawer-body">
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Campus</div>
            <a href="${pagePath('pages/campus-map.html')}" class="${page === 'campus-map' ? 'active' : ''}">Campus map</a>
            <a href="${pagePath('pages/facilities.html')}" class="${page === 'facilities' ? 'active' : ''}">Facilities</a>
            <a href="${pagePath('pages/departments.html')}" class="${page === 'departments' ? 'active' : ''}">Departments</a>
            <a href="${pagePath('pages/clubs.html')}" class="${page === 'clubs' ? 'active' : ''}">Clubs</a>
            <a href="${pagePath('pages/campus-help.html')}" class="${page === 'campus-help' ? 'active' : ''}">Campus help</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Academic</div>
            <a href="${pagePath('pages/calendar.html')}" class="${page === 'calendar' ? 'active' : ''}">Calendar</a>
            <a href="${pagePath('pages/timetable.html')}" class="${page === 'timetable' ? 'active' : ''}">Timetable</a>
            <a href="${pagePath('pages/library.html')}" class="${page === 'library' ? 'active' : ''}">Library</a>
            <a href="${pagePath('pages/placement.html')}" class="${page === 'placement' ? 'active' : ''}">Placement</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Services</div>
            <a href="${pagePath('pages/canteen.html')}" class="${page === 'canteen' ? 'active' : ''}">Canteen</a>
            <a href="${pagePath('pages/lost-found.html')}" class="${page === 'lost-found' ? 'active' : ''}">Lost &amp; Found</a>
            <a href="${pagePath('pages/report.html')}" class="${page === 'report' ? 'active' : ''}">Report an issue</a>
            <a href="${pagePath('pages/feedback.html')}" class="${page === 'feedback' ? 'active' : ''}">Feedback</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Information</div>
            <a href="${pagePath('pages/announcements.html')}" class="${page === 'announcements' ? 'active' : ''}">Announcements</a>
            <a href="${pagePath('pages/blogs.html')}" class="${page === 'blogs' ? 'active' : ''}">Blogs</a>
            <a href="${pagePath('pages/services.html')}" class="${page === 'services' ? 'active' : ''}">Services overview</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Your account</div>
            <a href="${pagePath('pages/dashboard.html')}" class="${page === 'dashboard' ? 'active' : ''}">Dashboard</a>
            <a href="${pagePath('pages/profile.html')}" class="${page === 'profile' ? 'active' : ''}">Profile</a>
            <a href="${pagePath('pages/events.html')}#tickets" id="tickets-button" class="tickets-pill">My event tickets <span class="ticket-count" id="ticket-badge">${ticketCount}</span></a>
          </div>
          <p class="nav-drawer-note">Prototype content only. Verify details with the relevant campus office.</p>
        </div>
      </aside>
    `;
    document.body.appendChild(drawerRoot);
    drawer = document.getElementById('global-sidebar');
    overlay = document.getElementById('nav-drawer-backdrop');
  }

  document.querySelector('#notification-panel')?.setAttribute('role', 'region');
  document.querySelector('#notification-panel')?.setAttribute('aria-label', 'Notifications');

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Global drawer functions
function openDrawer() {
  const drawerEl = document.getElementById('global-sidebar');
  const backdropEl = document.getElementById('nav-drawer-backdrop');
  const moreBtn = document.querySelector('.more-menu-trigger');
  if (!drawerEl || !backdropEl) return;
  window.drawerReturnFocus = document.activeElement;
  drawerEl.removeAttribute('inert');
  drawerEl.classList.add('open');
  backdropEl.classList.add('open');
  drawerEl.setAttribute('aria-hidden', 'false');
  drawerEl.setAttribute('aria-modal', 'true');
  if (moreBtn) moreBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  const closeBtn = drawerEl.querySelector('.nav-drawer-close');
  if (closeBtn) closeBtn.focus();
}

function closeDrawer() {
  const drawerEl = document.getElementById('global-sidebar');
  const backdropEl = document.getElementById('nav-drawer-backdrop');
  const moreBtn = document.querySelector('.more-menu-trigger');
  if (!drawerEl || !backdropEl) return;
  const wasOpen = drawerEl.classList.contains('open');
  drawerEl.classList.remove('open');
  backdropEl.classList.remove('open');
  drawerEl.setAttribute('aria-hidden', 'true');
  drawerEl.setAttribute('aria-modal', 'false');
  drawerEl.setAttribute('inert', '');
  if (moreBtn) {
    moreBtn.setAttribute('aria-expanded', 'false');
  }
  document.body.classList.remove('drawer-open');
  if (wasOpen) {
    const returnTarget = window.drawerReturnFocus instanceof HTMLElement ? window.drawerReturnFocus : moreBtn;
    returnTarget?.focus();
  }
}

// Delegated click handling for resilient header controls
document.addEventListener('click', (event) => {
  // Three-dot More button
  const moreBtn = event.target.closest('.more-menu-trigger');
  if (moreBtn) {
    event.preventDefault();
    const isOpen = document.getElementById('global-sidebar')?.classList.contains('open');
    if (isOpen) closeDrawer(); else openDrawer();
    return;
  }

  // Drawer close button
  if (event.target.closest('.nav-drawer-close')) {
    event.preventDefault();
    closeDrawer();
    return;
  }

  // Drawer backdrop
  if (event.target.closest('#nav-drawer-backdrop')) {
    event.preventDefault();
    closeDrawer();
    return;
  }

  // Drawer links
  if (event.target.closest('.nav-drawer a')) {
    closeDrawer();
    return;
  }

  // Theme toggle
  if (event.target.closest('.theme-toggle')) {
    event.preventDefault();
    const isDark = document.body.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    if (typeof applyTheme === 'function') {
      applyTheme(nextTheme);
    } else {
      document.body.classList.toggle('dark', nextTheme === 'dark');
      if (typeof Storage !== 'undefined' && Storage.setTheme) {
        Storage.setTheme(nextTheme);
      }
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        const label = nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        btn.setAttribute('aria-pressed', String(nextTheme === 'dark'));
      });
    }
    if (typeof showToast === 'function') {
      showToast(`Switched to ${nextTheme} mode.`);
    }
    return;
  }

  // Search trigger
  if (event.target.closest('.search-trigger')) {
    event.preventDefault();
    if (typeof openSearchModal === 'function') {
      openSearchModal();
    } else {
      const overlay = document.getElementById('search-overlay');
      if (overlay) {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.getElementById('search-input')?.focus();
      }
    }
    return;
  }

  // Search close button
  if (event.target.closest('.search-close')) {
    event.preventDefault();
    if (typeof closeSearchModal === 'function') {
      closeSearchModal();
    } else {
      const overlay = document.getElementById('search-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
      }
    }
    return;
  }

  // Notification trigger
  if (event.target.closest('.notification-trigger')) {
    event.preventDefault();
    const trigger = event.target.closest('.notification-trigger');
    const panel = document.getElementById('notification-panel');
    if (panel) {
      const isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      panel.setAttribute('aria-hidden', String(isOpen));
      panel.toggleAttribute('inert', isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        window.notificationReturnFocus = trigger;
        panel.querySelector('#mark-all-read')?.focus();
      } else if (window.notificationReturnFocus instanceof HTMLElement && window.notificationReturnFocus.isConnected) {
        window.notificationReturnFocus.focus();
      }
      if (typeof renderNotificationBadge === 'function') renderNotificationBadge();
    }
    return;
  }
});

// Escape key closes drawer, modal, and overlays
document.addEventListener('keydown', (event) => {
  const drawerEl = document.getElementById('global-sidebar');
  if (drawerEl?.classList.contains('open') && event.key === 'Tab') {
    const focusable = [...drawerEl.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  if (event.key === 'Escape') {
    closeDrawer();
    const overlay = document.getElementById('search-overlay');
    if (overlay && overlay.classList.contains('open')) {
      if (typeof closeSearchModal === 'function') closeSearchModal();
      else {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
      }
    }
    const notifPanel = document.getElementById('notification-panel');
    if (notifPanel && notifPanel.classList.contains('open')) {
      notifPanel.classList.remove('open');
      notifPanel.setAttribute('aria-hidden', 'true');
      notifPanel.setAttribute('inert', '');
      document.querySelector('.notification-trigger')?.setAttribute('aria-expanded', 'false');
      if (window.notificationReturnFocus instanceof HTMLElement && window.notificationReturnFocus.isConnected) {
        window.notificationReturnFocus.focus();
      }
      if (typeof renderNotificationBadge === 'function') renderNotificationBadge();
    }
    const modal = document.getElementById('generic-modal');
    if (modal && modal.classList.contains('open')) {
      if (typeof closeModal === 'function') closeModal();
      else {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  }
});
