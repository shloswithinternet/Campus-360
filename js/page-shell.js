document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';

  document.querySelectorAll('[data-nav]').forEach(link => {
    const matches = link.dataset.nav === page || (page === 'home' && link.dataset.nav === 'home');
    link.classList.toggle('active', matches);
  });

  document.querySelectorAll('[data-nav-group]').forEach(group => {
    const kind = group.dataset.navGroup;
    if (page === kind || (kind === 'explore' && ['news', 'blogs', 'clubs', 'departments', 'facilities', 'calendar', 'timetable', 'placement'].includes(page))) {
      group.classList.add('active');
    }
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
});
