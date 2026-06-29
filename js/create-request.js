const requestForm = document.getElementById('requestForm');
const weatherBtn = document.getElementById('weatherBtn');
const weatherBox = document.getElementById('weatherBox');

requestForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const currentUser = getCurrentUser();

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value,
    address: document.getElementById('address').value.trim(),
    serviceType: document.getElementById('serviceType').value,
    description: document.getElementById('description').value.trim(),
    priority: document.getElementById('priority').value,
    imageUrl: document.getElementById('imageUrl').value.trim(),
    estimatedPrice: Number(document.getElementById('estimatedPrice').value || 0),
    createdBy: currentUser?.id || null
  };

  try {
    const result = await api.post('/requests', payload);
    showMessage(`Request created successfully. ID: ${result.request._id}`, 'success');
    requestForm.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

weatherBtn?.addEventListener('click', async () => {
  const city = document.getElementById('city').value;
  if (!city) {
    weatherBox.textContent = 'Choose a city first.';
    return;
  }

  try {
    const weather = await api.get(`/weather?city=${encodeURIComponent(city)}`);
    weatherBox.innerHTML = `
      <strong>${weather.city}</strong><br />
      Temperature: ${weather.temperature}°C<br />
      Wind speed: ${weather.windspeed} km/h<br />
      Source: ${weather.source}
    `;
  } catch (error) {
    weatherBox.textContent = error.message;
  }
});
