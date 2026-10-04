function renderBlogs() {
  const container = document.getElementById('blogs-list');
  if (!container) return;

  const blogs = campusData.blogs.concat(Storage.get(STORAGE_KEYS.savedBlogs, []));
  container.innerHTML = blogs.map((blog, index) => `
    <article class="card blog-card ${index === 0 ? 'blog-card-featured' : 'blog-card-list'}">
      <div class="card-body">
        <div class="meta-line">
          ${index === 0 ? '<span class="editorial-label">From the community</span>' : ''}
          <span class="badge-pill">${blog.category}</span>
          <span>${blog.date}</span>
        </div>
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <div class="meta-line" style="margin-top: 12px;">
          <span>By ${blog.author}</span>
          <span>•</span>
          <span>${blog.role || 'Student'}</span>
        </div>
        <div class="card-actions">
          <span>${blog.readingTime}</span>
          <button class="link-btn blog-save" data-id="${blog.id}">${bookmarkedBlog(blog.id) ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.blog-save').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const current = Storage.get(STORAGE_KEYS.savedBlogs, []);
      const exists = current.some(blog => blog.id === id);
      const next = exists ? current.filter(blog => blog.id !== id) : [...current, campusData.blogs.find(blog => blog.id === id) || { id, title: 'Draft Blog', cover: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(124,58,237,0.14))'}];
      Storage.set(STORAGE_KEYS.savedBlogs, next);
      renderBlogs();
      showToast(exists ? 'Blog removed from saved list.' : 'Blog saved to your dashboard.');
    });
  });
}

function bookmarkedBlog(id) {
  return Storage.get(STORAGE_KEYS.savedBlogs, []).some(blog => blog.id === id);
}

function openBlogComposer() {
  const html = `
    <form id="blog-draft-form" class="stack-form">
      <label>
        Title
        <input type="text" name="title" required />
      </label>
      <label>
        Category
        <select name="category">
          <option>Student Life</option>
          <option>Technology</option>
          <option>Career</option>
          <option>Projects</option>
          <option>Campus Stories</option>
          <option>Experiences</option>
          <option>Clubs</option>
          <option>Opinions</option>
          <option>Tutorials</option>
        </select>
      </label>
      <label>
        Draft
        <textarea name="excerpt" rows="5" required></textarea>
      </label>
      <button type="submit" class="btn btn-primary">Save Blog Draft</button>
    </form>
  `;
  openModal(html);

  document.getElementById('blog-draft-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const draft = {
      id: `draft-${Date.now()}`,
      title: formData.get('title'),
      author: 'Alex Student',
      role: 'Student',
      date: new Date().toISOString().slice(0, 10),
      readingTime: '4 min read',
      category: formData.get('category'),
      excerpt: formData.get('excerpt'),
      cover: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.16))'
    };
    const existing = Storage.get(STORAGE_KEYS.savedBlogs, []);
    Storage.set(STORAGE_KEYS.savedBlogs, [draft, ...existing]);
    renderBlogs();
    closeModal();
    showToast('Blog draft saved successfully.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('write-blog-btn')?.addEventListener('click', openBlogComposer);
});
