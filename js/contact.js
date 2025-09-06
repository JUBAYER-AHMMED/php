// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  const submitBtn = document.getElementById('submitBtn');

  // Show success/error from server (via query params)
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    notice.textContent = '✅ Thanks! Your message was sent. We will contact you soon.';
    notice.classList.add('success');
    // clear the URL so refresh won't resend the query param message
    window.history.replaceState({}, document.title, window.location.pathname);
    // optionally clear form fields
    form?.reset();
  } else if (params.get('error')) {
    const err = params.get('error');
    if (err === 'validation') {
      notice.textContent = 'Please fix form validation errors and try again.';
    } else if (err === 'rate') {
      notice.textContent = 'You are sending messages too quickly. Please wait a moment.';
    } else if (err === 'db') {
      notice.textContent = 'Server error while saving your message. Try again later.';
    } else {
      notice.textContent = 'An error occurred. Try again later.';
    }
    notice.classList.add('error');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const showError = (id, msg) => {
    const field = document.getElementById(id);
    const err = document.querySelector(`.form__error[data-for="${id}"]`);
    field?.classList.add('invalid');
    if (err) { err.textContent = msg; err.style.display = 'block'; }
  };

  const clearError = (id) => {
    const field = document.getElementById(id);
    const err = document.querySelector(`.form__error[data-for="${id}"]`);
    field?.classList.remove('invalid');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  };

  ['full_name','email','phone','subject','message','agree'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => clearError(id));
    if (el.type === 'checkbox') el.addEventListener('change', () => clearError(id));
  });

  form.addEventListener('submit', (e) => {
    notice.textContent = '';
    notice.classList.remove('error','success');
    let ok = true;

    const name = document.getElementById('full_name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('full_name', 'Please enter your full name.');
      ok = false;
    }

    const email = document.getElementById('email');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) {
      showError('email', 'Enter a valid email address.');
      ok = false;
    }

    const phone = document.getElementById('phone');
    if (phone.value.trim() && !/^\+?\d{10,15}$/.test(phone.value.trim())) {
      showError('phone', 'Phone must be 10–15 digits (optional).');
      ok = false;
    }

    const subject = document.getElementById('subject');
    if (!subject.value.trim() || subject.value.trim().length < 3) {
      showError('subject', 'Subject should be at least 3 characters.');
      ok = false;
    }

    const message = document.getElementById('message');
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('message', 'Message should be at least 10 characters.');
      ok = false;
    }

    const agree = document.getElementById('agree');
    if (!agree.checked) {
      showError('agree', 'You must accept the terms to continue.');
      ok = false;
    }

    // Simple bot trap (honeypot)
    const hp = form.querySelector('.hp-field');
    if (hp && hp.value) ok = false;

    if (!ok) {
      e.preventDefault();
      notice.textContent = 'Please fix the highlighted fields.';
      notice.classList.add('error');
      return;
    }

    // Let the form POST normally; disable submit button to avoid double post
    submitBtn.disabled = true;
  });
});
