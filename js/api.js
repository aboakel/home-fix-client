const API_BASE =
  window.location.hostname.includes('localhost') ||
  window.location.hostname.includes('127.0.0.1')
    ? 'http://localhost:5000/api'
    : 'https://home-fix-server.onrender.com/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
}

function showMessage(element, message, type = 'success') {
  if (!element) return;
  element.textContent = message;
  element.className = `message-box ${type}`;
}
