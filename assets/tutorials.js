/**
 * tutorials.js
 * Handles: category pills (built from data), search filter,
 * video modal with YouTube/Vimeo embed, ESC + backdrop close.
 */

(function () {
  'use strict';

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const grid       = document.getElementById('tr-grid');
  const pillsWrap  = document.getElementById('tr-pills');
  const searchEl   = document.getElementById('tr-search');
  const noResults  = document.getElementById('tr-no-results');

  const modal      = document.getElementById('tr-modal');
  const backdrop   = document.getElementById('tr-modal-backdrop');
  const closeBtn   = document.getElementById('tr-modal-close');
  const iframe     = document.getElementById('tr-modal-iframe');
  const modalTitle = document.getElementById('tr-modal-title');
  const modalDesc  = document.getElementById('tr-modal-desc');
  const modalMeta  = document.getElementById('tr-modal-meta');

  if (!grid) return; // no tutorials on page

  const allCards = Array.from(grid.querySelectorAll('.tr-card'));

  // ── State ────────────────────────────────────────────────────────────────────
  let activeCategory = 'All';
  let searchQuery    = '';

  // ── Build category pills from rendered card data ─────────────────────────────
  // Avoids a second Liquid loop — categories come straight from the DOM.
  (function buildPills() {
    const seen = new Set();
    const cats = ['All'];

    allCards.forEach((card) => {
      const cat = card.dataset.category;
      if (cat && !seen.has(cat)) { seen.add(cat); cats.push(cat); }
    });

    cats.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'tr-pill' + (cat === 'All' ? ' tr-pill--active' : '');
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        document.querySelectorAll('.tr-pill').forEach((p) => {
          p.classList.toggle('tr-pill--active', p.dataset.cat === cat);
        });
        render();
      });
      pillsWrap.appendChild(btn);
    });
  })();

  // ── Filter + render ──────────────────────────────────────────────────────────
  function render() {
    const q = searchQuery.toLowerCase();
    let visibleCount = 0;

    allCards.forEach((card) => {
      const catOk    = activeCategory === 'All' || card.dataset.category === activeCategory;
      const searchOk = !q || (card.dataset.title || '').includes(q);
      const show     = catOk && searchOk;
      card.hidden    = !show;
      if (show) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
  }

  // Search listener
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      searchQuery = searchEl.value.trim();
      render();
    });
  }

  // ── Video embed URL conversion ───────────────────────────────────────────────
  // Accepts standard YouTube / Vimeo watch URLs and converts to embed format.
  // Falls back to the raw URL if no pattern matches (e.g. direct .mp4 links).
  function getEmbedUrl(url) {
    if (!url) return '';

    // YouTube: youtube.com/watch?v=ID  or  youtu.be/ID
    const yt = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`;

    // Vimeo: vimeo.com/ID  or  vimeo.com/channels/.../ID
    const vi = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    if (vi) return `https://player.vimeo.com/video/${vi[1]}?autoplay=1&title=0&byline=0`;

    // Direct file / already an embed URL — use as-is
    return url;
  }

  // ── Modal ────────────────────────────────────────────────────────────────────
  function openModal(card) {
    const embedUrl = getEmbedUrl(card.dataset.videoUrl);

    // Populate content
    modalTitle.textContent = card.dataset.displayTitle || '';
    modalDesc.textContent  = card.dataset.description  || '';

    // Meta row: duration · views · category badge
    const parts = [];
    if (card.dataset.duration) {
      parts.push(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${escapeHtml(card.dataset.duration)}`);
    }
    if (card.dataset.views) {
      if (parts.length) parts.push('<span class="tr-modal-meta-sep">·</span>');
      parts.push(`${escapeHtml(card.dataset.views)} views`);
    }
    if (card.dataset.category) {
      if (parts.length) parts.push('<span class="tr-modal-meta-sep">·</span>');
      parts.push(`<span class="tr-modal-meta-cat">${escapeHtml(card.dataset.category)}</span>`);
    }
    modalMeta.innerHTML = parts.join(' ');

    // Inject iframe src last (triggers load / autoplay)
    iframe.src = embedUrl;

    // Show modal + lock scroll
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Move focus to close button for a11y
    closeBtn.focus();
  }

  function closeModal() {
    iframe.src = '';          // stops video playback immediately
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // Open: thumbnail button or Watch Video button on any card
  allCards.forEach((card) => {
    const thumbBtn = card.querySelector('.tr-card-thumb');
    const watchBtn = card.querySelector('.tr-watch-btn');
    [thumbBtn, watchBtn].forEach((btn) => {
      if (btn) btn.addEventListener('click', () => openModal(card));
    });
  });

  // Close: close button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close: backdrop click
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close: ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ── Utility ──────────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Initial render ───────────────────────────────────────────────────────────
  render();

})();
