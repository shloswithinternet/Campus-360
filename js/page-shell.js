document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  const isNested = window.location.pathname.includes('/pages/');
  const pagePath = (relativePath) => isNested ? `../${relativePath}` : relativePath;

  const nav = document.querySelector('.nav');
  if (nav) {
    nav.innerHTML = `
      <div class="nav-left">
        <a href="${pagePath('index.html')}" class="brand" aria-label="Home">
          <span class="brand-mark">C</span>
          <div><strong>Campus 360</strong></div>
        </a>
      </div>

      <div class="nav-center">
        <a href="${pagePath('index.html')}" class="nav-link ${page === 'home' ? 'active' : ''}" data-nav="home">Home</a>

        <div class="nav-menu ${page === 'events' ? 'active' : ''}">
          <a href="${pagePath('pages/events.html')}" class="nav-group ${page === 'events' ? 'active' : ''}" data-nav="events">Events</a>
          <div class="nav-menu-items">
            <a href="${pagePath('pages/events.html')}">All Events</a>
            <a href="${pagePath('pages/events.html')}?category=technical">Technical</a>
            <a href="${pagePath('pages/events.html')}?category=cultural">Cultural</a>
            <a href="${pagePath('pages/events.html')}?category=sports">Sports</a>
            <a href="${pagePath('pages/events.html')}?category=workshop">Workshops</a>
            <a href="${pagePath('pages/events.html')}?category=competition">Competitions</a>
          </div>
        </div>

        <a href="${pagePath('pages/announcements.html')}" class="nav-link ${page === 'announcements' ? 'active' : ''}" data-nav="announcements">Announcements</a>
        <a href="${pagePath('pages/campus-map.html')}" class="nav-link ${page === 'campus-map' ? 'active' : ''}" data-nav="campus-map">Campus Map</a>
      </div>

      <div class="nav-right">
        <button class="icon-btn search-trigger" type="button" aria-label="Open search">⌕</button>
        <button class="icon-btn notification-trigger" type="button" aria-label="Open notifications">
          🔔
          <span class="badge" id="notification-badge">3</span>
        </button>
        <button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">☀️</button>
        <a href="${pagePath('pages/profile.html')}" class="profile-pill" aria-label="Open profile">
          <span class="avatar">AS</span>
          <span>Alex</span>
        </a>
        <button class="more-menu-trigger" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="global-sidebar">⋮</button>
      </div>
    `;

    const navMenu = document.querySelectorAll('.nav-menu');
    navMenu.forEach(menu => {
      const trigger = menu.querySelector('.nav-group');
      if (!trigger) return;

      menu.addEventListener('mouseenter', () => menu.classList.add('is-open'));
      menu.addEventListener('mouseleave', () => menu.classList.remove('is-open'));
      trigger.addEventListener('focus', () => menu.classList.add('is-open'));
      trigger.addEventListener('blur', () => menu.classList.remove('is-open'));
    });
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    const matches = link.dataset.nav === page || (page === 'home' && link.dataset.nav === 'home');
    link.classList.toggle('active', matches);
  });

  document.querySelectorAll('.nav-menu-items a').forEach(link => {
    const target = link.dataset.nav;
    if (target === page) {
      link.classList.add('active');
    }
  });

  const currentTheme = Storage.getTheme();
  document.body.classList.toggle('dark', currentTheme === 'dark');
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  const overlay = document.getElementById('nav-drawer-backdrop');
  const drawer = document.getElementById('global-sidebar');
  const moreButton = document.querySelector('.more-menu-trigger');
  const drawerCloseButton = document.querySelector('.nav-drawer-close');

  if (!drawer || !overlay) {
    const drawerRoot = document.createElement('div');
    drawerRoot.innerHTML = `
      <div class="nav-drawer-backdrop" id="nav-drawer-backdrop"></div>
      <aside class="nav-drawer" id="global-sidebar" aria-hidden="true">
        <div class="nav-drawer-header">
          <div class="brand">
            <span class="brand-mark">C</span>
            <div><strong>Campus 360</strong></div>
          </div>
          <button class="nav-drawer-close" type="button" aria-label="Close menu">×</button>
        </div>
        <div class="nav-drawer-body">
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Explore</div>
            <a href="${pagePath('pages/events.html')}">Events</a>
            <a href="${pagePath('pages/news.html')}">News</a>
            <a href="${pagePath('pages/blogs.html')}">Blogs</a>
            <a href="${pagePath('pages/clubs.html')}">Clubs</a>
            <a href="${pagePath('pages/departments.html')}">Departments</a>
            <a href="${pagePath('pages/facilities.html')}">Facilities</a>
            <a href="${pagePath('pages/calendar.html')}">Academic Calendar</a>
            <a href="${pagePath('pages/timetable.html')}">Timetable</a>
            <a href="${pagePath('pages/placement.html')}">Placement &amp; Career</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Campus</div>
            <a href="${pagePath('pages/campus-map.html')}">Campus Map</a>
            <a href="${pagePath('pages/library.html')}">Library</a>
            <a href="${pagePath('pages/canteen.html')}">Canteen</a>
            <a href="${pagePath('pages/campus-help.html')}">Campus Help</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Services</div>
            <a href="${pagePath('pages/services.html')}">Services overview</a>
            <a href="${pagePath('pages/lost-found.html')}">Lost &amp; Found</a>
            <a href="${pagePath('pages/report.html')}">Report an Issue</a>
            <a href="${pagePath('pages/feedback.html')}">Feedback</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Account</div>
            <a href="${pagePath('pages/dashboard.html')}">Dashboard</a>
            <a href="${pagePath('pages/profile.html')}">Profile</a>
          </div>
          <div class="nav-drawer-group">
            <div class="nav-drawer-label">Official</div>
            <a href="https://www.apsit.edu.in" target="_blank" rel="noreferrer">APSIT Website</a>
          </div>
        </div>
      </aside>
    `;
    document.body.appendChild(drawerRoot);
  }

  const openDrawer = () => {
    const drawerEl = document.getElementById('global-sidebar');
    const backdropEl = document.getElementById('nav-drawer-backdrop');
    if (!drawerEl || !backdropEl) return;
    drawerEl.classList.add('open');
    backdropEl.classList.add('open');
    drawerEl.setAttribute('aria-hidden', 'false');
    if (moreButton) moreButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
  };

  const closeDrawer = () => {
    const drawerEl = document.getElementById('global-sidebar');
    const backdropEl = document.getElementById('nav-drawer-backdrop');
    if (!drawerEl || !backdropEl) return;
    drawerEl.classList.remove('open');
    backdropEl.classList.remove('open');
    drawerEl.setAttribute('aria-hidden', 'true');
    if (moreButton) moreButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  };

  if (moreButton) {
    moreButton.addEventListener('click', () => {
      const isOpen = document.getElementById('global-sidebar')?.classList.contains('open');
      if (isOpen) closeDrawer(); else openDrawer();
    });
  }

  if (drawerCloseButton) {
    drawerCloseButton.addEventListener('click', closeDrawer);
  }

  const backdrop = document.getElementById('nav-drawer-backdrop');
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  });

  if (document.querySelector('.nav-drawer a.active')) {
    document.querySelector('.nav-drawer a.active')?.classList.add('active');
  }
});
