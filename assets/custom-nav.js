(() => {
  // Eject Meteor Menu if its global ScriptTag injects into our nav bar.
  // Meteor's app script runs store-wide regardless of app block removal.
  function ejectMeteorFromCustomNav() {
    const bar = document.querySelector('.custom-nav__bar');
    if (!bar) return;

    function clean() {
      const meteor = bar.querySelector('#meteor-desktop-nav');
      if (meteor) meteor.remove();
      bar.removeAttribute('data-meteor-mounted');
      bar.removeAttribute('data-meteor-platform');
    }

    clean();
    const observer = new MutationObserver(clean);
    observer.observe(bar, { childList: true, attributes: true });
  }

  function initCustomNav() {
    ejectMeteorFromCustomNav();

    const items = document.querySelectorAll('.custom-nav__item');
    if (!items.length) return;

    let closeTimer = null;

    function closeAll(except) {
      items.forEach((item) => {
        if (item === except) return;
        item.classList.remove('custom-nav__item--open');
        const link = item.querySelector('.custom-nav__link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    }

    function open(item) {
      clearTimeout(closeTimer);
      closeAll(item);
      item.classList.add('custom-nav__item--open');
      const link = item.querySelector('.custom-nav__link');
      if (link) link.setAttribute('aria-expanded', 'true');
    }

    function close(item) {
      closeTimer = setTimeout(() => {
        item.classList.remove('custom-nav__item--open');
        const link = item.querySelector('.custom-nav__link');
        if (link) link.setAttribute('aria-expanded', 'false');
      }, 120);
    }

    items.forEach((item) => {
      const link = item.querySelector('.custom-nav__link');
      const dropdown = item.querySelector('.custom-nav__dropdown');
      if (!dropdown) return;

      item.addEventListener('mouseenter', () => open(item));
      item.addEventListener('mouseleave', () => close(item));

      // Keep open when mouse re-enters the dropdown itself
      dropdown.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      dropdown.addEventListener('mouseleave', () => close(item));

      // Keyboard: Enter/Space toggles; Escape closes
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = item.classList.contains('custom-nav__item--open');
          if (isOpen) {
            close(item);
            clearTimeout(closeTimer);
            item.classList.remove('custom-nav__item--open');
            link.setAttribute('aria-expanded', 'false');
          } else {
            open(item);
            // Focus first tile
            const firstTile = dropdown.querySelector('.custom-nav__tile');
            if (firstTile) firstTile.focus();
          }
        }
        if (e.key === 'Escape') {
          item.classList.remove('custom-nav__item--open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });

      // Trap Escape inside dropdown back to trigger
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('custom-nav__item--open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-nav__item')) {
        closeAll();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomNav);
  } else {
    initCustomNav();
  }
})();
