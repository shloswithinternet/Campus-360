function renderFacilities() {
  const container = document.getElementById('facilities-list');
  if (!container) return;

  container.innerHTML = campusData.facilities.map(facility => `
    <article class="card facility-card">
      <div class="card-body">
        <div class="meta-line">
          <span class="badge-pill">${facility.location}</span>
          <span>${facility.hours}</span>
        </div>
        <h3>${facility.name}</h3>
        <p>${facility.description}</p>
        <div class="meta-line" style="margin-top: 10px;">
          <span>${facility.features.slice(0, 2).join(' • ')}</span>
        </div>
        <div class="card-actions">
          <span>${facility.name}</span>
          <button class="link-btn facility-open" data-id="${facility.id}">Open</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.facility-open').forEach(button => {
    button.addEventListener('click', () => openFacilityModal(button.dataset.id));
  });
}

function openFacilityModal(id) {
  const facility = campusData.facilities.find(item => item.id === id);
  if (!facility) return;

  const html = `
    <div>
      <h2>${facility.name}</h2>
      <p>${facility.description}</p>
      <div class="two-col" style="margin-top: 18px;">
        <div class="panel-card"><strong>Location</strong><p>${facility.location}</p></div>
        <div class="panel-card"><strong>Hours</strong><p>${facility.hours}</p></div>
      </div>
      <div class="panel-card" style="margin-top: 16px;">
        <strong>Facilities available</strong>
        <p>${facility.features.join(' • ')}</p>
      </div>
    </div>
  `;
  openModal(html);
}

window.renderFacilities = renderFacilities;
