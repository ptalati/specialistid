/**
 * specification-sheets.js
 * Handles: search, category filter, client-side pagination, mobile sidebar toggle.
 */

(function () {
  'use strict';

  // ── Header height offset ─────────────────────────────────────────────────────
  // Sets --ss-header-h so the sidebar's sticky top accounts for the site header.
  const header = document.querySelector('.section-header');

  const setHeaderOffset = () => {
    const h = header ? Math.round(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--ss-header-h', `${h}px`);
  };

  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);
  setTimeout(setHeaderOffset, 300); // catch any header animation on load

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const grid       = document.getElementById('ss-grid');
  const noResults  = document.getElementById('ss-no-results');
  const pagination = document.getElementById('ss-pagination');
  const searchEl   = document.getElementById('ss-search');
  const radios     = document.querySelectorAll('.ss-radio');
  const radioLabels = document.querySelectorAll('.ss-radio-label');
  const filterToggle = document.getElementById('ss-filter-toggle');
  const sidebar    = document.getElementById('ss-sidebar');

  if (!grid) return; // no specs on page — nothing to do

  // ── Config ───────────────────────────────────────────────────────────────────
  const ITEMS_PER_PAGE = parseInt(grid.dataset.perPage || '12', 10);

  // ── State ────────────────────────────────────────────────────────────────────
  let activeCategory = 'All';
  let searchQuery    = '';
  let currentPage    = 1;

  const allCards = Array.from(grid.querySelectorAll('.ss-card'));

  // ── Filter ───────────────────────────────────────────────────────────────────
  function getFiltered() {
    const q = searchQuery.toLowerCase();
    return allCards.filter((card) => {
      const catOk = activeCategory === 'All' || card.dataset.category === activeCategory;
      const searchOk = !q
        || (card.dataset.title || '').includes(q)
        || (card.dataset.sku   || '').includes(q);
      return catOk && searchOk;
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  function render() {
    const filtered   = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    // Clamp page
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1)          currentPage = 1;

    const start   = (currentPage - 1) * ITEMS_PER_PAGE;
    const visible = new Set(filtered.slice(start, start + ITEMS_PER_PAGE));

    // Show / hide cards
    allCards.forEach((card) => { card.hidden = !visible.has(card); });

    // No-results state
    if (noResults) {
      noResults.hidden = filtered.length > 0;
    }

    // Rebuild pagination
    buildPagination(totalPages);
  }

  // ── Pagination builder ───────────────────────────────────────────────────────
  function buildPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Prev button
    const prev = makeBtn('', 'ss-page-btn ss-page-btn--arrow', currentPage === 1);
    prev.setAttribute('aria-label', 'Previous page');
    prev.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
    prev.addEventListener('click', () => { currentPage--; render(); scrollToGrid(); });
    pagination.appendChild(prev);

    // Page number buttons
    // Always show first, last, current ±1, with ellipsis where needed
    const pages = getPageRange(currentPage, totalPages);

    pages.forEach((p) => {
      if (p === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '…';
        ellipsis.className = 'ss-page-ellipsis';
        ellipsis.style.cssText = 'display:inline-flex;align-items:center;padding:0 0.25rem;font-size:1.4rem;color:var(--ss-grey);';
        pagination.appendChild(ellipsis);
      } else {
        const btn = makeBtn(p, 'ss-page-btn' + (p === currentPage ? ' ss-page-btn--active' : ''), false);
        btn.setAttribute('aria-label', `Page ${p}`);
        if (p === currentPage) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => { currentPage = p; render(); scrollToGrid(); });
        pagination.appendChild(btn);
      }
    });

    // Next button
    const next = makeBtn('', 'ss-page-btn ss-page-btn--arrow', currentPage === totalPages);
    next.setAttribute('aria-label', 'Next page');
    next.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';
    next.addEventListener('click', () => { currentPage++; render(); scrollToGrid(); });
    pagination.appendChild(next);
  }

  function makeBtn(label, className, disabled) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = className;
    btn.disabled = disabled;
    return btn;
  }

  // Produces a smart page range: [1, …, n-1, n, n+1, …, last]
  function getPageRange(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = new Set([1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total));
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    let prev = 0;
    for (const p of sorted) {
      if (p - prev > 1) result.push('…');
      result.push(p);
      prev = p;
    }
    return result;
  }

  // Scroll back to the top of the grid when paginating
  function scrollToGrid() {
    if (!grid) return;
    const header = document.querySelector('.section-header');
    const hh = header ? header.getBoundingClientRect().height : 0;
    const top = grid.getBoundingClientRect().top + window.scrollY - hh - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  // ── Radio active text highlight ──────────────────────────────────────────────
  // The sibling selector in CSS can't easily reach the label's text span,
  // so we toggle a class on the label via JS instead.
  function updateRadioHighlight() {
    radioLabels.forEach((label) => {
      const radio = label.querySelector('.ss-radio');
      const text  = label.querySelector('.ss-radio-text');
      if (!radio || !text) return;
      if (radio.checked) {
        text.classList.add('ss-radio-text--active');
      } else {
        text.classList.remove('ss-radio-text--active');
      }
    });
  }

  // ── Event listeners ──────────────────────────────────────────────────────────

  // Search
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      searchQuery = searchEl.value.trim();
      currentPage = 1;
      render();
    });
  }

  // Category radios
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      activeCategory = radio.value;
      currentPage    = 1;
      updateRadioHighlight();
      render();
    });
  });

  // Mobile filter toggle
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('ss-sidebar--open');
      filterToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ── Initial render ───────────────────────────────────────────────────────────
  updateRadioHighlight();
  render();

})();
