document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const btn = form.querySelector('.btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn) btn.disabled = true;
    if (statusEl) {
      statusEl.textContent = 'Sending...';
      statusEl.className = 'form-status';
    }

    try {
      const resp = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (resp.ok) {
        form.reset();
        if (statusEl) {
          statusEl.textContent = 'Message sent successfully. Thank you!';
          statusEl.className = 'form-status success';
        }
      } else {
        let errorMsg = 'Failed to send. Please try again.';
        try {
          const data = await resp.json();
          if (data && data.errors) {
            errorMsg = data.errors.map(e => e.message).join(', ');
          }
        } catch {}
        if (statusEl) {
          statusEl.textContent = errorMsg;
          statusEl.className = 'form-status error';
        }
      }
    } catch {
      if (statusEl) {
        statusEl.textContent = 'Network error. Please try again.';
        statusEl.className = 'form-status error';
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});