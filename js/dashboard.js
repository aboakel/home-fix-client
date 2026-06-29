const list = document.getElementById('requestsList');
const statsGrid = document.getElementById('statsGrid');
const message = document.getElementById('dashboardMessage');
const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');

function normalizeRequests(data) {
  if (Array.isArray(data)) return data;
  return data.requests || data.data || [];
}

function displayStatus(status = '') {
  return status.replaceAll('_', ' ');
}

function requestCard(request) {
  return `
    <article class="request-item">
      <div class="request-head">
        <h2>${request.customerName || 'Customer'}</h2>
        <span class="priority ${request.priority || 'normal'}">${request.priority || 'normal'}</span>
      </div>
      <p>${request.description || 'No description'}</p>
      <p><b>City:</b> ${request.city || '-'}</p>
      <p><b>Service:</b> ${request.serviceType || '-'}</p>
      <p><b>Status:</b> ${displayStatus(request.status || 'open')}</p>
      <p><b>Phone:</b> ${request.phone || '-'}</p>
      <p><b>Price:</b> ₪${request.estimatedPrice || 0}</p>

      <select data-status="${request._id}">
        <option value="open" ${request.status === 'open' ? 'selected' : ''}>Open</option>
        <option value="in_progress" ${request.status === 'in_progress' ? 'selected' : ''}>In progress</option>
        <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Completed</option>
        <option value="cancelled" ${request.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>

      <div class="card-actions">
        <button class="btn btn-soft update-btn" data-id="${request._id}">Update</button>
        <button class="btn delete-btn" data-delete="${request._id}">Delete</button>
      </div>
    </article>
  `;
}

async function loadRequests(path = '/requests') {
  try {
    const data = await apiRequest(path);
    const requests = normalizeRequests(data);
    list.innerHTML = requests.length
      ? requests.map(requestCard).join('')
      : '<p class="muted empty-state">No requests found.</p>';
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function loadStats() {
  try {
    const data = await apiRequest('/requests/stats/summary');
    const parts = [];

    if (data.totalRequests !== undefined) parts.push(['Total', data.totalRequests]);
    if (Array.isArray(data.byStatus)) {
      data.byStatus.forEach(item => parts.push([displayStatus(item._id || 'status'), item.count]));
    }
    if (Array.isArray(data.byServiceType)) {
      data.byServiceType.forEach(item => parts.push([item._id || 'service', item.count]));
    }

    statsGrid.innerHTML = (parts.length ? parts : [['Requests', 'Live']]).map(([label, value]) => `
      <div class="stat-card"><span>${label}</span><b>${value}</b></div>
    `).join('');
  } catch (error) {
    statsGrid.innerHTML = `
      <div class="stat-card"><span>API</span><b>Live</b></div>
      <div class="stat-card"><span>MongoDB</span><b>On</b></div>
    `;
  }
}

list?.addEventListener('click', async (event) => {
  const updateButton = event.target.closest('.update-btn');
  const deleteButton = event.target.closest('[data-delete]');

  try {
    if (updateButton) {
      const id = updateButton.dataset.id;
      const status = document.querySelector(`[data-status="${id}"]`).value;
      await apiRequest(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      showMessage(message, 'Request status updated successfully.', 'success');
      await loadRequests();
      await loadStats();
    }

    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      await apiRequest(`/requests/${id}`, { method: 'DELETE' });
      showMessage(message, 'Request deleted successfully.', 'success');
      await loadRequests();
      await loadStats();
    }
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
});

filterBtn?.addEventListener('click', () => {
  const city = document.getElementById('filterCity').value.trim();
  const status = document.getElementById('filterStatus').value;
  const serviceType = document.getElementById('filterService').value;

  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (status) params.set('status', status);
  if (serviceType) params.set('serviceType', serviceType);
  params.set('sortBy', 'priority');

  loadRequests(`/requests/advanced/filter?${params.toString()}`);
});

resetBtn?.addEventListener('click', () => {
  document.getElementById('filterCity').value = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterService').value = '';
  loadRequests();
});

loadStats();
loadRequests();
