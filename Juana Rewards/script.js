/**
 * CAFE JUANA - ADMIN PORTAL INTERACTION LOGIC
 * Handles screen transitions, password visibility toggle, countdown, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const screens = {
    login: document.getElementById('screen-login'),
    forgot: document.getElementById('screen-forgot'),
    inbox: document.getElementById('screen-inbox')
  };

  const demoPills = document.querySelectorAll('.demo-pill-btn');
  const linkToForgot = document.getElementById('linkToForgot');
  const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
  const backToLoginFromInbox = document.getElementById('backToLoginFromInbox');

  const loginForm = document.getElementById('loginForm');
  const forgotForm = document.getElementById('forgotForm');

  const loginPasswordInput = document.getElementById('loginPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');

  const btnResendLink = document.getElementById('btnResendLink');
  const resendCount = document.getElementById('resendCount');

  // Eye Icons SVG Strings
  const eyeOpenSvg = `
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  `;

  const eyeClosedSvg = `
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  `;

  /**
   * Transition to a specific screen
   * @param {'screen-login' | 'screen-forgot' | 'screen-inbox'} targetScreenId
   */
  function navigateTo(targetScreenId) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
      }
    });

    // Show target screen
    const target = document.getElementById(targetScreenId);
    if (target) {
      target.classList.add('active');
    }

    // Update demo switcher pills
    demoPills.forEach(pill => {
      if (pill.getAttribute('data-target') === targetScreenId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Navigation Event Listeners
  if (linkToForgot) {
    linkToForgot.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('screen-forgot');
    });
  }

  if (backToLoginFromForgot) {
    backToLoginFromForgot.addEventListener('click', () => {
      navigateTo('screen-login');
    });
  }

  if (backToLoginFromInbox) {
    backToLoginFromInbox.addEventListener('click', () => {
      navigateTo('screen-login');
    });
  }

  // Demo Switcher Pills
  demoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');
      navigateTo(targetId);
    });
  });

  // Toggle Password Visibility
  if (togglePasswordBtn && loginPasswordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = loginPasswordInput.getAttribute('type') === 'password';
      if (isPassword) {
        loginPasswordInput.setAttribute('type', 'text');
        eyeIcon.innerHTML = eyeClosedSvg;
        togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      } else {
        loginPasswordInput.setAttribute('type', 'password');
        eyeIcon.innerHTML = eyeOpenSvg;
        togglePasswordBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // Handle Login Form Submission -> Redirect to Dashboard
  if (loginForm) {
    const handleLoginRedirect = (e) => {
      if (e) e.preventDefault();
      const btn = loginForm.querySelector('.btn-primary');
      if (btn) {
        btn.innerHTML = `<span>Entering Dashboard...</span>`;
        btn.disabled = true;
      }
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 300);
    };

    loginForm.addEventListener('submit', handleLoginRedirect);
    
    const loginSubmitBtn = loginForm.querySelector('.btn-primary');
    if (loginSubmitBtn) {
      loginSubmitBtn.addEventListener('click', handleLoginRedirect);
    }
  }

  // Handle Forgot Password Form Submission
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('recoveryEmail').value;
      const btn = forgotForm.querySelector('.btn-primary');
      
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>Sending link...</span>`;
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        // Move to Check your inbox view
        navigateTo('screen-inbox');
        startResendTimer();
      }, 700);
    });
  }

  // Resend Link Timer Logic
  let countdownTimer = null;
  function startResendTimer() {
    if (!resendCount || !btnResendLink) return;
    
    clearInterval(countdownTimer);
    let seconds = 58;
    btnResendLink.disabled = true;
    resendCount.textContent = `${seconds}s`;

    countdownTimer = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        resendCount.textContent = `${seconds}s`;
      } else {
        clearInterval(countdownTimer);
        btnResendLink.disabled = false;
        btnResendLink.textContent = 'Resend email now';
      }
    }, 1000);
  }

  if (btnResendLink) {
    btnResendLink.addEventListener('click', () => {
      if (!btnResendLink.disabled) {
        btnResendLink.innerHTML = `Resend email (<span id="resendCount">58s</span>)`;
        startResendTimer();
        alert('A fresh password reset link has been dispatched to your inbox.');
      }
    });
  }

  // Start initial timer if opened on inbox
  if (screens.inbox.classList.contains('active')) {
    startResendTimer();
  }
});
