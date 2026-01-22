class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener(
      'transitionend',
      () => {
        this.notification.focus();
        trapFocus(this.notification);
      },
      { once: true }
    );

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section) => {
      const element = document.getElementById(section.id);
      const sectionHtml = parsedState.sections[section.id];
      if (element && sectionHtml) {
        try {
          element.innerHTML = this.getSectionInnerHTML(sectionHtml, section.selector);
        } catch (e) {
          console.error('Error rendering section:', section.id, e);
        }
      }
    });

    // Update recommended section separately (fetch from section)
    this.updateRecommendedSection();

    if (this.header) this.header.reveal();
    this.open();
  }

  updateRecommendedSection() {
    const recommendedContainer = document.getElementById('cart-notification-recommended');
    if (!recommendedContainer) return;

    fetch(window.location.pathname + '?sections=cart-notification-recommended')
      .then(response => response.json())
      .then(sections => {
        if (sections['cart-notification-recommended']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(sections['cart-notification-recommended'], 'text/html');
          const newContent = doc.querySelector('.shopify-section');
          if (newContent) {
            recommendedContainer.innerHTML = newContent.innerHTML;
          }
        }
      })
      .catch(error => {
        console.error('Error updating recommended section:', error);
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-notification-button',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const element = doc.querySelector(selector);
    if (!element) {
      // Fallback to .shopify-section if specific selector not found
      const fallback = doc.querySelector('.shopify-section');
      return fallback ? fallback.innerHTML : '';
    }
    return element.innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);

// Function to add recommended product to cart from notification
function addRecommendedProductToCart(button) {
  const variantId = button.dataset.variantId;
  if (!variantId) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Adding...';

  const formData = {
    items: [{
      id: parseInt(variantId),
      quantity: 1
    }]
  };

  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    // Fetch updated sections
    const sectionsToFetch = ['cart-notification-product', 'cart-notification-button', 'cart-icon-bubble'];
    const sectionsUrl = sectionsToFetch.map(s => `sections=${s}`).join('&');

    return fetch(window.Shopify.routes.root + `?${sectionsUrl}`)
      .then(res => res.json())
      .then(sections => {
        // Update cart notification product section
        const productSection = document.getElementById('cart-notification-product');
        if (productSection && sections['cart-notification-product']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(sections['cart-notification-product'], 'text/html');
          const newContent = doc.querySelector('.shopify-section');
          if (newContent) {
            productSection.innerHTML = newContent.innerHTML;
          }
        }

        // Update cart button
        const buttonSection = document.getElementById('cart-notification-button');
        if (buttonSection && sections['cart-notification-button']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(sections['cart-notification-button'], 'text/html');
          const newContent = doc.querySelector('.shopify-section');
          if (newContent) {
            buttonSection.innerHTML = newContent.innerHTML;
          }
        }

        // Update cart icon bubble
        const iconBubble = document.getElementById('cart-icon-bubble');
        if (iconBubble && sections['cart-icon-bubble']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(sections['cart-icon-bubble'], 'text/html');
          const newContent = doc.querySelector('.shopify-section');
          if (newContent) {
            iconBubble.innerHTML = newContent.innerHTML;
          }
        }
      });
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
    button.disabled = false;
    button.textContent = originalText;
  });
}
