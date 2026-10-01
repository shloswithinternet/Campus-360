function renderNews() {
  const container = document.getElementById('news-list');
  if (!container) return;
  container.innerHTML = campusData.news.map(item => `
    <article class="card news-card">
      <div class="card-media" style="background: ${item.image};"></div>
      <div class="card-body">
        <div class="meta-line">
          <span class="badge-pill">${item.category}</span>
          <span>${item.date}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="card-actions">
          <span>${item.author} • ${item.readingTime}</span>
          <button class="link-btn news-open" data-id="${item.id}">Read article</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.news-open').forEach(button => {
    button.addEventListener('click', () => openNewsModal(button.dataset.id));
  });
}

function openNewsModal(id) {
  const item = campusData.news.find(entry => entry.id === id);
  if (!item) return;

  const html = `
    <article>
      <div class="card-media" style="background: ${item.image}; height: 220px; border-radius: 16px; margin-bottom: 18px;"></div>
      <div class="meta-line">
        <span class="badge-pill">${item.category}</span>
        <span>${item.date}</span>
        <span>•</span>
        <span>${item.readingTime}</span>
      </div>
      <h2>${item.title}</h2>
      <p>By ${item.author}</p>
      <p>${item.summary}</p>
      <div class="panel-card" style="margin-top: 18px;">
        <p>Campus 360 article reader is a frontend demo view for a student-friendly news experience. This summary demonstrates how content can connect to events, announcements and departmental updates.</p>
      </div>
    </article>
  `;
  openModal(html);
}
