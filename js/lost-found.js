function renderLostFound() {
  const list = document.getElementById('lost-found-list');
  if (!list) return;

  const items = Storage.get(STORAGE_KEYS.lostFoundEntries, campusData.lostFound);
  list.innerHTML = items.length ? items.map(item => `
    <article class="card">
      <div class="card-body">
        <div class="meta-line">
          <span class="badge-pill ${item.status === 'Lost' ? 'danger' : 'success'}">${item.status}</span>
          <span>${item.category}</span>
        </div>
        <h3>${item.itemName}</h3>
        <p>${item.description}</p>
        <div class="meta-line" style="margin-top: 10px;">
          <span>📍 ${item.location}</span>
          <span>📅 ${item.date}</span>
        </div>
      </div>
    </article>
  `).join('') : '<div class="empty-state">No lost or found items match your search.</div>';

  const lostForm = document.getElementById('lost-form');
  if (lostForm && !lostForm.dataset.bound) {
    lostForm.dataset.bound = 'true';
    lostForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const entry = {
        id: `lost-${Date.now()}`,
        itemName: formData.get('itemName'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: new Date().toISOString().slice(0, 10),
        status: 'Lost',
        contact: formData.get('contact')
      };
      const current = Storage.get(STORAGE_KEYS.lostFoundEntries, campusData.lostFound);
      Storage.set(STORAGE_KEYS.lostFoundEntries, [entry, ...current]);
      renderLostFound();
      event.target.reset();
      showToast('Lost item reported successfully.');
    });
  }

  const foundForm = document.getElementById('found-form');
  if (foundForm && !foundForm.dataset.bound) {
    foundForm.dataset.bound = 'true';
    foundForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const entry = {
        id: `found-${Date.now()}`,
        itemName: formData.get('itemName'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: new Date().toISOString().slice(0, 10),
        status: 'Found',
        contact: formData.get('contact')
      };
      const current = Storage.get(STORAGE_KEYS.lostFoundEntries, campusData.lostFound);
      Storage.set(STORAGE_KEYS.lostFoundEntries, [entry, ...current]);
      renderLostFound();
      event.target.reset();
      showToast('Found item reported successfully.');
    });
  }
}
