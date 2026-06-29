const providers = {
  otieno: {
    id: 'otieno',
    name: 'OTIENO',
    subtitle: 'PLUMBING SERVICE',
    category: 'Plumbing',
    rating: '4.2',
    phone: '050-9856732',
    logoClass: 'logo-otieno',
    logoText: '💧',
    cardTitle: 'Plumbing services for leaks, pipes, and repairs.',
    description: `I specialize in fixing plumbing issues such as leaks, pipe repairs, and faucet replacement.

• Service call starts from ₪150
• Faucet replacement from ₪250
• 10% discount for new customers
• Final price depends on job size

Send photos, videos, or call for a better estimate.`
  },
  flash: {
    id: 'flash',
    name: 'FLASH HOUSE',
    subtitle: 'ELECTRICITY',
    category: 'Electric',
    rating: '3.1',
    phone: '053-7898345',
    logoClass: 'logo-flash',
    logoText: '⌂',
    cardTitle: 'Electric: Electrical repairs and installs.',
    description: `Electrical repairs and installations
I provide home electrical services including repairs, installations, lighting, switches, and power outlets.

• Service call starts from ₪180
• Switch or outlet installation from ₪200
• 10% discount for first-time customers
• Final pricing depends on the job complexity

Sending photos or videos helps me give a more accurate estimate.`
  },
  master: {
    id: 'master',
    name: 'MASTER',
    subtitle: 'CLEANER',
    category: 'Cleaning',
    rating: '4',
    phone: '054-3658235',
    logoClass: 'logo-master',
    logoText: '🧹',
    cardTitle: 'Cleaning: Home cleaning services.',
    description: `Home cleaning services
I offer professional home cleaning services for apartments and houses, including regular and deep cleaning.

• Cleaning services start from ₪200
• Price depends on home size and condition
• 10% discount for new customers
• Flexible scheduling available

Please share photos or details about the space, or contact me for a short call to provide a better quote.`
  },
  horse: {
    id: 'horse',
    name: 'HORSE REPAIR',
    subtitle: 'WORKSHOP',
    category: 'Maintenance',
    rating: '4.8',
    phone: '050-87362598',
    logoClass: 'logo-horse',
    logoText: '♞',
    cardTitle: 'Maintenance: General home maintenance.',
    description: `General home maintenance
I take care of general home maintenance, small repairs, installations, and everyday household issues.

• Service call starts from ₪160
• Small repairs start from ₪220
• 10% discount on the first service
• Pricing varies based on the type of work

It is recommended to send photos or videos, or have a quick call, to better understand the job.`
  }
};

function providerStars(rating) {
  return `<div class="stars">★★★★☆ <span>${rating}</span></div>`;
}

function providerLogo(p) {
  return `<div class="provider-logo ${p.logoClass}"><span>${p.logoText}</span><strong>${p.name}</strong><small>${p.subtitle}</small></div>`;
}

function getProviderFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return providers[params.get('provider')] || providers.horse;
}

function getChatMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') || 'empty';
}

function renderHomeProviders() {
  const grid = document.getElementById('providersGrid');
  const chips = document.getElementById('categoryChips');
  if (!grid) return;

  function draw(category = 'All') {
    const items = Object.values(providers).filter(p => category === 'All' || p.category === category);
    grid.innerHTML = items.map(p => `
      <a href="provider.html?provider=${p.id}" class="provider-card">
        ${providerLogo(p)}
        <p>${p.cardTitle}</p>
        ${providerStars(p.rating)}
      </a>
    `).join('');
  }

  chips?.addEventListener('click', (event) => {
    const button = event.target.closest('.chip');
    if (!button) return;
    [...chips.querySelectorAll('.chip')].forEach(c => c.classList.remove('active'));
    button.classList.add('active');
    draw(button.dataset.category);
  });

  draw();
}

function renderProviderDetails() {
  const p = getProviderFromUrl();
  const details = document.getElementById('providerDetails');
  if (!details) return;

  details.innerHTML = `
    ${providerLogo(p)}
    ${providerStars(p.rating)}
    <p class="provider-name-line">${p.name} – ${p.category} :</p>
    <p class="provider-copy">${p.description.replaceAll('\n', '<br />')}</p>
  `;

  const send = document.getElementById('sendMessage');
  if (send) send.href = `chat.html?provider=${p.id}&mode=empty`;

  const modal = document.getElementById('phoneModal');
  const phone = document.getElementById('providerPhone');
  const call = document.getElementById('callLink');
  const contact = document.getElementById('contactNow');
  const close = document.getElementById('closeModal');

  if (phone) phone.textContent = p.phone;
  if (call) call.href = `tel:${p.phone}`;
  contact?.addEventListener('click', () => modal?.classList.remove('hidden'));
  close?.addEventListener('click', () => modal?.classList.add('hidden'));
}

function renderChatHeader() {
  const p = getProviderFromUrl();
  const header = document.getElementById('chatHeader');
  if (header) header.innerHTML = providerLogo(p);
}

function renderChatThread() {
  const thread = document.getElementById('chatThread');
  if (!thread) return;
  const mode = getChatMode();

  if (mode !== 'conversation') {
    thread.innerHTML = `
      <div class="bubble provider">Hi Ameer,<br />How can I help you?</div>
    `;
    return;
  }

  thread.innerHTML = `
    <div class="bubble provider">Hi Ameer,<br />How can I help you?</div>
    <div class="bubble me">Hi, my kitchen sink is leaking and I need someone to fix it. Can you help?</div>
    <div class="bubble provider">Hello 👋<br />No problem, we can fix it for you.<br />The repair should take about one working day.</div>
    <div class="bubble me">Great 👍<br />How much will it cost and when can you come?</div>
    <div class="bubble provider summary">
      <b>Here is the service summary:</b><br />
      • Repair Summary<br />
      • Service: Kitchen sink repair<br />
      • Estimated cost: ₪220<br />
      • Arrival time: Tomorrow at 10:00 AM<br />
      Does this work for you?
    </div>
    <a class="confirm-pill" href="payment.html">Yes, that works for me.</a>
    <div class="payment-prompt">
      <span>Please confirm your booking below:</span>
      <a href="payment.html">Go to Payment</a>
    </div>
  `;
}

function renderAttachHeader() {
  const p = getProviderFromUrl();
  const header = document.getElementById('attachHeader');
  if (header) header.innerHTML = providerLogo(p);
}
