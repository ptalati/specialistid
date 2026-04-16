/**
 * knowledge-center.js
 * Handles sticky nav active state (scroll + click) and spec sheet search.
 */

(function () {
  'use strict';

  // ── Header height tracking ──────────────────────────────────────────────────
  const header = document.querySelector('.section-header');

  const setHeaderOffset = () => {
    const h = header ? Math.round(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--kc-header-h', `${h}px`);
  };

  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);

  // Re-measure after a short delay to catch any header animations on load
  setTimeout(setHeaderOffset, 300);

  const kcNav = document.querySelector('.kc-nav-wrapper');
  const NAV_OFFSET = () => {
    const hh = header ? Math.round(header.getBoundingClientRect().height) : 0;
    const nh = kcNav  ? Math.round(kcNav.getBoundingClientRect().height)  : 0;
    return hh + nh + 8;
  };

  // ── Nav buttons & section targets ──────────────────────────────────────────
  const navButtons = document.querySelectorAll('.kc-nav-btn');
  const sectionIds = Array.from(navButtons).map((btn) => btn.dataset.target);

  // ── Active state ────────────────────────────────────────────────────────────
  const setActive = (id) => {
    navButtons.forEach((btn) => {
      btn.classList.toggle('kc-nav-btn--active', btn.dataset.target === id);
    });
  };

  // ── Scroll-to on click ──────────────────────────────────────────────────────
  // Suppress the IntersectionObserver during programmatic scroll and on initial
  // load so it doesn't override the default active state.
  let scrollingTimer = null;
  let isScrolling = true; // suppress on load

  // Set first tab active by default, then release observer after render settles
  setActive(sectionIds[0]);
  setTimeout(() => { isScrolling = false; }, 600);

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      // Set active immediately from the click
      setActive(btn.dataset.target);
      isScrolling = true;

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET();
      window.scrollTo({ top, behavior: 'smooth' });

      // Re-enable observer once scroll settles (~800ms is enough for smooth scroll)
      clearTimeout(scrollingTimer);
      scrollingTimer = setTimeout(() => { isScrolling = false; }, 800);
    });
  });

  // ── Active state via IntersectionObserver (scroll-based) ────────────────────
  const getObserverMargin = () => {
    const hh = header ? Math.round(header.getBoundingClientRect().height) : 0;
    const nh = kcNav  ? Math.round(kcNav.getBoundingClientRect().height)  : 0;
    return `${hh + nh}px`;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return; // ignore during click-triggered scroll
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: `-${getObserverMargin()} 0px -50% 0px` }
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
