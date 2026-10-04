const mapLocations = [
  { id: 'main-gate', name: 'Main Gate', x: 70, y: 90, type: 'Entrance' },
  { id: 'admin', name: 'Administration Building', x: 120, y: 230, type: 'Admin' },
  { id: 'library', name: 'Library', x: 250, y: 200, type: 'Library' },
  { id: 'seminar', name: 'Seminar Hall', x: 370, y: 190, type: 'Seminar' },
  { id: 'labs', name: 'Computer Labs', x: 270, y: 360, type: 'Labs' },
  { id: 'aiml', name: 'AI & ML Department', x: 510, y: 220, type: 'Department' },
  { id: 'canteen', name: 'Canteen', x: 440, y: 390, type: 'Dining' },
  { id: 'sports', name: 'Sports Ground', x: 610, y: 355, type: 'Sports' },
  { id: 'parking', name: 'Parking', x: 120, y: 420, type: 'Parking' },
  { id: 'medical', name: 'Medical Room', x: 510, y: 470, type: 'Medical' },
  { id: 'security', name: 'Security Office', x: 340, y: 470, type: 'Security' }
];

function renderMap() {
  const mount = document.getElementById('campus-map');
  const fromSelect = document.getElementById('map-from');
  const toSelect = document.getElementById('map-to');
  if (!mount) return;

  mount.innerHTML = `
    <svg viewBox="0 0 760 520" role="img" aria-label="Campus map">
      <rect x="50" y="40" width="660" height="440" rx="30" fill="rgba(148,163,184,0.05)" stroke="rgba(37,99,235,0.18)"/>
      <path d="M120 90 L140 90 L140 250 L230 250 L230 200 L300 200 L300 180 L520 180 L520 250 L650 250 L650 360 L500 360 L500 400 L360 400 L360 450 L160 450 L160 410 L120 410 Z" fill="rgba(59,130,246,0.08)" stroke="rgba(37,99,235,0.18)"/>
      <path id="route-path" d="" fill="none" stroke="var(--primary)" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 12" opacity="0.9"/>
      ${mapLocations.map(point => `
        <g class="location-node" data-location="${point.id}" tabindex="0">
          <rect x="${point.x - 40}" y="${point.y - 14}" width="80" height="32" rx="16"></rect>
          <text class="location-label" x="${point.x}" y="${point.y + 6}" text-anchor="middle">${point.name.split(' ')[0]}</text>
        </g>
      `).join('')}
    </svg>
  `;

  fromSelect.innerHTML = mapLocations.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
  toSelect.innerHTML = mapLocations.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
  const locationSuggestions = document.getElementById('map-locations');
  if (locationSuggestions) {
    locationSuggestions.innerHTML = mapLocations.map(item => `<option value="${item.name}"></option>`).join('');
  }
  fromSelect.value = 'main-gate';
  toSelect.value = 'library';

  mount.querySelectorAll('.location-node').forEach(node => {
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', `Show ${mapLocations.find(item => item.id === node.dataset.location)?.name || 'location'} details`);
    node.addEventListener('click', () => {
      const id = node.dataset.location;
      const location = mapLocations.find(item => item.id === id);
      if (!location) return;
      showLocationInfo(location);
    });
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
  });

  document.getElementById('show-route-btn')?.addEventListener('click', () => {
    const from = fromSelect.value;
    const to = toSelect.value;
    renderRoute(from, to);
  });

  document.getElementById('map-search-btn')?.addEventListener('click', searchMapLocation);
  document.getElementById('map-search')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchMapLocation();
    }
  });

  renderRoute('main-gate', 'library');
}

function searchMapLocation() {
  const input = document.getElementById('map-search');
  const query = input?.value.trim().toLowerCase();
  if (!query) return;

  const location = mapLocations.find(item => item.name.toLowerCase() === query)
    || mapLocations.find(item => item.name.toLowerCase().includes(query));
  if (!location) {
    showToast('No campus location matches that search.');
    return;
  }

  const toSelect = document.getElementById('map-to');
  if (toSelect) toSelect.value = location.id;
  renderRoute(document.getElementById('map-from')?.value || 'main-gate', location.id);
}

function renderRoute(fromId, toId) {
  const routePath = document.getElementById('route-path');
  if (!routePath) return;
  const from = mapLocations.find(item => item.id === fromId) || mapLocations[0];
  const to = mapLocations.find(item => item.id === toId) || mapLocations[1];
  const controlX = (from.x + to.x) / 2;
  routePath.setAttribute('d', `M ${from.x} ${from.y} Q ${controlX} ${Math.min(from.y, to.y) - 30}, ${to.x} ${to.y}`);
  routePath.setAttribute('stroke', 'var(--primary)');
  const locationNodes = document.querySelectorAll('.location-node');
  locationNodes.forEach(node => {
    const label = node.dataset.location;
    node.classList.toggle('active', label === fromId || label === toId);
  });
  showLocationInfo(to);
}

function showLocationInfo(location) {
  const info = `
    <div class="panel-card" style="margin-top: 12px;">
      <div class="meta-line"><span class="badge-pill success">${location.type}</span></div>
      <h3>${location.name}</h3>
      <p>Quick access point on the campus map. The route is highlighted to help visitors move efficiently around the campus.</p>
      <div class="card-actions"><span>Selected destination</span><button class="btn btn-primary" type="button" data-route-to="${location.id}">Use as destination</button></div>
    </div>
  `;
  const panel = document.querySelector('.map-shell');
  if (!panel) return;
  let box = panel.querySelector('.location-info-box');
  if (!box) {
    box = document.createElement('div');
    box.className = 'location-info-box';
    panel.appendChild(box);
  }
  box.innerHTML = info;
  box.querySelector('[data-route-to]')?.addEventListener('click', () => {
    const toSelect = document.getElementById('map-to');
    if (!toSelect) return;
    toSelect.value = location.id;
    renderRoute(document.getElementById('map-from')?.value || 'main-gate', location.id);
  });
}
