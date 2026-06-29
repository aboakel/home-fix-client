const requestsList = document.getElementById('requestsList');
const filterForm = document.getElementById('filterForm');
const statsBox = document.getElementById('statsBox');

function getStatusLabel(status) {
  return status.replace('_', ' ');
}

function buildQueryFromFilters() {
  const params = new URLSearchParams();
  const fields = ['search', 'city', 'status', 'serviceType', 'sortBy'];

  fields.forEach((field) => {
    const value = document.getElementById(field)?.value;
    if (value) params.append(field, value);
  });

  if (document.getElementById('sortBy')?.value === 'priority') {
    params.append('order', 'desc');
  }

  return params.toString();
}

async function loadStats() {
  try {
    const stats = await api.get('/requests/stats/summary');
    const statusCards = stats.byStatus.map(item => `
      <div class="stat-card">
        <span>${getStatusLabel(item._id)}</span>
        <strong>${item.count}</strong>
      </div>
    `).join('');

    const serviceCards = stats.byServiceType.map(item => `
      <div class="stat-card">
        <span>${item._id.replace('_', ' ')}</span>
        <strong>${item.count}</strong>
      </div>
    `).join('');

    statsBox.innerHTML = statusCards + serviceCards;
  } catch (error) {
    statsBox.innerHTML = '';
  }
}

function requestCard(request) {
  return `
    <article class="request-card" data-id="${request._id}">
      <div class="card-top">
        <h3>${request.customerName}</h3>
        <span class="pill ${request.priority}">${request.priority}</span>
      </div>
      <p>${request.description}</p>
      <ul class="details-list">
        <li><strong>City:</strong> ${request.city}</li>
        <li><strong>Service:</strong> ${request.serviceType.replace('_', ' ')}</li>
        <li><strong>Status:</strong> ${getStatusLabel(request.status)}</li>
        <li><strong>Phone:</strong> ${request.phone}</li>
        <li><strong>Price:</strong> ₪${request.estimatedPrice || 0}</li>
      </ul>
      ${request.imageUrl ? `<img class="request-image" src="${request.imageUrl}" alt="Request image" />` : ''}
      <div class="card-actions">
        <select class="statusSelect">
          <option value="open" ${request.status === 'open' ? 'selected' : ''}>Open</option>
          <option value="in_progress" ${request.status === 'in_progress' ? 'selected' : ''}>In progress</option>
          <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${request.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <button class="btn secondary updateBtn">Update</button>
        <button class="btn danger deleteBtn">Delete</button>
      </div>
    </article>
  `;
}

async function loadRequests() {
  try {
    const query = buildQueryFromFilters();
    const result = await api.get(`/requests${query ? `?${query}` : ''}`);

    if (!result.requests.length) {
      requestsList.innerHTML = '<p class="empty">No requests found.</p>';
      return;
    }

    requestsList.innerHTML = result.requests.map(requestCard).join('');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

requestsList?.addEventListener('click', async (event) => {
  const card = event.target.closest('.request-card');
  if (!card) return;

  const id = card.dataset.id;

  if (event.target.classList.contains('updateBtn')) {
    const status = card.querySelector('.statusSelect').value;
    try {
      await api.put(`/requests/${id}`, { status });
      showMessage('Request status updated.', 'success');
      await loadRequests();
      await loadStats();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  if (event.target.classList.contains('deleteBtn')) {
    try {
      await api.delete(`/requests/${id}`);
      showMessage('Request deleted.', 'success');
      await loadRequests();
      await loadStats();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }
});

filterForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadRequests();
});

loadRequests();
loadStats();
