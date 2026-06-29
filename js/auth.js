const form = document.getElementById('registerForm');
const message = document.getElementById('authMessage');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = {
    name: document.getElementById('registerName').value.trim() || 'Ameer',
    email: document.getElementById('registerEmail').value.trim(),
    role: 'Customer'
  };

  localStorage.setItem('homeFixUser', JSON.stringify(user));
  message.textContent = `Registered successfully. Welcome ${user.name}.`;
  message.className = 'inline-message success';

  setTimeout(() => {
    window.location.href = 'pages/home.html';
  }, 650);
});
