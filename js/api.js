// Change this after deploying the server, for example:
// const API_BASE_URL = 'https://your-render-server.onrender.com/api';
const API_BASE_URL = localStorage.getItem('HOME_FIX_API_BASE_URL') || 'http://localhost:5000/api';

const api = {
  async request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  },

  get(path) {
    return this.request(path);
  },

  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  },

  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }
};

function showMessage(text, type = 'success') {
  const box = document.getElementById('messageBox');
  if (!box) return;
  box.textContent = text;
  box.className = `message ${type}`;
}

function getCurrentUser() {
  const saved = localStorage.getItem('homeFixUser');
  return saved ? JSON.parse(saved) : null;
}
