// VisaPulse — Timelines JS

let activeFilters = { visa: 'all', country: 'all', outcome: 'all', date: 'all' };

function setupFilter(groupId, key) {
  document.getElementById(groupId)?.querySelectorAll('.sfilter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(groupId).querySelectorAll('.sfilter').forEach(b => b.classList.remove('sfilter-on'));
      btn.classList.add('sfilter-on');
      activeFilters[key] = btn.dataset.val;
      applyFilters();
    });
  });
}

function applyFilters() {
  const cards = document.querySelectorAll('.tl-full-card');
  let shown = 0;

  cards.forEach(card => {
    const visa = card.dataset.visa;
    const country = card.dataset.country;
    const outcome = card.dataset.outcome;

    const visaMatch = activeFilters.visa === 'all' || card.dataset.visa === activeFilters.visa;
    const countryMatch = activeFilters.country === 'all' || card.dataset.country === activeFilters.country;
    const outcomeMatch = activeFilters.outcome === 'all' || card.dataset.outcome === activeFilters.outcome;

    if (visaMatch && countryMatch && outcomeMatch) {
      card.classList.remove('hidden');
      shown++;
    } else {
      card.classList.add('hidden');
    }
  });

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = `Showing ${shown} timeline${shown !== 1 ? 's' : ''}`;

  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.style.display = shown === 0 ? 'block' : 'none';

  // Update compare banner
  updateCompareBanner();
}

function updateCompareBanner() {
  const banner = document.getElementById('compareBanner');
  const titleEl = document.getElementById('cbTitle');
  if (!banner || !titleEl) return;

  const visaLabels = {
    'uk-sw': 'UK Skilled Worker',
    'uk-student': 'UK Student',
    'schengen': 'Schengen',
    'us-b1b2': 'US B1/B2',
    'us-f1': 'US F1',
    'canada': 'Canada PR'
  };
  const countryLabels = {
    'nigeria': 'Nigeria', 'ghana': 'Ghana',
    'kenya': 'Kenya', 'india': 'India', 'pakistan': 'Pakistan'
  };

  let titleParts = [];
  if (activeFilters.visa !== 'all') titleParts.push(visaLabels[activeFilters.visa] || activeFilters.visa);
  if (activeFilters.country !== 'all') titleParts.push(countryLabels[activeFilters.country] || activeFilters.country);

  if (titleParts.length > 0) {
    titleEl.textContent = titleParts.join(' · ');

    // Calculate avg from visible approved cards
    const visibleCards = [...document.querySelectorAll('.tl-full-card:not(.hidden)')];
    const approvedDays = visibleCards
      .filter(c => c.dataset.outcome === 'approved' && c.dataset.days)
      .map(c => parseInt(c.dataset.days))
      .filter(d => !isNaN(d));

    if (approvedDays.length > 0) {
      const avg = Math.round(approvedDays.reduce((a, b) => a + b, 0) / approvedDays.length);
      const min = Math.min(...approvedDays);
      const max = Math.max(...approvedDays);
      const nums = banner.querySelectorAll('.cb-num');
      if (nums[0]) nums[0].textContent = avg;
      if (nums[1]) nums[1].textContent = min;
      if (nums[2]) nums[2].textContent = max;
    }
  }
}

function sortTimelines(val) {
  const list = document.getElementById('tlPageList');
  if (!list) return;
  const cards = [...list.querySelectorAll('.tl-full-card')];

  cards.sort((a, b) => {
    const da = parseInt(a.dataset.days) || 0;
    const db = parseInt(b.dataset.days) || 0;
    if (val === 'fastest') return da - db;
    if (val === 'slowest') return db - da;
    return 0; // recent: keep DOM order
  });

  cards.forEach(c => list.appendChild(c));
}

window.addEventListener('DOMContentLoaded', () => {
  setupFilter('visaFilter', 'visa');
  setupFilter('countryFilter', 'country');
  setupFilter('outcomeFilter', 'outcome');
  setupFilter('dateFilter', 'date');
  applyFilters();
});