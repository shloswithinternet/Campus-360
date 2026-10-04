function renderFeedback() {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  renderFeedbackStatus();

  if (!form.dataset.bound) {
    form.dataset.bound = 'true';
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const feedback = {
        id: `fb-${Date.now()}`,
        category: formData.get('category'),
        rating: formData.get('rating'),
        text: formData.get('text'),
        anonymous: formData.get('anonymous') === 'on',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      const current = Storage.get(STORAGE_KEYS.feedback, []);
      Storage.set(STORAGE_KEYS.feedback, [feedback, ...current]);
      event.target.reset();
      renderFeedbackStatus(feedback);
      showToast('Thank you for helping improve Campus 360.');
    });
  }
}

function renderFeedbackStatus(latest = Storage.get(STORAGE_KEYS.feedback, [])[0]) {
  const status = document.getElementById('feedback-status');
  if (!status || !latest) return;
  status.hidden = false;
  status.textContent = `Your ${latest.category} feedback was received on ${latest.createdAt}. Thank you for sharing it with Campus 360.`;
}
