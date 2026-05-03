// VisaPulse — Home JS

// ---- SLOT FILTER ----
function filterSlots(btn, cat) {
  document.querySelectorAll('.panel-slots .chip').forEach(c => c.classList.remove('chip-on'));
  btn.classList.add('chip-on');
  document.querySelectorAll('#slotList .slot-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ---- TIMELINE FILTER ----
function filterTL(btn, cat) {
  document.querySelectorAll('.panel-timelines .chip').forEach(c => c.classList.remove('chip-on'));
  btn.classList.add('chip-on');
  document.querySelectorAll('#tlList .tl-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ---- ALERT MODAL ----
function openAlertModal() {
  document.getElementById('alertModal').classList.add('open');
}
function closeAlertModal(e) {
  if (!e || e.target === document.getElementById('alertModal')) {
    document.getElementById('alertModal').classList.remove('open');
  }
}

// ---- ANIMATED COUNTERS ----
function animateCount(el, target, suffix) {
  const raw = target.replace(/[^0-9]/g, '');
  const num = parseInt(raw);
  const duration = 1200;
  const start = performance.now();
  const startVal = Math.max(0, num - Math.floor(num * 0.15));

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const current = Math.round(startVal + (num - startVal) * ease);
    el.textContent = current.toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const slotEl = document.getElementById('slotCount');
    const tlEl = document.getElementById('tlCount');
    if (slotEl) animateCount(slotEl, '247');
    if (tlEl) animateCount(tlEl, '1840');
  }, 300);

  // Simulate live pulse: add a new "just reported" slot every ~12s
  const embassies = [
    { name: 'Mumbai — US Consulate', type: 'H1B stamping', badge: 'badge-now', label: 'Just now', cat: 'us' },
    { name: 'Dakar — French Embassy', type: 'Schengen tourist', badge: 'badge-soon', label: '< 1 hr', cat: 'schengen' },
    { name: 'Kampala — UK VFS', type: 'Student visa', badge: 'badge-now', label: 'Just now', cat: 'uk' },
  ];
  let nextEmb = 0;
  setInterval(() => {
    const e = embassies[nextEmb % embassies.length];
    nextEmb++;
    const list = document.getElementById('slotList');
    if (!list) return;
    const card = document.createElement('div');
    card.className = 'slot-card';
    card.dataset.cat = e.cat;
    card.style.animation = 'fadeInUp 0.3s ease both';
    card.innerHTML = `
      <div class="slot-info">
        <div class="slot-embassy">${e.name}</div>
        <div class="slot-meta">${e.type} · Just reported</div>
      </div>
      <span class="badge ${e.badge}">${e.label}</span>`;
    list.insertBefore(card, list.firstChild);
    // remove last if too many
    const cards = list.querySelectorAll('.slot-card');
    if (cards.length > 7) cards[cards.length - 1].remove();
  }, 14000);
});