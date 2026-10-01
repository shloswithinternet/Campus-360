function renderEvents() {
  const list = document.getElementById('events-list');
  const filters = Array.from(new Set(['All', ...campusData.events.map(event => event.category)]));
  const filterContainer = document.getElementById('event-filters');
  const queryCategory = new URLSearchParams(window.location.search).get('category');
  const categoryLookup = Object.fromEntries(
    campusData.events.map(event => [event.category.toLowerCase(), event.category])
  );
  const selectedCategory = queryCategory ? (categoryLookup[queryCategory.toLowerCase()] || 'All') : 'All';

  if (filterContainer) {
    filterContainer.innerHTML = filters.map((filter, index) => `
      <button class="chip ${filter === selectedCategory ? 'active' : index === 0 && !queryCategory ? 'active' : ''}" data-event-filter="${filter}">${filter}</button>
    `).join('');

    filterContainer.querySelectorAll('[data-event-filter]').forEach(button => {
      button.addEventListener('click', () => {
        filterContainer.querySelectorAll('[data-event-filter]').forEach(item => item.classList.toggle('active', item === button));
        const selected = button.dataset.eventFilter;
        renderEventsList(selected);
      });
    });
  }

  renderEventsList(selectedCategory);
}

function renderEventsList(selectedCategory = 'All') {
  const list = document.getElementById('events-list');
  const items = selectedCategory === 'All'
    ? campusData.events
    : campusData.events.filter(event => event.category === selectedCategory);

  if (!list) return;

  list.innerHTML = items.length
    ? items.map(event => `
      <article class="card event-card">
        <div class="card-media" style="background: ${event.image};"></div>
        <div class="card-body">
          <div class="meta-line">
            <span class="badge-pill">${event.category}</span>
            <span>${event.date}</span>
          </div>
          <h3>${event.title}</h3>
          <div class="event-meta">
            <span>🕒 ${event.time}</span>
            <span>📍 ${event.venue}</span>
          </div>
          <p>${event.description}</p>
          <div class="row-actions">
            <span class="badge-pill success">${event.seatsAvailable} seats</span>
            <button class="link-btn event-details-btn" data-id="${event.id}">View details</button>
          </div>
          <div class="card-actions">
            <span>${event.organizer}</span>
            <button class="btn btn-primary register-btn" data-id="${event.id}">
              ${isEventRegistered(event.id) ? 'Registered ✓' : 'Register'}
            </button>
          </div>
        </div>
      </article>
    `).join('')
    : '<div class="empty-state">No events found for your selected filters.</div>';

  list.querySelectorAll('.register-btn').forEach(button => {
    button.addEventListener('click', () => toggleEventRegistration(button.dataset.id));
  });

  list.querySelectorAll('.event-details-btn').forEach(button => {
    button.addEventListener('click', () => openEventModal(button.dataset.id));
  });
}

function isEventRegistered(eventId) {
  const registered = Storage.get(STORAGE_KEYS.registeredEvents, []);
  return registered.includes(eventId);
}

function toggleEventRegistration(eventId) {
  const registered = Storage.get(STORAGE_KEYS.registeredEvents, []);
  const hasRegister = registered.includes(eventId);
  const next = hasRegister ? registered.filter(item => item !== eventId) : [...registered, eventId];
  Storage.set(STORAGE_KEYS.registeredEvents, next);
  renderEvents();
  renderProfile();
  showToast(hasRegister ? 'Registration removed.' : 'Event registered successfully.');
}

function openEventModal(eventId) {
  const event = campusData.events.find(item => item.id === eventId);
  if (!event) return;

  const html = `
    <div class="event-modal-detail">
      <div class="card-media modal-hero" style="background: ${event.image}; height: 220px; border-radius: 16px; margin-bottom: 18px;"></div>
      <div class="meta-line">
        <span class="badge-pill">${event.category}</span>
        <span>${event.date}</span>
      </div>
      <h2>${event.title}</h2>
      <div class="meta-line">
        <span>Organizer: ${event.organizer}</span>
        <span>•</span>
        <span>Venue: ${event.venue}</span>
      </div>
      <div class="two-col" style="margin-top: 18px;">
        <div class="panel-card info-block">
          <strong>Date</strong>
          <p>${event.date}</p>
        </div>
        <div class="panel-card info-block">
          <strong>Time</strong>
          <p>${event.time}</p>
        </div>
        <div class="panel-card info-block">
          <strong>Seats Available</strong>
          <p>${event.seatsAvailable}</p>
        </div>
        <div class="panel-card info-block">
          <strong>Deadline</strong>
          <p>${event.registrationDeadline}</p>
        </div>
      </div>
      <p style="margin-top: 18px;">${event.description}</p>
      <p><strong>Eligibility:</strong> ${event.eligibility}</p>
      <p><strong>Contact:</strong> ${event.contact}</p>
      <div class="card-actions" style="margin-top: 18px;">
        <button class="btn btn-secondary" type="button">Add to Calendar</button>
        <button class="btn btn-primary register-btn" data-id="${event.id}">
          ${isEventRegistered(event.id) ? 'Registered ✓' : 'Register'}
        </button>
      </div>
    </div>
  `;

  openModal(html);

  const runRegister = document.querySelector('.register-btn[data-id]');
  if (runRegister) {
    runRegister.addEventListener('click', () => toggleEventRegistration(eventId));
  }
}
