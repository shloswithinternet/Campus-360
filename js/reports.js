function renderReports() {
  const issueForm = document.getElementById('issue-form');
  if (!issueForm) return;

  const reportList = document.getElementById('report-list') || document.createElement('div');
  reportList.id = 'report-list';
  reportList.className = 'card-grid mt-24';

  const existing = issueForm.parentNode.querySelector('#report-list');
  if (!existing) {
    issueForm.parentNode.appendChild(reportList);
  }

  const reports = Storage.get(STORAGE_KEYS.reports, [
    { id: 'C360-RP-2048', status: 'Submitted', category: 'Classroom issue', location: 'Room 214', description: 'Projector not switching on.' }
  ]);

  reportList.innerHTML = reports.length ? reports.map(report => `
    <article class="card report-card">
      <div class="card-body">
        <div class="meta-line">
          <span class="badge-pill ${report.status === 'Resolved' ? 'success' : report.status === 'Assigned' ? 'warning' : 'danger'}">${report.status}</span>
          <span>${report.category}</span>
        </div>
        <h3>${report.id}</h3>
        <p>${report.description}</p>
        <div class="meta-line" style="margin-top: 10px;">
          <span>📍 ${report.location}</span>
        </div>
      </div>
    </article>
  `).join('') : '<div class="empty-state">No reports submitted yet.</div>';

  issueForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reportId = `C360-RP-${Math.floor(1000 + Math.random() * 9000)}`;
    const report = {
      id: reportId,
      category: formData.get('category'),
      location: formData.get('location'),
      description: formData.get('description'),
      urgency: formData.get('urgency'),
      contact: formData.get('contact'),
      status: 'Submitted'
    };

    const current = Storage.get(STORAGE_KEYS.reports, []);
    Storage.set(STORAGE_KEYS.reports, [report, ...current]);
    event.target.reset();
    renderReports();
    showToast(`Report ${reportId} submitted successfully.`);
  });
}
