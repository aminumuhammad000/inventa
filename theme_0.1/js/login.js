const { ipcRenderer } = require('electron');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const result = await ipcRenderer.invoke('login', { email, password });

    if (result.success) {
      showToast(`Welcome ${result.user.name}`, 'check_circle');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', result.user.name);

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        // window.location.href = '../dashboard.html';
        ipcRenderer.send('load-dashboard');
      }, 1000);
    } else {
      showToast(result.message, 'error');
    }
  } catch (err) {
    console.error("Login error:", err);
    showToast(err.message || err);
  }
});

function showToast(message, icon) {
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-message').textContent = message;
  toast.querySelector('.toast-icon').textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
