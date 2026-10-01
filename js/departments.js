function renderDepartments() {
  const container = document.getElementById('departments-list');
  if (!container) return;

  container.innerHTML = campusData.departments.map(dept => `
    <article class="card department-card">
      <div class="card-body">
        <div class="meta-line">
          <span class="badge-pill">${dept.name.split(' ')[0]}</span>
        </div>
        <h3>${dept.name}</h3>
        <p>${dept.overview}</p>
        <div class="meta-line" style="margin-top: 10px;">
          <span>Labs: ${dept.labs}</span>
        </div>
        <div class="card-actions">
          <span>${dept.events}</span>
          <button class="link-btn dept-open" data-id="${dept.id}">View</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.dept-open').forEach(button => {
    button.addEventListener('click', () => openDepartmentModal(button.dataset.id));
  });
}

function openDepartmentModal(id) {
  const dept = campusData.departments.find(item => item.id === id);
  if (!dept) return;
  const html = `
    <div>
      <h2>${dept.name}</h2>
      <p>${dept.overview}</p>
      <div class="two-col" style="margin-top: 18px;">
        <div class="panel-card"><strong>Labs</strong><p>${dept.labs}</p></div>
        <div class="panel-card"><strong>Events</strong><p>${dept.events}</p></div>
        <div class="panel-card"><strong>Contact</strong><p>${dept.contact}</p></div>
        <div class="panel-card"><strong>Student Activities</strong><p>Hackathons, peer mentoring, club collaborations and department showcases.</p></div>
      </div>
    </div>
  `;
  openModal(html);
}

window.renderDepartments = renderDepartments;
