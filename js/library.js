const libraryState = {
  category: 'All',
  query: '',
  availability: 'All'
};

function renderLibrary() {
  const list = document.getElementById('library-list');
  const filterContainer = document.getElementById('library-filters');
  if (!list) return;

  const filters = ['All', 'Programming', 'AI/ML', 'Engineering', 'Reference', 'Fiction'];
  if (filterContainer) {
    filterContainer.innerHTML = filters.map((filter, index) => `
      <button class="chip ${index === 0 ? 'active' : ''}" data-library-filter="${filter}">${filter}</button>
    `).join('');

    filterContainer.querySelectorAll('[data-library-filter]').forEach(button => {
      button.addEventListener('click', () => {
        filterContainer.querySelectorAll('[data-library-filter]').forEach(item => item.classList.toggle('active', item === button));
          libraryState.category = button.dataset.libraryFilter;
          renderLibraryList();
      });
    });
  }

  document.getElementById('library-query')?.addEventListener('input', event => {
    libraryState.query = event.target.value.trim().toLowerCase();
    renderLibraryList();
  });

  document.getElementById('library-availability')?.addEventListener('change', event => {
    libraryState.availability = event.target.value;
    renderLibraryList();
  });

  renderLibraryList();
}

function renderLibraryList() {
  const list = document.getElementById('library-list');
  const books = campusData.books.filter(book => {
    const matchesCategory = libraryState.category === 'All' || book.category === libraryState.category;
    const searchableText = `${book.title} ${book.author} ${book.category} ${book.shelf}`.toLowerCase();
    const matchesQuery = !libraryState.query || searchableText.includes(libraryState.query);
    const matchesAvailability = libraryState.availability === 'All' || book.availability === libraryState.availability;
    return matchesCategory && matchesQuery && matchesAvailability;
  });

  const count = document.getElementById('library-count');
  if (count) count.textContent = `${books.length} ${books.length === 1 ? 'resource' : 'resources'}`;

  list.innerHTML = books.length ? books.map(book => `
    <article class="book-card card">
        <div class="book-cover">${book.category.slice(0, 2).toUpperCase()}</div>
        <div class="card-body">
          <div class="meta-line">
            <span class="badge-pill">${book.category}</span>
            <span class="status-${book.availability.toLowerCase()}">${book.availability}</span>
          </div>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
        <div class="meta-line" style="margin-top: 10px;">
          <span>Shelf ${book.shelf}</span>
        </div>
        <div class="card-actions">
          <span>${book.availability === 'Available' ? 'Ready to issue' : book.availability === 'E-book' ? 'Digital copy' : 'Currently issued'}</span>
          <button class="link-btn library-open" data-id="${book.id}">Details</button>
        </div>
      </div>
    </article>
  `).join('') : '<div class="empty-state">No resources match those search and filter settings.</div>';

  list.querySelectorAll('.library-open').forEach(button => {
    button.addEventListener('click', () => openBookModal(button.dataset.id));
  });
}

function openBookModal(id) {
  const book = campusData.books.find(item => item.id === id);
  if (!book) return;

  const html = `
    <div>
      <div class="book-cover" style="height: 220px; margin-bottom: 18px; border-radius: 16px;">${book.category.slice(0, 2).toUpperCase()}</div>
      <div class="meta-line">
        <span class="badge-pill">${book.category}</span>
        <span>${book.availability}</span>
      </div>
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Edition:</strong> ${book.edition}</p>
      <p><strong>Shelf:</strong> ${book.shelf}</p>
      <p>${book.description}</p>
    </div>
  `;
  openModal(html);
}
