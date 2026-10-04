function renderAnnouncements() {
  const list = document.getElementById('announcements-list');
  if (!list) return;

  const filters = ['All', 'Academic', 'Examination', 'Administration', 'Placement', 'Student Affairs', 'Department', 'Clubs', 'General'];
  const container = document.getElementById('announcement-filters');

  if (container) {
    container.innerHTML = filters.map((filter, index) => `
      <button class="chip ${index === 0 ? 'active' : ''}" data-announcement-filter="${filter}">${filter}</button>
    `).join('');

    container.querySelectorAll('[data-announcement-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.announcementFilter;
        container.querySelectorAll('[data-announcement-filter]').forEach(item => item.classList.toggle('active', item === button));
        renderAnnouncementsList(selected);
      });
    });
  }

  renderAnnouncementsList('All');
}

function getAnnouncementsData() {
  const readIds = (typeof Storage !== 'undefined' && typeof STORAGE_KEYS !== 'undefined')
    ? Storage.get(STORAGE_KEYS.readAnnouncements, [])
    : [];
  return campusData.announcements.map(item => ({
    ...item,
    read: item.read || readIds.includes(item.id)
  }));
}

function renderAnnouncementsList(selectedCategory = 'All') {
  const list = document.getElementById('announcements-list');
  const allRecords = getAnnouncementsData();
  const records = selectedCategory === 'All'
    ? allRecords
    : allRecords.filter(announcement => announcement.category === selectedCategory);

  list.innerHTML = records.length ? records.map(item => `
    <article class="announcement priority-${item.priority.toLowerCase().replace(' ', '-')}">
      <div class="meta-line">
        <span class="badge-pill ${item.priority === 'Urgent' ? 'danger' : item.priority === 'Important' ? 'warning' : 'success'}">${item.priority}</span>
        <span>${item.category}</span>
        <span>•</span>
        <span>${item.date}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="card-actions">
        <span>${item.department}</span>
        <div>
          <button class="link-btn mark-read-btn" data-id="${item.id}">${item.read ? 'Read ✓' : 'Mark as read'}</button>
          <button class="link-btn announcement-open" data-id="${item.id}">Open</button>
        </div>
      </div>
    </article>
  `).join('') : '<div class="empty-state">No announcements for your filter.</div>';

  list.querySelectorAll('.mark-read-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (typeof Storage !== 'undefined' && typeof STORAGE_KEYS !== 'undefined') {
        const readIds = Storage.get(STORAGE_KEYS.readAnnouncements, []);
        if (!readIds.includes(id)) {
          Storage.set(STORAGE_KEYS.readAnnouncements, [...readIds, id]);
        }
      }
      campusData.announcements = campusData.announcements.map(item => item.id === id ? { ...item, read: true } : item);
      renderAnnouncements();
      renderNotificationBadge();
      showToast('Announcement marked as read.');
    });
  });

  list.querySelectorAll('.announcement-open').forEach(button => {
    button.addEventListener('click', () => openAnnouncementModal(button.dataset.id));
  });
}

function openAnnouncementModal(id) {
  const item = campusData.announcements.find(announcement => announcement.id === id);
  if (!item) return;

  const html = `
    <div>
      <div class="meta-line">
        <span class="badge-pill ${item.priority === 'Urgent' ? 'danger' : item.priority === 'Important' ? 'warning' : 'success'}">${item.priority}</span>
        <span>${item.category}</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <div class="two-col">
        <div class="panel-card"><strong>Department</strong><p>${item.department}</p></div>
        <div class="panel-card"><strong>Date</strong><p>${item.date}</p></div>
      </div>
      <div class="card-actions" style="margin-top: 18px;">
        <span>${item.attachment ? 'Attachment included' : 'No attachment'}</span>
        <button class="btn btn-primary" type="button">View Details</button>
      </div>
    </div>
  `;
  openModal(html);
}
