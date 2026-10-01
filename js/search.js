function renderSearchSuggestions() {
  const container = document.getElementById('search-suggestions');
  if (!container) return;
  const terms = ['Library', 'Seminar Hall', 'Workshop', 'Canteen', 'Coding Club', 'Lost Item'];
  container.innerHTML = terms.map(term => `<button class="chip" data-search="${term}">${term}</button>`).join('');
  container.querySelectorAll('[data-search]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById('search-input');
      input.value = button.dataset.search;
      renderSearchResults(button.dataset.search);
    });
  });
}

function renderSearchResults(term = '') {
  const results = document.getElementById('search-results');
  if (!results) return;

  const q = term.trim().toLowerCase();
  if (!q) {
    results.innerHTML = '<div class="empty-state">Search campus updates, events, books, clubs, and locations.</div>';
    return;
  }

  const sources = [
    ...campusData.events.map(item => ({ ...item, category: 'Event', kind: 'event' })),
    ...campusData.announcements.map(item => ({ ...item, category: 'Announcement', kind: 'announcement' })),
    ...campusData.news.map(item => ({ ...item, category: 'News', kind: 'news' })),
    ...campusData.books.map(item => ({ ...item, category: 'Library', kind: 'book' })),
    ...campusData.clubs.map(item => ({ ...item, category: 'Club', kind: 'club' })),
    ...campusData.facilities.map(item => ({ ...item, category: 'Facility', kind: 'facility' }))
  ];

  const filtered = sources.filter(item => {
    const haystack = [
      item.title,
      item.name,
      item.itemName,
      item.category,
      item.description,
      item.summary,
      item.location,
      item.venue,
      item.author,
      item.department,
      item.type
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });

  results.innerHTML = filtered.length
    ? filtered.slice(0, 8).map(item => `
      <div class="search-result">
        <div>
          <strong>${item.title || item.name || item.itemName}</strong>
          <div class="meta-line"><span>${item.category}</span><span>•</span><span>${item.location || item.venue || item.department || item.date || 'Campus'}</span></div>
        </div>
        <button class="chip">Open</button>
      </div>
    `).join('')
    : '<div class="empty-state">No results found for your search.</div>';
}
