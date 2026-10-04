/**
 * Campus 360 - Events Module (Magic Patterns Editorial Architecture)
 * Integrates collegiate broadsheet layout, 14-day date-strip, sticky agenda,
 * interactive slide-over drawer, and unified LocalStorage registration.
 */

const EVENT_CONFIG = {
  programmeStart: '2026-10-05',
  programmeDays: 14,
  todayKey: '2026-10-04',
  categories: ['Lectures', 'Arts', 'Music', 'Sport', 'Careers', 'Tech', 'Community'],
  formats: ['In person', 'Hybrid', 'Online']
};

const eventState = {
  category: 'All',
  format: 'Any',
  query: '',
  openOnly: false,
  date: null,
  openId: null,
  showTickets: false
};

// ==========================================
// DATE & FORMATTING UTILITIES (Vanilla JS)
// ==========================================

function padZero(num) {
  return num < 10 ? '0' + num : '' + num;
}

function parseISODate(iso) {
  if (!iso) return new Date();
  if (iso.includes('T')) {
    const [dPart, tPart] = iso.split('T');
    const [y, m, d] = dPart.split('-').map(Number);
    const [hh, mm] = tPart.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm || 0);
  }
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dayKey(iso) {
  const d = parseISODate(iso);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

function formatTime(iso) {
  const d = parseISODate(iso);
  return `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
}

function formatShortDay(iso) {
  const d = parseISODate(iso);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatLongDay(iso) {
  const d = parseISODate(iso);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatRange(startIso, endIso) {
  const s = parseISODate(startIso);
  const e = parseISODate(endIso);
  const sameDay = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate();
  if (sameDay) {
    return `${formatShortDay(startIso)}, ${formatTime(startIso)}–${formatTime(endIso)}`;
  }
  return `${formatShortDay(startIso)}, ${formatTime(startIso)} – ${formatShortDay(endIso)}, ${formatTime(endIso)}`;
}

function buildDays(startKey, count) {
  const res = [];
  const [y, m, d] = startKey.split('-').map(Number);
  const cur = new Date(y, m - 1, d);
  for (let i = 0; i < count; i++) {
    res.push(`${cur.getFullYear()}-${padZero(cur.getMonth() + 1)}-${padZero(cur.getDate())}`);
    cur.setDate(cur.getDate() + 1);
  }
  return res;
}

function relativeDayLabel(key, todayKey) {
  const [y1, m1, d1] = key.split('-').map(Number);
  const [y2, m2, d2] = todayKey.split('-').map(Number);
  const dt1 = new Date(y1, m1 - 1, d1);
  const dt2 = new Date(y2, m2 - 1, d2);
  const diff = Math.round((dt1 - dt2) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return null;
}

function resolveAssetPath(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('linear-gradient')) {
    return src;
  }
  const isNested = window.location.pathname.includes('/pages/');
  if (isNested) {
    if (src.startsWith('assets/')) return '../' + src;
    if (src.startsWith('/')) return '..' + src;
  }
  return src;
}

// ==========================================
// REGISTRATION & CAPACITY HELPERS
// ==========================================

function getRegisteredEvents() {
  if (typeof Storage !== 'undefined' && typeof STORAGE_KEYS !== 'undefined') {
    return Storage.get(STORAGE_KEYS.registeredEvents, []);
  }
  return [];
}

function isEventRegistered(eventId) {
  return getRegisteredEvents().includes(eventId);
}

function getWaitlistedEvents() {
  if (typeof Storage !== 'undefined') {
    return Storage.get('campus360-waitlisted-events', []);
  }
  return [];
}

function isEventWaitlisted(eventId) {
  return getWaitlistedEvents().includes(eventId);
}

function spotsLeft(event) {
  const isReg = isEventRegistered(event.id);
  const taken = (event.registered || 0) + (isReg ? 1 : 0);
  return Math.max(0, (event.capacity || 100) - taken);
}

function isFull(event) {
  return spotsLeft(event) === 0;
}

function availabilityLabel(event) {
  const isReg = isEventRegistered(event.id);
  if (isReg) {
    return { text: "You're registered", urgent: false };
  }
  const left = spotsLeft(event);
  if (left === 0) {
    return { text: 'Full — waitlist open', urgent: true };
  }
  if (left / (event.capacity || 100) <= 0.1) {
    return { text: `Almost full · ${left} left`, urgent: true };
  }
  return { text: `${left} spots left`, urgent: false };
}

function toggleEventRegistration(eventId, forceWaitlist = false) {
  const registered = getRegisteredEvents();
  const waitlisted = getWaitlistedEvents();
  const event = campusData.events.find(e => e.id === eventId);
  const isReg = registered.includes(eventId);
  const isWait = waitlisted.includes(eventId);

  if (isReg) {
    // Cancel registration
    const next = registered.filter(id => id !== eventId);
    Storage.set(STORAGE_KEYS.registeredEvents, next);
    if (typeof showToast === 'function') showToast(`Cancelled registration for "${event ? event.title : 'event'}".`);
  } else if (isWait) {
    // Leave waitlist
    const nextWait = waitlisted.filter(id => id !== eventId);
    Storage.set('campus360-waitlisted-events', nextWait);
    if (typeof showToast === 'function') showToast(`Removed from waitlist for "${event ? event.title : 'event'}".`);
  } else {
    // New registration or waitlist
    const full = event ? isFull(event) : false;
    if (full || forceWaitlist) {
      Storage.set('campus360-waitlisted-events', [...waitlisted, eventId]);
      if (typeof showToast === 'function') showToast(`Added to waitlist for "${event ? event.title : 'event'}".`);
    } else {
      Storage.set(STORAGE_KEYS.registeredEvents, [...registered, eventId]);
      if (typeof showToast === 'function') showToast(`Registered successfully! Your ticket is in Campus 360.`);
    }
  }

  updateTicketBadge();
  renderEvents();

  if (eventState.openId === eventId) {
    renderEventDrawer(event);
  }
  if (eventState.showTickets) {
    renderTicketsDrawer();
  }
}

function updateTicketBadge() {
  const count = getRegisteredEvents().length;
  const badge = document.getElementById('ticket-badge');
  if (badge) {
    badge.textContent = count;
  }
}

// ==========================================
// RENDER BUTTON HELPER
// ==========================================

function renderRegisterButton(event, size = 'sm') {
  const isReg = isEventRegistered(event.id);
  const isWait = isEventWaitlisted(event.id);
  const full = isFull(event);
  const sizeClass = size === 'lg' ? 'magic-btn-lg' : '';

  if (isReg) {
    return `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="magic-btn magic-btn-registered ${sizeClass}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          You're going
        </span>
        <button type="button" class="magic-cancel-link" data-cancel-event="${event.id}">Cancel</button>
      </div>
    `;
  }

  if (isWait) {
    return `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="magic-btn magic-btn-registered ${sizeClass}">On waitlist</span>
        <button type="button" class="magic-cancel-link" data-cancel-event="${event.id}">Leave</button>
      </div>
    `;
  }

  if (full) {
    return `
      <button type="button" class="magic-btn magic-btn-outline ${sizeClass}" data-register-event="${event.id}" data-waitlist="true">
        Join waitlist
      </button>
    `;
  }

  const label = event.price === 'Free' ? 'Register' : `Book · ${event.price}`;
  return `
    <button type="button" class="magic-btn ${sizeClass}" data-register-event="${event.id}">
      ${label}
    </button>
  `;
}

// ==========================================
// COMPONENT RENDERERS
// ==========================================

function renderMasthead() {
  const container = document.getElementById('events-masthead');
  if (!container) return;

  const events = campusData.events || [];
  const eventCount = events.length;
  const venues = new Set(events.map(e => e.venue)).size;

  container.innerHTML = `
    <div class="masthead-inner">
      <h1 class="masthead-title">
        What's on <em class="text-accent">this fortnight</em>
      </h1>
      <div class="masthead-meta">
        <strong>5 – 18 October 2026 · Autumn term, weeks 6 & 7</strong>
        <p style="margin: 0; color: var(--muted);">
          ${eventCount} events across ${venues} venues. Register once and your ticket lives in Campus 360 — no printing, no queues.
        </p>
      </div>
    </div>
  `;
}

function renderFeaturedSpread() {
  const container = document.getElementById('featured-spread');
  if (!container) return;

  const events = campusData.events || [];
  const featured = events.filter(e => e.featured);
  const lead = featured[0] || events[0];
  const secondary = featured.slice(1, 3);

  if (!lead) {
    container.innerHTML = '';
    return;
  }

  const leadAvail = availabilityLabel(lead);

  container.innerHTML = `
    <article class="featured-lead">
      <button type="button" class="lead-image-btn" data-open-event="${lead.id}" aria-label="View details for ${lead.title}">
        <img src="${resolveAssetPath(lead.image)}" alt="${lead.title}" />
      </button>
      <div class="featured-lead-body">
        <div class="featured-lead-content">
          <div class="tag-line">
            <span class="font-medium text-accent">${lead.category}</span>
            <span style="color: var(--rule);">/</span>
            <span class="text-muted">${formatRange(lead.start, lead.end)}</span>
          </div>
          <h2>
            <button type="button" data-open-event="${lead.id}">${lead.title}</button>
          </h2>
          <p class="lead-summary">${lead.summary || lead.description}</p>
          <div class="lead-submeta">
            ${lead.venue} · ${lead.format} · <span class="${leadAvail.urgent ? 'text-accent font-medium' : 'text-muted'}">${leadAvail.text}</span>
          </div>
        </div>
        <div>
          ${renderRegisterButton(lead, 'lg')}
        </div>
      </div>
    </article>

    <div class="featured-secondary-stack">
      ${secondary.map(event => {
        const avail = availabilityLabel(event);
        return `
          <article class="featured-secondary-item" key="${event.id}">
            <button type="button" class="secondary-image-btn" data-open-event="${event.id}" aria-label="View details for ${event.title}">
              <img src="${resolveAssetPath(event.image)}" alt="${event.title}" />
            </button>
            <div class="item-tag-line">
              <span class="font-medium text-accent">${event.category}</span>
              <span style="color: var(--rule);">/</span>
              <span class="text-muted">${formatRange(event.start, event.end)}</span>
            </div>
            <h3>
              <button type="button" data-open-event="${event.id}">
                <span>${event.title}</span>
                <span aria-hidden="true" style="font-size: 18px; line-height: 1;">↗</span>
              </button>
            </h3>
            <div class="item-footer">
              <span class="text-sm ${avail.urgent ? 'text-accent font-medium' : 'text-muted'}">${avail.text}</span>
              ${renderRegisterButton(event, 'sm')}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderFilterBar(filteredCount, isFiltered) {
  const countWrap = document.getElementById('agenda-count-wrap');
  if (countWrap) {
    countWrap.innerHTML = `
      ${filteredCount} event${filteredCount === 1 ? '' : 's'}
      ${isFiltered ? ` · <button type="button" class="clear-filters-btn" id="clear-all-filters">Clear all</button>` : ''}
    `;
  }

  const row = document.getElementById('agenda-filter-row');
  if (!row) return;

  const categories = ['All', ...EVENT_CONFIG.categories];

  row.innerHTML = `
    <div class="filter-category-tabs" role="group" aria-label="Filter by category">
      ${categories.map(cat => `
        <button type="button" class="filter-tab-pill ${eventState.category === cat ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('')}
    </div>

    <div class="agenda-search-controls">
      <div class="agenda-search-input-wrap">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input type="search" id="agenda-search-input" placeholder="Search events, hosts, venues" value="${eventState.query}" />
        ${eventState.query ? `<button type="button" class="search-clear-btn" id="agenda-search-clear" aria-label="Clear search">×</button>` : ''}
      </div>

      <div class="format-select-wrap">
        <select id="agenda-format-select" aria-label="Filter by format">
          <option value="Any" ${eventState.format === 'Any' ? 'selected' : ''}>Any format</option>
          ${EVENT_CONFIG.formats.map(fmt => `
            <option value="${fmt}" ${eventState.format === fmt ? 'selected' : ''}>${fmt}</option>
          `).join('')}
        </select>
      </div>

      <label class="spots-toggle-label">
        <button type="button" role="switch" class="toggle-switch-btn ${eventState.openOnly ? 'active' : ''}" id="spots-toggle-btn" aria-checked="${eventState.openOnly}">
          <span class="toggle-switch-knob"></span>
        </button>
        <span>Spots available</span>
      </label>
    </div>
  `;
}

function renderDateStrip(events) {
  const container = document.getElementById('date-strip-container');
  if (!container) return;

  const days = buildDays(EVENT_CONFIG.programmeStart, EVENT_CONFIG.programmeDays);
  const counts = {};
  days.forEach(d => { counts[d] = 0; });

  events.forEach(e => {
    const k = dayKey(e.start);
    if (counts[k] !== undefined) counts[k]++;
  });

  const week1 = days.slice(0, 7);
  const week2 = days.slice(7, 14);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  container.innerHTML = `
    <button type="button" class="date-strip-all-btn ${eventState.date === null ? 'active' : ''}" data-date-select="all">
      <span class="num">All</span>
      <span class="sub">14 days</span>
    </button>

    <div class="date-week-block">
      <div class="date-week-header">Week 6</div>
      <div class="date-week-days">
        ${week1.map(k => {
          const d = parseISODate(k);
          const count = counts[k] || 0;
          const isSelected = eventState.date === k;
          const empty = count === 0;
          return `
            <button type="button" class="date-day-btn ${isSelected ? 'active' : ''}" ${empty ? 'disabled' : ''} data-date-select="${k}" aria-label="${formatLongDay(k)}, ${count} events">
              <span class="day-name">${weekdays[d.getDay()]}</span>
              <span class="day-num">${d.getDate()}</span>
              <span class="day-dots" aria-hidden="true">
                ${Array.from({ length: Math.min(count, 4) }).map(() => `<span class="day-dot"></span>`).join('')}
              </span>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <div class="date-week-block">
      <div class="date-week-header">Week 7</div>
      <div class="date-week-days">
        ${week2.map(k => {
          const d = parseISODate(k);
          const count = counts[k] || 0;
          const isSelected = eventState.date === k;
          const empty = count === 0;
          return `
            <button type="button" class="date-day-btn ${isSelected ? 'active' : ''}" ${empty ? 'disabled' : ''} data-date-select="${k}" aria-label="${formatLongDay(k)}, ${count} events">
              <span class="day-name">${weekdays[d.getDay()]}</span>
              <span class="day-num">${d.getDate()}</span>
              <span class="day-dots" aria-hidden="true">
                ${Array.from({ length: Math.min(count, 4) }).map(() => `<span class="day-dot"></span>`).join('')}
              </span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderAgendaTimeline(filteredEvents) {
  const container = document.getElementById('agenda-timeline');
  if (!container) return;

  if (filteredEvents.length === 0) {
    container.innerHTML = `
      <div class="agenda-empty-state">
        <p class="title">Nothing matches those filters.</p>
        <p class="sub">Try another day or widen your search criteria.</p>
        <button type="button" class="magic-btn magic-btn-outline" id="reset-agenda-filters">Reset filters</button>
      </div>
    `;
    return;
  }

  // Group events by dayKey(start)
  const grouped = {};
  filteredEvents.forEach(e => {
    const k = dayKey(e.start);
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(e);
  });

  const sortedKeys = Object.keys(grouped).sort();

  container.innerHTML = sortedKeys.map(k => {
    const d = parseISODate(k);
    const rel = relativeDayLabel(k, EVENT_CONFIG.todayKey);
    const dayEvents = grouped[k];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return `
      <section class="agenda-group" aria-label="${formatLongDay(k)}">
        <header class="agenda-day-sticky">
          <p class="day-huge">${d.getDate()}</p>
          <div class="day-info">
            <p class="day-weekday">${weekdays[d.getDay()]}</p>
            <p class="day-month">
              ${months[d.getMonth()]}
              ${rel ? `<span class="day-rel"> · ${rel}</span>` : ''}
            </p>
          </div>
        </header>

        <ol class="agenda-events-list">
          ${dayEvents.map(event => {
            const avail = availabilityLabel(event);
            return `
              <li class="event-row">
                <div class="row-time">
                  <p class="time-start">${formatTime(event.start)}</p>
                  <p class="time-end">${formatTime(event.end)}</p>
                </div>

                <div class="row-body">
                  <div class="row-tags">
                    <span class="category-tag">${event.category}</span>
                    ${event.format !== 'In person' ? `<span class="format-tag"> · ${event.format}</span>` : ''}
                  </div>
                  <h3>
                    <button type="button" data-open-event="${event.id}">${event.title}</button>
                  </h3>
                  <p class="row-meta">${event.host || event.organizer} · ${event.venue}</p>
                </div>

                <div class="row-actions-right">
                  <div class="row-price-block">
                    <p class="price">${event.price}</p>
                    <p class="availability ${avail.urgent ? 'urgent' : ''}">${avail.text}</p>
                  </div>
                  <div>
                    ${renderRegisterButton(event, 'sm')}
                  </div>
                </div>
              </li>
            `;
          }).join('')}
        </ol>
      </section>
    `;
  }).join('');
}

// ==========================================
// EVENT DETAIL DRAWER & TICKETS MODAL
// ==========================================

function openEventDrawer(eventId) {
  const event = campusData.events.find(e => e.id === eventId);
  if (!event) return;
  eventState.openId = eventId;

  const overlay = document.getElementById('event-drawer');
  if (!overlay) return;

  renderEventDrawer(event);
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = overlay.querySelector('.drawer-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeEventDrawer() {
  eventState.openId = null;
  const overlay = document.getElementById('event-drawer');
  if (!overlay) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderEventDrawer(event) {
  const panel = document.getElementById('event-drawer-panel');
  if (!panel) return;

  const avail = availabilityLabel(event);
  const left = spotsLeft(event);
  const pct = Math.min(100, Math.round(((event.capacity - left) / event.capacity) * 100));

  panel.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-category">
        <span class="font-medium text-accent">${event.category}</span>
        <span class="text-muted"> · ${event.format}</span>
      </div>
      <button type="button" class="drawer-close-btn" id="drawer-close-trigger" aria-label="Close details">×</button>
    </div>

    <div class="drawer-scroll-body">
      ${event.image && !event.image.startsWith('linear-gradient') ? `
        <img src="${resolveAssetPath(event.image)}" alt="${event.title}" class="drawer-hero-img" />
      ` : ''}
      <div class="drawer-content">
        <h2 id="drawer-title">${event.title}</h2>
        <p class="drawer-host">Hosted by ${event.host || event.organizer}</p>

        <dl class="drawer-details-list">
          <div class="drawer-details-item">
            <dt>When</dt>
            <dd>${formatRange(event.start, event.end)}</dd>
          </div>
          <div class="drawer-details-item">
            <dt>Where</dt>
            <dd>${event.venue}</dd>
          </div>
          <div class="drawer-details-item">
            <dt>Capacity</dt>
            <dd>
              <span class="${avail.urgent ? 'text-accent font-medium' : ''}">${avail.text}</span>
              <div class="drawer-capacity-bar" role="progressbar" aria-valuenow="${event.capacity - left}" aria-valuemin="0" aria-valuemax="${event.capacity}">
                <div class="drawer-capacity-fill ${avail.urgent ? 'urgent' : ''}" style="width: ${pct}%;"></div>
              </div>
              <p style="margin: 6px 0 0; font-size: 12px; color: var(--muted);">${event.capacity - left} of ${event.capacity} taken</p>
            </dd>
          </div>
          ${event.eligibility ? `
            <div class="drawer-details-item">
              <dt>Eligibility</dt>
              <dd>${event.eligibility}</dd>
            </div>
          ` : ''}
          ${event.contact ? `
            <div class="drawer-details-item">
              <dt>Contact</dt>
              <dd>${event.contact}</dd>
            </div>
          ` : ''}
        </dl>

        <p style="font-size: 15px; line-height: 1.6; color: var(--text);">${event.summary || event.description}</p>
      </div>
    </div>

    <div class="drawer-footer">
      <div>
        <p class="price-display">${event.price}</p>
        <p class="id-note">Student ID required at entry</p>
      </div>
      <div>
        ${renderRegisterButton(event, 'lg')}
      </div>
    </div>
  `;
}

function openTicketsDrawer() {
  eventState.showTickets = true;
  const overlay = document.getElementById('tickets-drawer');
  if (!overlay) return;

  renderTicketsDrawer();
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTicketsDrawer() {
  eventState.showTickets = false;
  const overlay = document.getElementById('tickets-drawer');
  if (!overlay) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderTicketsDrawer() {
  const panel = document.getElementById('tickets-drawer-panel');
  if (!panel) return;

  const registeredIds = getRegisteredEvents();
  const waitlistedIds = getWaitlistedEvents();
  const regEvents = campusData.events.filter(e => registeredIds.includes(e.id));
  const waitEvents = campusData.events.filter(e => waitlistedIds.includes(e.id));

  panel.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-category">
        <span class="font-display text-xl">My Tickets</span>
        <span class="text-muted"> · ${regEvents.length} registered</span>
      </div>
      <button type="button" class="drawer-close-btn" id="tickets-close-trigger" aria-label="Close tickets">×</button>
    </div>

    <div class="drawer-scroll-body" style="padding: 24px;">
      ${regEvents.length === 0 && waitEvents.length === 0 ? `
        <div style="text-align: center; padding: 60px 0;">
          <p class="font-display" style="font-size: 28px; margin: 0 0 8px;">No tickets yet</p>
          <p style="color: var(--muted); font-size: 14px;">Browse upcoming events on the agenda and register in one click.</p>
        </div>
      ` : `
        ${regEvents.length > 0 ? `
          <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 16px;">
            Confirmed Tickets (${regEvents.length})
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
            ${regEvents.map(event => `
              <div style="border: 1px solid var(--rule); border-radius: 8px; padding: 18px; background: var(--card);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                  <div>
                    <span class="font-medium text-accent" style="font-size: 13px;">${event.category}</span>
                    <h4 class="font-display" style="font-size: 22px; margin: 4px 0 8px; line-height: 1.1;">${event.title}</h4>
                    <p style="font-size: 13px; color: var(--muted); margin: 0 0 4px;">📅 ${formatRange(event.start, event.end)}</p>
                    <p style="font-size: 13px; color: var(--muted); margin: 0;">📍 ${event.venue}</p>
                  </div>
                  <span style="font-size: 24px; padding: 6px; background: var(--paper); border-radius: 4px; border: 1px dashed var(--rule);" title="Digital Pass">🎟️</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--rule);">
                  <span style="font-size: 12px; color: var(--muted);">Pass #C360-${event.id.toUpperCase()}</span>
                  <button type="button" class="magic-cancel-link" data-cancel-event="${event.id}">Cancel Ticket</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${waitEvents.length > 0 ? `
          <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 16px;">
            Waitlist Entries (${waitEvents.length})
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${waitEvents.map(event => `
              <div style="border: 1px solid var(--rule); border-radius: 8px; padding: 18px; background: var(--card);">
                <span class="font-medium text-muted" style="font-size: 13px;">${event.category}</span>
                <h4 class="font-display" style="font-size: 22px; margin: 4px 0 8px; line-height: 1.1;">${event.title}</h4>
                <p style="font-size: 13px; color: var(--muted); margin: 0 0 12px;">📅 ${formatRange(event.start, event.end)} · ${event.venue}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: var(--accent); font-weight: 500;">Status: On Waitlist</span>
                  <button type="button" class="magic-cancel-link" data-cancel-event="${event.id}">Leave Waitlist</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `}
    </div>
  `;
}

// ==========================================
// MAIN CONTROLLER & FILTER ENGINE
// ==========================================

function filterEvents() {
  const allEvents = campusData.events || [];
  return allEvents.filter(event => {
    // Category match
    if (eventState.category !== 'All' && event.category.toLowerCase() !== eventState.category.toLowerCase()) {
      return false;
    }
    // Format match
    if (eventState.format !== 'Any' && event.format !== eventState.format) {
      return false;
    }
    // Spots available toggle
    if (eventState.openOnly && isFull(event)) {
      return false;
    }
    // Date strip match
    if (eventState.date !== null && dayKey(event.start) !== eventState.date) {
      return false;
    }
    // Search query match
    if (eventState.query.trim()) {
      const q = eventState.query.toLowerCase().trim();
      const matchTitle = (event.title || '').toLowerCase().includes(q);
      const matchHost = (event.host || event.organizer || '').toLowerCase().includes(q);
      const matchVenue = (event.venue || '').toLowerCase().includes(q);
      const matchSummary = (event.summary || event.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchHost && !matchVenue && !matchSummary) {
        return false;
      }
    }
    return true;
  });
}

function renderEvents() {
  const isEventsPage = document.getElementById('events-page-main');

  if (isEventsPage) {
    const allEvents = campusData.events || [];
    const filtered = filterEvents();
    const isFiltered = eventState.category !== 'All' ||
                       eventState.format !== 'Any' ||
                       eventState.query !== '' ||
                       eventState.openOnly ||
                       eventState.date !== null;

    renderMasthead();
    renderFeaturedSpread();
    renderFilterBar(filtered.length, isFiltered);
    renderDateStrip(allEvents);
    renderAgendaTimeline(filtered);
    updateTicketBadge();
    return;
  }

  // Fallback: If on Homepage (index.html), render upcoming events cards
  const list = document.getElementById('events-list');
  if (list) {
    const events = (campusData.events || []).slice(0, 3);
    list.innerHTML = events.map(event => {
      const avail = availabilityLabel(event);
      return `
        <article class="card event-card" style="border: 1px solid var(--rule); background: var(--card); border-radius: 4px; overflow: hidden;">
          ${event.image && !event.image.startsWith('linear-gradient') ? `
            <div style="aspect-ratio: 16/9; overflow: hidden; background: var(--card-alt);">
              <img src="${resolveAssetPath(event.image)}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          ` : ''}
          <div class="card-body" style="padding: 20px;">
            <div style="font-size: 13px; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="font-medium text-accent">${event.category}</span>
              <span style="color: var(--rule);">/</span>
              <span class="text-muted">${formatRange(event.start, event.end)}</span>
            </div>
            <h3 class="font-display" style="font-size: 24px; line-height: 1.1; margin: 0 0 8px;">
              <a href="pages/events.html" style="color: var(--ink); text-decoration: none;">${event.title}</a>
            </h3>
            <p style="font-size: 14px; color: var(--muted); margin: 0 0 16px;">${event.venue} · ${event.format}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--rule);">
              <span style="font-size: 13px;" class="${avail.urgent ? 'text-accent font-medium' : 'text-muted'}">${avail.text}</span>
              ${renderRegisterButton(event, 'sm')}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

// ==========================================
// DOCUMENT-LEVEL EVENT DELEGATION
// ==========================================

document.addEventListener('click', (e) => {
  // Category tabs
  const catBtn = e.target.closest('[data-category]');
  if (catBtn) {
    eventState.category = catBtn.dataset.category;
    renderEvents();
    return;
  }

  // Date strip select
  const dateBtn = e.target.closest('[data-date-select]');
  if (dateBtn) {
    const val = dateBtn.dataset.dateSelect;
    eventState.date = val === 'all' || eventState.date === val ? null : val;
    renderEvents();
    return;
  }

  // Clear all filters
  if (e.target.closest('#clear-all-filters') || e.target.closest('#reset-agenda-filters')) {
    eventState.category = 'All';
    eventState.format = 'Any';
    eventState.query = '';
    eventState.openOnly = false;
    eventState.date = null;
    renderEvents();
    return;
  }

  // Spots available toggle
  const toggleBtn = e.target.closest('#spots-toggle-btn') || e.target.closest('.spots-toggle-label');
  if (toggleBtn) {
    eventState.openOnly = !eventState.openOnly;
    renderEvents();
    return;
  }

  // Open event drawer
  const openBtn = e.target.closest('[data-open-event]');
  if (openBtn) {
    e.preventDefault();
    openEventDrawer(openBtn.dataset.openEvent);
    return;
  }

  // Close event drawer
  if (e.target.closest('#drawer-close-trigger') || (e.target.id === 'event-drawer')) {
    closeEventDrawer();
    return;
  }

  // Close tickets drawer
  if (e.target.closest('#tickets-close-trigger') || (e.target.id === 'tickets-drawer')) {
    closeTicketsDrawer();
    return;
  }

  // Register button clicked
  const regBtn = e.target.closest('[data-register-event]');
  if (regBtn) {
    e.stopPropagation();
    const id = regBtn.dataset.registerEvent;
    const isWaitlist = regBtn.dataset.waitlist === 'true';
    toggleEventRegistration(id, isWaitlist);
    return;
  }

  // Cancel registration link clicked
  const cancelBtn = e.target.closest('[data-cancel-event]');
  if (cancelBtn) {
    e.stopPropagation();
    const id = cancelBtn.dataset.cancelEvent;
    toggleEventRegistration(id);
    return;
  }

  // Clear search input
  if (e.target.closest('#agenda-search-clear')) {
    eventState.query = '';
    renderEvents();
    return;
  }

  // My tickets button clicked in header
  if (e.target.closest('#tickets-button')) {
    e.preventDefault();
    openTicketsDrawer();
    return;
  }
});

// Format selector change
document.addEventListener('change', (e) => {
  if (e.target.id === 'agenda-format-select') {
    eventState.format = e.target.value;
    renderEvents();
  }
});

// Search input
document.addEventListener('input', (e) => {
  if (e.target.id === 'agenda-search-input') {
    eventState.query = e.target.value;
    renderEvents();
  }
});

// Keyboard navigation (Escape closes drawer)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (eventState.openId) closeEventDrawer();
    if (eventState.showTickets) closeTicketsDrawer();
  }
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Check URL query parameters (e.g. ?category=tech or #tickets)
  const urlParams = new URLSearchParams(window.location.search);
  const qCategory = urlParams.get('category');
  if (qCategory) {
    const matched = EVENT_CONFIG.categories.find(c => c.toLowerCase() === qCategory.toLowerCase());
    if (matched) eventState.category = matched;
  }

  if (window.location.hash === '#tickets') {
    openTicketsDrawer();
  }

  renderEvents();
});
