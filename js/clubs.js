function renderClubs() {
  const container = document.getElementById('clubs-list');
  if (!container) return;

  const memberships = Storage.get(STORAGE_KEYS.memberships, []);
  container.innerHTML = campusData.clubs.map(club => `
    <article class="card club-card">
      <div class="card-body">
        <div class="avatar large" style="width: 56px; height: 56px; margin-bottom: 12px;">${club.logo}</div>
        <div class="meta-line">
          <span class="badge-pill">${club.category}</span>
          <span>${club.members} members</span>
        </div>
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <div class="meta-line" style="margin-top: 12px;">
          <span>📣 ${club.upcoming}</span>
        </div>
        <div class="card-actions">
          <span>${club.contact}</span>
          <button class="btn btn-primary join-club" data-id="${club.id}">${memberships.includes(club.id) ? 'Joined ✓' : 'Join Club'}</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.join-club').forEach(button => {
    button.addEventListener('click', () => {
      const current = Storage.get(STORAGE_KEYS.memberships, []);
      const exists = current.includes(button.dataset.id);
      const next = exists ? current.filter(item => item !== button.dataset.id) : [...current, button.dataset.id];
      Storage.set(STORAGE_KEYS.memberships, next);
      renderClubs();
      showToast(exists ? 'Membership removed.' : 'Club joined successfully.');
    });
  });
}
