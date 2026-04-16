/**
 * knowledge-center.js
 * Handles sticky nav active state (scroll + click) and spec sheet search.
 */

(function () {
  'use strict';

  const NAV_OFFSET = 80; // px — accounts for sticky nav height

  // ── Nav buttons & section targets ──────────────────────────────────────────
  const navButtons = document.querySelectorAll('.kc-nav-btn');
  const sectionIds = Array.from(navButtons).map((btn) => btn.dataset.target);

  // ── Scroll-to on click ──────────────────────────────────────────────────────
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Active state via IntersectionObserver ───────────────────────────────────
  const setActive = (id) => {
    navButtons.forEach((btn) => {
      const isActive = btn.dataset.target === id;
      btn.classList.toggle('kc-nav-btn--active', isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: `-${NAV_OFFSET}px 0px -55% 0px` }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ── Spec sheet search ───────────────────────────────────────────────────────
  const searchInput = document.getElementById('kc-spec-search');
  const specsGrid   = document.getElementById('kc-specs-grid');
  const noResults   = document.getElementById('kc-no-results');

  if (searchInput && specsGrid) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const cards = specsGrid.querySelectorAll('.kc-spec-card');
      let visibleCount = 0;

      cards.forEach((card) => {
        const title = card.dataset.title || '';
        const part  = card.dataset.part  || '';
        const match = title.includes(query) || part.includes(query);
        card.hidden = !match;
        if (match) visibleCount++;
      });

      if (noResults) noResults.hidden = visibleCount > 0;
    });
  }
})();
