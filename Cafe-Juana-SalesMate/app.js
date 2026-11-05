(() => {
  const by = (s) => document.querySelector(s);
  const toast = by('#toast');
  let hideTimer;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { toast.hidden = true; }, 3300);
  };
  const login = by('#login-form');
  if (login) login.addEventListener('submit', (e) => {
    e.preventDefault();
    if (login.reportValidity()) window.location.href = 'dashboard.html'; // Demo: no backend auth.
  });
  const recovery = by('#recovery-form');
  if (recovery) recovery.addEventListener('submit', (e) => {
    e.preventDefault();
    if (recovery.reportValidity()) window.location.href = 'account-recovery-confirmation.html'; // Demo: no email sent.
  });
  const passwordButton = by('[data-toggle-password]');
  if (passwordButton) passwordButton.addEventListener('click', () => {
    const input = by('#password');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    passwordButton.setAttribute('aria-label',show?'Hide password':'Show password');
    passwordButton.setAttribute('aria-pressed', String(show));
  });
  const profileButton = by('#profile-button');
  const profileMenu = by('#profile-menu');
  const bellButton = by('#bell-button');
  const notificationsMenu = by('#notifications-menu');
  if (profileButton && profileMenu) profileButton.addEventListener('click', () => {
    profileMenu.hidden = !profileMenu.hidden;
    if (notificationsMenu) notificationsMenu.hidden = true;
  });
  if (bellButton && notificationsMenu) bellButton.addEventListener('click', () => {
    notificationsMenu.hidden = !notificationsMenu.hidden;
    if (profileMenu) profileMenu.hidden = true;
  });
  document.addEventListener('click', (e) => {
    if (profileMenu && !e.target.closest('#profile-button') && !e.target.closest('#profile-menu')) profileMenu.hidden = true;
    if (notificationsMenu && !e.target.closest('#bell-button') && !e.target.closest('#notifications-menu')) notificationsMenu.hidden = true;
  });
  try {
    if (localStorage.getItem('cafe-juana-dark-mode') === 'true' && document.body.classList.contains('admin-body')) document.body.classList.add('dark');
  } catch (_e) {}
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try { localStorage.setItem('cafe-juana-dark-mode', String(document.body.classList.contains('dark'))); } catch (_e) {}
    if (profileMenu) profileMenu.hidden = true;
  }));
  document.querySelectorAll('[data-coming-soon]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    notify('This admin module is not yet implemented in this six-screen preview.');
  }));
  // Global module search is handled by modules.js.
  document.querySelectorAll('.card-heading select:not(#activity-period)').forEach((s) => s.addEventListener('change',() => notify('This chart currently uses sample data.')));
})();
