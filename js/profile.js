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
  let shownMonth = new Date(2026, 9, 1);
  let selectedDate = '';

  const dateKey = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  const calendarEvents = () => (campusData.events || []).filter(event =>
    event.start && event.start.slice(0, 7) === `${shownMonth.getFullYear()}-${String(shownMonth.getMonth() + 1).padStart(2, '0')}`
  );

  const render = () => {
    const year = shownMonth.getFullYear();
    const month = shownMonth.getMonth();
    const monthEvents = calendarEvents();
    const eventDates = new Set(monthEvents.map(event => event.start.slice(0, 10)));
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const monthLabel = shownMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    const todayKey = typeof EVENT_CONFIG !== 'undefined' ? EVENT_CONFIG.todayKey : '';

    if (!selectedDate || selectedDate.slice(0, 7) !== `${year}-${String(month + 1).padStart(2, '0')}`) {
      selectedDate = monthEvents[0]?.start.slice(0, 10) || dateKey(new Date(year, month, 1));
    }

    const selectedEvents = monthEvents.filter(event => event.start.slice(0, 10) === selectedDate);
    const selectedDateValue = new Date(`${selectedDate}T12:00:00`);

    root.innerHTML = `
      <div class="calendar-head">
        <div>
          <span class="eyebrow">Sample schedule</span>
          <h2>${monthLabel}</h2>
        </div>
        <div class="calendar-controls" aria-label="Calendar month navigation">
          <button class="btn btn-secondary" type="button" data-month-shift="-1" aria-label="Previous month">Previous</button>
          <button class="btn btn-secondary" type="button" data-month-shift="1" aria-label="Next month">Next</button>
        </div>
      </div>
      <p class="calendar-legend"><span class="event-dot" aria-hidden="true"></span>Sample event date</p>
      <div class="calendar-grid" role="group" aria-label="${monthLabel}">
        ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
        ${Array.from({ length: cellCount }, (_, index) => {
          const dayNumber = index - firstWeekday + 1;
          const date = new Date(year, month, dayNumber);
          const key = dateKey(date);
          const inCurrentMonth = date.getMonth() === month;
          const hasEvent = inCurrentMonth && eventDates.has(key);
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          const accessibleDate = date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
          const eventNote = hasEvent ? ', sample event scheduled' : '';

          return `
            <button class="calendar-day ${inCurrentMonth ? '' : 'outside-month'} ${hasEvent ? 'has-event' : ''} ${isSelected ? 'is-selected' : ''}"
              type="button" data-calendar-date="${key}" aria-label="${accessibleDate}${eventNote}"
              aria-pressed="${isSelected}" ${isToday ? 'aria-current="date"' : ''}>
              <span>${date.getDate()}</span>
              ${hasEvent ? '<span class="event-dot" aria-hidden="true"></span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
      <section class="calendar-selection" aria-live="polite" aria-atomic="true">
        <h3>${selectedDateValue.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
        ${selectedEvents.length ? selectedEvents.map(event => `
          <article class="calendar-event">
            <div>
              <span class="editorial-label">${event.category}</span>
              <h4>${event.title}</h4>
              <p>${formatTime(event.start)} · ${event.venue}</p>
            </div>
            <a class="link-btn" href="events.html">Event details</a>
          </article>
        `).join('') : '<p class="calendar-empty">No sample events are scheduled for this date.</p>'}
      </section>
    `;
  };

  if (!root.dataset.bound) {
    root.dataset.bound = 'true';
    root.addEventListener('click', event => {
      const dateButton = event.target.closest('[data-calendar-date]');
      if (dateButton) {
        selectedDate = dateButton.dataset.calendarDate;
        const selectedDateObject = new Date(`${selectedDate}T12:00:00`);
        if (selectedDateObject.getMonth() !== shownMonth.getMonth() || selectedDateObject.getFullYear() !== shownMonth.getFullYear()) {
          shownMonth = new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth(), 1);
        }
        render();
        root.querySelector(`[data-calendar-date="${selectedDate}"]`)?.focus();
        return;
      }

      const monthButton = event.target.closest('[data-month-shift]');
      if (monthButton) {
        const shift = Number(monthButton.dataset.monthShift);
        shownMonth.setMonth(shownMonth.getMonth() + shift);
        selectedDate = '';
        render();
        root.querySelector(`[data-month-shift="${shift}"]`)?.focus();
      }
    });
  }

  render();
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
