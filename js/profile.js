function renderStats() {
  const container = document.getElementById('stats-grid');
  if (!container) return;
  container.innerHTML = campusData.stats.map(stat => `
    <div class="stat-card">
      <div class="kicker">
        <span>${stat.label}</span>
        <span>${stat.icon}</span>
      </div>
      <div class="stat-value">${stat.value}</div>
    </div>
  `).join('');
}

function renderToday() {
  const list = document.getElementById('today-list');
  if (!list) return;
  list.innerHTML = campusData.today.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-content">
        <h3>${item.title}</h3>
        <p>${item.location}</p>
      </div>
      <button class="btn btn-secondary">Open</button>
    </div>
  `).join('');
}

function renderCalendar() {
  const root = document.getElementById('calendar-root');
  if (!root) return;

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = Array.from({ length: 35 }, (_, idx) => {
    const date = 1 + idx;
    return { day: date, isCurrent: date <= 31 && date >= 5 };
  });

  root.innerHTML = `
    <div class="calendar-head">
      <h3>October 2026</h3>
      <div class="filter-row">
        <button class="chip active">All</button>
        <button class="chip">Events</button>
        <button class="chip">Exam</button>
      </div>
    </div>
    <div class="calendar-grid">
      ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
      ${days.map(day => `
        <div class="calendar-day ${day.isCurrent ? 'active' : ''}">
          <span>${day.day}</span>
          ${day.day >= 5 && day.day <= 23 ? '<span class="event-dot"></span>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderProfile() {
  const profileButton = document.getElementById('profile-button');
  if (profileButton) {
    profileButton.innerHTML = '<span class="avatar">AS</span><span>Alex</span>';
  }

  const form = document.getElementById('profile-preferences-form');
  if (!form) return;

  const preferences = Storage.get(STORAGE_KEYS.profilePreferences, {});
  form.elements.namedItem('librarySlot').value = preferences.librarySlot || '4:00 PM - 6:00 PM';
  form.elements.namedItem('canteen').value = preferences.canteen || 'Main Canteen';
  form.elements.namedItem('theme').value = Storage.getTheme();

  if (form.dataset.bound) return;
  form.dataset.bound = 'true';
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    Storage.set(STORAGE_KEYS.profilePreferences, {
      librarySlot: formData.get('librarySlot'),
      canteen: formData.get('canteen')
    });
    applyTheme(String(formData.get('theme')));
    showToast('Your profile preferences have been saved.');
  });
}
