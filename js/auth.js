const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const userData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      role: document.getElementById('role').value
    };

    const result = await api.post('/users/register', userData);
    localStorage.setItem('homeFixUser', JSON.stringify(result.user));
    showMessage(`Registered successfully. Welcome ${result.user.fullName}.`, 'success');
    registerForm.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const loginData = {
      email: document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value
    };

    const result = await api.post('/users/login', loginData);
    localStorage.setItem('homeFixUser', JSON.stringify(result.user));
    showMessage(`Login successful. Hello ${result.user.fullName}.`, 'success');
    loginForm.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});
