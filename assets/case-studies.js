/**
 * case-studies.js
 * Handles: category pills (built from data), search filter, pagination.
 * Same pattern as specification-sheets.js with pills built from DOM
 * data attributes (like tutorials.js).
 */

(function () {
  'use strict';

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const grid       = document.getElementById('cs-grid');
  const pillsWrap  = document.getElementById('cs-pills');
  const searchEl   = document.getElementById('cs-search');
  const noResults  = document.getElementById('cs-no-results');
  const pagination = document.getElementById('cs-pagination');

  if (!grid) return; // no case studies on page

  // ── Config ───────────────────────────────────────────────────────────────────
  const ITEMS_PER_PAGE = parseInt(grid.dataset.perPage || '9', 10);

  // ── State ────────────────────────────────────────────────────────────────────
  let activeCategory = 'All';
  let searchQuery    = '';
  let currentPage    = 1;

  const allCards = Array.from(grid.querySelectorAll('.cs-card'));

  // ── Build category pills from card data attributes ───────────────────────────
  // Categories come from the rendered DOM — no extra Liquid loop needed.
  (function buildPills() {
    const seen = new Set();
    const cats = ['All'];

    allCards.forEach((card) => {
      const cat = card.dataset.category;
      if (cat && !seen.has(cat)) { seen.add(cat); cats.push(cat); }
    });

    // Only show pills if there are multiple categories worth filtering
    if (cats.length <= 2) {
      // Single category — pills add no value, hide the container
      if (pillsWrap) pillsWrap.style.display = 'none';
      return;
    }

    cats.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'cs-pill' + (cat === 'All' ? ' cs-pill--active' : '');
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        currentPage    = 1;
        document.querySelectorAll('.cs-pill').forEach((p) => {
          p.classList.toggle('cs-pill--active', p.dataset.cat === cat);
        });
        render();
      });
      pillsWrap.appendChild(btn);
    });
  })();

  // ── Filter ───────────────────────────────────────────────────────────────────
  function getFiltered() {
    const q = searchQuery.toLowerCase();
    return allCards.filter((card) => {
      const catOk    = activeCategory === 'All' || card.dataset.category === activeCategory;
      const searchOk = !q || (card.dataset.title || '').includes(q);
      return catOk && searchOk;
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  function render() {
    const filtered   = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1)          currentPage = 1;

    const start   = (currentPage - 1) * ITEMS_PER_PAGE;
    const visible = new Set(filtered.slice(start, start + ITEMS_PER_PAGE));

    allCards.forEach((card) => { card.hidden = !visible.has(card); });

    if (noResults) noResults.hidden = filtered.length > 0;

    buildPagination(totalPages);
  }

  // ── Pagination ───────────────────────────────────────────────────────────────
  function buildPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    // Prev
    const prev = makeBtn('', 'cs-page-btn', currentPage === 1);
    prev.setAttribute('aria-label', 'Previous page');
    prev.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
    prev.addEventListener('click', () => { currentPage--; render(); scrollToGrid(); });
    pagination.appendChild(prev);

    // Page numbers with smart ellipsis
    getPageRange(currentPage, totalPages).forEach((p) => {
      if (p === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '…';
        ellipsis.style.cssText = 'display:inline-flex;align-items:center;padding:0 0.25rem;font-size:1.4rem;color:var(--cs-grey);';
        pagination.appendChild(ellipsis);
      } else {
        const btn = makeBtn(p, 'cs-page-btn' + (p === currentPage ? ' cs-page-btn--active' : ''), false);
        btn.setAttribute('aria-label', `Page ${p}`);
        if (p === currentPage) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => { currentPage = p; render(); scrollToGrid(); });
        pagination.appendChild(btn);
      }
    });

    // Next
    const next = makeBtn('', 'cs-page-btn', currentPage === totalPages);
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

  function getPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
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

  function scrollToGrid() {
    if (!grid) return;
    const header = document.querySelector('.section-header');
    const hh = header ? header.getBoundingClientRect().height : 0;
    const top = grid.getBoundingClientRect().top + window.scrollY - hh - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  // ── Search listener ──────────────────────────────────────────────────────────
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      searchQuery = searchEl.value.trim();
      currentPage = 1;
      render();
    });
  }

  // ── Initial render ───────────────────────────────────────────────────────────
  render();

})();
