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

  // Build the clean, streamlined navigation bar
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.innerHTML = `
      <div class="nav-left">
        <a href="${pagePath('index.html')}" class="brand" aria-label="Campus 360 Home">
          <span class="brand-mark">C</span>
          <div><strong>Campus 360</strong></div>
        </a>
      </div>

      <div class="nav-center">
        <a href="${pagePath('index.html')}" class="nav-link ${page === 'home' ? 'active' : ''}" data-nav="home">Home</a>

        <div class="nav-menu ${page === 'events' ? 'active' : ''}" data-menu="events">
          <a href="${pagePath('pages/events.html')}" class="nav-link nav-group ${page === 'events' ? 'active' : ''}" data-nav="events" aria-haspopup="true" aria-expanded="false">Events</a>
          <div class="nav-menu-items" role="menu" aria-label="Events sub-menu">
            <a href="${pagePath('pages/events.html')}" role="menuitem">All Events</a>
            <a href="${pagePath('pages/events.html')}?category=technical" role="menuitem">Technical Events</a>
            <a href="${pagePath('pages/events.html')}?category=cultural" role="menuitem">Cultural Events</a>
            <a href="${pagePath('pages/events.html')}?category=sports" role="menuitem">Sports &amp; Athletics</a>
            <a href="${pagePath('pages/events.html')}?category=workshop" role="menuitem">Workshops</a>
            <a href="${pagePath('pages/events.html')}?category=placement" role="menuitem">Bootcamps</a>
          </div>
        </div>

        <div class="nav-menu ${['services', 'lost-found', 'report', 'feedback', 'campus-help'].includes(page) ? 'active' : ''}" data-menu="services">
          <a href="${pagePath('pages/services.html')}" class="nav-link nav-group ${['services', 'lost-found', 'report', 'feedback', 'campus-help'].includes(page) ? 'active' : ''}" data-nav="services" aria-haspopup="true" aria-expanded="false">Services</a>
          <div class="nav-menu-items" role="menu" aria-label="Services sub-menu">
            <a href="${pagePath('pages/services.html')}" role="menuitem">Services Overview</a>
            <a href="${pagePath('pages/lost-found.html')}" role="menuitem">Lost &amp; Found</a>
            <a href="${pagePath('pages/report.html')}" role="menuitem">Report an Issue</a>
            <a href="${pagePath('pages/feedback.html')}" role="menuitem">Feedback</a>
            <a href="${pagePath('pages/campus-help.html')}" role="menuitem">Campus Help Desk</a>
          </div>
        </div>

        <a href="${pagePath('pages/announcements.html')}" class="nav-link ${page === 'announcements' ? 'active' : ''}" data-nav="announcements">Announcements</a>
        <a href="${pagePath('pages/campus-map.html')}" class="nav-link ${page === 'campus-map' ? 'active' : ''}" data-nav="campus-map">Campus Map</a>
      </div>

      <div class="nav-right">
        <button class="icon-btn search-trigger" type="button" aria-label="Open search">⌕</button>
        <button class="icon-btn notification-trigger" type="button" aria-label="Open notifications">
          🔔
          <span class="badge" id="notification-badge" style="${unreadNotifications > 0 ? '' : 'display: none;'}">${unreadNotifications}</span>
        </button>
        <button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">${currentTheme === 'dark' ? '🌙' : '☀️'}</button>
        <a href="${pagePath('pages/profile.html')}" class="profile-pill ${page === 'profile' ? 'active' : ''}" id="profile-button" aria-label="Open student profile">
          <span class="avatar">AS</span>
          <span>Alex</span>
        </a>
        <button class="more-menu-trigger" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="global-sidebar">⋮</button>
      </div>
    `;

    // Dropdown hover & accessible focus management
    const navMenus = document.querySelectorAll('.nav-menu');
    navMenus.forEach(menu => {
      const trigger = menu.querySelector('.nav-group');
      if (!trigger) return;

      menu.addEventListener('mouseenter', () => {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      menu.addEventListener('mouseleave', () => {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });

      menu.addEventListener('focusin', () => {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      menu.addEventListener('focusout', (e) => {
        if (!menu.contains(e.relatedTarget)) {
          menu.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      menu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          menu.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  }

  // Ensure Global Sidebar Drawer exists in DOM
  let drawer = document.getElementById('global-sidebar');
  let overlay = document.getElementById('nav-drawer-backdrop');

  if (!drawer || !overlay) {
    const drawerRoot = document.createElement('div');
    drawerRoot.id = 'nav-drawer-root';
    drawerRoot.innerHTML = `
      <div class="nav-drawer-backdrop" id="nav-drawer-backdrop"></div>
      <aside class="nav-drawer" id="global-sidebar" aria-hidden="true" role="dialog" aria-label="Campus 360 navigation menu">
        <div class="nav-drawer-header">
          <div class="brand">
            <span class="brand-mark">C</span>
            <div><strong>Campus 360</strong></div>
          </div>
          <button class="nav-drawer-close" type="button" aria-label="Close menu">×</button>
        </div>
        <div class="nav-drawer-body">
          <div class="nav-drawer-group mobile-nav-group">
            <div class="nav-drawer-label">Quick Links</div>
            <a href="${pagePath('index.html')}" class="${page === 'home' ? 'active' : ''}">🏠 Home</a>
            <a href="${pagePath('pages/events.html')}" class="${page === 'events' ? 'active' : ''}">🎉 Events</a>
            <a href="${pagePath('pages/services.html')}" class="${page === 'services' ? 'active' : ''}">🛠️ Services Overview</a>
            <a href="${pagePath('pages/announcements.html')}" class="${page === 'announcements' ? 'active' : ''}">📢 Announcements</a>
            <a href="${pagePath('pages/campus-map.html')}" class="${page === 'campus-map' ? 'active' : ''}">🗺️ Campus Map</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Explore Campus</div>
            <a href="${pagePath('pages/news.html')}" class="${page === 'news' ? 'active' : ''}">📰 Campus News</a>
            <a href="${pagePath('pages/blogs.html')}" class="${page === 'blogs' ? 'active' : ''}">✍️ Student Blogs</a>
            <a href="${pagePath('pages/clubs.html')}" class="${page === 'clubs' ? 'active' : ''}">👥 Student Clubs</a>
            <a href="${pagePath('pages/departments.html')}" class="${page === 'departments' ? 'active' : ''}">🏫 Departments</a>
            <a href="${pagePath('pages/facilities.html')}" class="${page === 'facilities' ? 'active' : ''}">🏢 Campus Facilities</a>
            <a href="${pagePath('pages/calendar.html')}" class="${page === 'calendar' ? 'active' : ''}">📅 Academic Calendar</a>
            <a href="${pagePath('pages/timetable.html')}" class="${page === 'timetable' ? 'active' : ''}">⏱️ Timetable</a>
            <a href="${pagePath('pages/placement.html')}" class="${page === 'placement' ? 'active' : ''}">💼 Placement &amp; Career</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Campus Hubs</div>
            <a href="${pagePath('pages/library.html')}" class="${page === 'library' ? 'active' : ''}">📚 Library Hub</a>
            <a href="${pagePath('pages/canteen.html')}" class="${page === 'canteen' ? 'active' : ''}">🍴 Canteen &amp; Dining</a>
            <a href="${pagePath('pages/campus-help.html')}" class="${page === 'campus-help' ? 'active' : ''}">❓ Campus Help Desk</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Services &amp; Support</div>
            <a href="${pagePath('pages/lost-found.html')}" class="${page === 'lost-found' ? 'active' : ''}">🔎 Lost &amp; Found</a>
            <a href="${pagePath('pages/report.html')}" class="${page === 'report' ? 'active' : ''}">🚨 Report an Issue</a>
            <a href="${pagePath('pages/feedback.html')}" class="${page === 'feedback' ? 'active' : ''}">💬 Feedback</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Account</div>
            <a href="${pagePath('pages/dashboard.html')}" class="${page === 'dashboard' ? 'active' : ''}">📊 Student Dashboard</a>
            <a href="${pagePath('pages/profile.html')}" class="${page === 'profile' ? 'active' : ''}">👤 Student Profile</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Official Portal</div>
            <a href="https://www.apsit.edu.in" target="_blank" rel="noreferrer">🌐 APSIT Official Website ↗</a>
          </div>
        </div>
      </aside>
    `;
    document.body.appendChild(drawerRoot);
    drawer = document.getElementById('global-sidebar');
    overlay = document.getElementById('nav-drawer-backdrop');
  }

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  drawerEl.classList.add('open');
  backdropEl.classList.add('open');
  drawerEl.setAttribute('aria-hidden', 'false');
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
  drawerEl.classList.remove('open');
  backdropEl.classList.remove('open');
  drawerEl.setAttribute('aria-hidden', 'true');
  if (moreBtn) {
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.focus();
  }
  document.body.classList.remove('drawer-open');
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
        btn.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
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
    const panel = document.getElementById('notification-panel');
    if (panel) {
      const isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      panel.setAttribute('aria-hidden', String(!isOpen));
    }
    return;
  }
});

// Escape key closes drawer, modal, and overlays
document.addEventListener('keydown', (event) => {
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
