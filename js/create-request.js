const form = document.getElementById('requestForm');
const message = document.getElementById('requestMessage');
const weatherBtn = document.getElementById('weatherBtn');
const weatherBox = document.getElementById('weatherBox');

weatherBtn?.addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    showMessage(weatherBox, 'Enter a city first.', 'error');
    return;
  }

  try {
    const data = await apiRequest(`/weather?city=${encodeURIComponent(city)}`);
    const text = data.temperature
      ? `Weather in ${city}: ${data.temperature}°C, ${data.description || 'available'}`
      : `Weather data checked for ${city}.`;
    showMessage(weatherBox, text, 'success');
  } catch (error) {
    showMessage(weatherBox, 'Weather API is unavailable, but request submission still works.', 'warning');
  }
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value.trim(),
    address: document.getElementById('address').value.trim(),
    serviceType: document.getElementById('serviceType').value,
    description: document.getElementById('description').value.trim(),
    priority: document.getElementById('priority').value,
    estimatedPrice: Number(document.getElementById('estimatedPrice').value || 0)
  };

  try {
    await apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    showMessage(message, 'Request created successfully. You can view it in the dashboard.', 'success');
    form.reset();
    setTimeout(() => window.location.href = 'dashboard.html', 900);
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
});
