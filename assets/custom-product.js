/**
 * Shopify Theme JavaScript - Branch Version with JSON Support
 * This file runs automatically on all pages
 * 
 * Product Data Structure:
 * The code now reads from Shopify's product JSON instead of hidden fields.
 * 
 * To expose product JSON in your theme, add this to your product template:
 * <script id="ProductJson-{{ section.id }}" type="application/json">
 *   {{ product | json }}
 * </script>
 * 
 * Or expose it globally:
 * <script>
 *   window.product = {{ product | json }};
 * </script>
 * 
 * The code will automatically fallback to hidden fields if JSON data is not available.
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    TYPING_DELAY: 1000,
    ANIMATION_DELAY: 500,
    POPUP_DELAY: 3000,
    POPUP_HIDE_DELAY: 5000,
    API_URL: 'https://pratiktalati.com/custom/api.php',
    GOOGLE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0zkaovoP8dVMb1Dqbhfzno7Oprzkn03ONaYrwI6-fZKedWVcT93iXkFhwLFk4hLSNNZXHia0k3jtB/pub?gid=0&single=true&output=csv',
    ENTERPRISE_THRESHOLD: 1000, // Price threshold for enterprise vs retail contact
    HIDDEN_ROW_HEIGHT: 46, // Height of each hidden table row in pixels
    CUTOFF_HOUR: 15, // 3pm cutoff for same-day shipping
    STORE_TIMEZONE: 'America/New_York', // EST/EDT timezone
    DEBUG: false // Set to true to enable console logging
  };

  // Global variables (needed for cross-function access)
  let typingTimer;
  let rangeArray = [];
  let variantInventory;
  let continueAddingToCart = false;
  let productData = null; // Store product JSON data
  let productDataPromise = null; // Promise for loading product data

  // Debug logging helper
  function debugLog(...args) {
    if (CONFIG.DEBUG) {
      console.log(...args);
    }
  }

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Wait for DOM to be ready
  function initOnReady() {
    // Load product data from JSON
    loadProductData();

    const volPricingTableTarget = document.querySelector("#regios-dopp-volume-pricing-table-target");
    if (volPricingTableTarget && volPricingTableTarget.parentElement) {
      volPricingTableTarget.parentElement.classList.add("volume-pricing-table-wrapper");
    }

    // Volume pricing click handlers
    document.querySelectorAll(".volume_pricing_message, #discount-progress, .volume_pricing_info").forEach(el => {
      el.addEventListener('click', function() {
        const wrapper = document.querySelector(".volume-pricing-table-wrapper");
        if (wrapper) wrapper.classList.toggle("open");
      });
    });
    
    const bulkMessage = document.querySelector(".bulk-ordering-message");
    const wrapper = document.querySelector(".volume-pricing-table-wrapper");
    if (bulkMessage && wrapper) {
      wrapper.appendChild(bulkMessage);
    }

    // Warning popup handlers
    document.querySelectorAll(".warning-anchor").forEach(el => {
      el.addEventListener('click', function() {
        const popup = document.querySelector("#warning_popup");
        if (popup) popup.classList.toggle("hidden");
      });
    });

    const warningClose = document.querySelector("#warning_popup a.close");
    if (warningClose) {
      warningClose.addEventListener('click', function() {
        const popup = document.querySelector("#warning_popup");
        if (popup) popup.classList.toggle("hidden");
      });
    }
    
    // Primary button click handler
    document.querySelectorAll("button.button--primary").forEach(btn => {
      btn.addEventListener('click', function() {
        const spinner = document.querySelector(".loading-overlay__spinner");
        if (spinner) spinner.classList.remove("hidden");
        const secondaryBtn = document.querySelector("button.button--secondary");
        if (secondaryBtn) secondaryBtn.click();
        setTimeout(function() {
          if (spinner) spinner.classList.add("hidden");
        }, CONFIG.ANIMATION_DELAY);
      });
    });

    // Initial page load setup
    setTimeout(function() {
      document.body.classList.add('loaded');

      // Ensure product data is loaded
      loadProductData().then(() => {
        updateTablePrice();

        const isDiscontinued = productData?.metafields?.status?.discontinued ||
                              document.querySelector('[name="isDiscontinued"]')?.value;
        if (isDiscontinued && isDiscontinued !== "false") {
          const outOfStockBtn = document.querySelector("a.product-form__submit-out-of-stock");
          if (outOfStockBtn) outOfStockBtn.classList.add("discontinued");
        }
      });
    }, CONFIG.ANIMATION_DELAY);

    // Error message monitoring
    const errorMsg = document.querySelector(".product-form__error-message");
    if (errorMsg) {
      const observer = new MutationObserver(function() {
        var text = errorMsg.innerHTML;
        var variant_id = getVariantId();
        var colorSwatchEl = document.querySelector("div.color-swatch-wrapper.option-color");
        var variantName = '';
        if (colorSwatchEl) {
          const swatchItem = colorSwatchEl.querySelector(`[data-id='${variant_id}']`);
          if (swatchItem) variantName = swatchItem.dataset.option || '';
        }
        var titleEl = document.querySelector(".product__title h1");
        var title = titleEl ? titleEl.innerHTML : '';
        var generatedMessage = `All 0 ${title.trim()}${variant_id ? ` - ${variantName}` : ''} are in your cart.`;

        if (text === generatedMessage) {
          errorMsg.innerHTML = 'Sorry, this item is currently out of stock, please contact us...';
        }
      });

      observer.observe(errorMsg, { childList: true, characterData: true, subtree: true });
    }

    // Remove h1 elements from .custom-info-block > .rte
    const rteBlock = document.querySelector(".custom-info-block > .rte");
    if (rteBlock) {
      const h1Elements = rteBlock.querySelectorAll("h1");
      h1Elements.forEach(h1 => h1.remove());
    }

    // Animated background setup
    setTimeout(function() {
      const bg = document.querySelector(".animated-background");
      if (bg) bg.classList.remove('hidden');
    }, 300);

    // Color swatch and option clicks
    document.querySelectorAll("label.color-swatch, label.other-option").forEach(label => {
      label.addEventListener('click', function() {
        const bg = document.querySelector(".animated-background");
        if (bg) bg.classList.remove('hidden');
        var variant_id = this.dataset.id;

        // Ensure product data is loaded before processing
        loadProductData().then(() => {
          optionLogic(variant_id);
          setTimeout(() => updateTablePrice(), CONFIG.ANIMATION_DELAY);
        });
      });
    });

    // Out of stock click
    document.querySelectorAll("a.out-of-stock").forEach(link => {
      link.addEventListener('click', function() {
        var variant_id = getVariantId();
        if (variant_id !== undefined) {
          quantityLogic();
        }
      });
    });

    // Number input validation
    document.addEventListener('keydown', handleNumberInput);
    document.addEventListener('keyup', handleNumberInput);
    document.addEventListener('change', handleNumberInput);

    function handleNumberInput(e) {
      if (e.target.id === 'facility_code' || e.target.id === 'starting_number') {
        var max = parseInt(e.target.getAttribute('max'));
        var min = parseInt(e.target.getAttribute('min'));
        if (e.target.value > max) {
          e.target.value = max;
        } else if (e.target.value < min) {
          e.target.value = min;
        }
      }
    }

    // Quantity input change
    document.addEventListener('change', function(e) {
      if (e.target.classList.contains('quantity__input')) {
        doneTyping();
      }
    });

    // Quantity input keydown
    document.addEventListener('keydown', function(e) {
      if (e.target.classList.contains('quantity__input') && e.which === 13) {
        doneTyping();
      }
    });

    // Color swatch value update
    document.querySelectorAll(".color-swatch-wrapper .color-swatch-item").forEach(el => {
      el.addEventListener('click', function() {
        const labelEl = document.querySelector(".form__label .option-label");
        if (labelEl) labelEl.innerHTML = this.value;
        var variant_id = this.dataset.id;
        // Price is now handled by optionLogic
      });
    });

    // Address management
    document.querySelectorAll(".customer.addresses button.edit_button").forEach(btn => {
      btn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      });
    });

    document.querySelectorAll(".customer.addresses button.cancel_button").forEach(btn => {
      btn.addEventListener('click', function() {
        const editBtn = document.querySelector(".customer.addresses button.edit_button");
        if (editBtn) editBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.querySelectorAll(".add_address, .add_address_cancel").forEach(el => {
      el.addEventListener('click', function() {
        const wrapper = document.querySelector(".add-address-wrapper");
        if (wrapper) wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
      });
    });

    document.querySelectorAll("form.address-delete-form").forEach(form => {
      form.addEventListener('submit', function(event) {
        const deleteBtn = document.querySelector("button.delete_button");
        const msg = deleteBtn ? deleteBtn.dataset.confirmMessage : '';
        var confirmation = confirm(msg);
        if (!confirmation) {
          event.preventDefault();
        }
      });
    });

    // Image popup functionality
    document.querySelectorAll('.product-thumbnails-popup img').forEach(img => {
      img.addEventListener('click', function() {
        const fullImageSrc = this.dataset.fullImage;
        const popup = document.querySelector('#image-popup');
        const popupImg = document.querySelector('#popup-img');
        if (popupImg) popupImg.src = fullImageSrc;
        if (popup) popup.style.display = 'block';
      });
    });

    const closePopup = document.querySelector('#close-popup');
    const imagePopup = document.querySelector('#image-popup');
    if (closePopup) {
      closePopup.addEventListener('click', function() {
        if (imagePopup) imagePopup.style.display = 'none';
      });
    }

    if (imagePopup) {
      imagePopup.addEventListener('click', function() {
        this.style.display = 'none';
      });
    }

    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
      popupContent.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    }

    // Thumbnail slider
    document.querySelectorAll('.product-thumbnails li img').forEach(img => {
      img.addEventListener('click', function() {
        const newImageSrc = this.dataset.fullImage;
        const newImageAlt = this.getAttribute('alt');
        const mainImg = document.querySelector('.product-main-image img');
        if (mainImg) {
          mainImg.src = newImageSrc;
          mainImg.alt = newImageAlt;
        }
      });
    });

    // Thumbnail navigation
    var visibleThumbs = 4;
    var totalThumbs = document.querySelectorAll('.product-thumbnails li').length;
    var maxIndex = totalThumbs - visibleThumbs;
    var currentIndex = 0;

    document.querySelectorAll('.thumbnail-slider .next-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateThumbnailPosition();
        }
      });
    });

    document.querySelectorAll('.thumbnail-slider .prev-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          updateThumbnailPosition();
        }
      });
    });

    function updateThumbnailPosition() {
      const thumbs = document.querySelector('.product-thumbnails li');
      const thumbWidth = thumbs ? thumbs.offsetWidth + 10 : 0;
      const moveDistance = currentIndex * (thumbWidth * -1);
      const thumbContainer = document.querySelector('.product-thumbnails');
      if (thumbContainer) thumbContainer.style.transform = 'translateX(' + moveDistance + 'px)';
    }

    // Tooltip functionality has been moved to custom-tooltip.js

    // Initialize pricing and stock
    setTimeout(() => {
      loadProductData().then(() => {
        mapMsrpLogic();
        manageStockDisplay();

        // Initialize minimum quantity from metafields
        const initialVariantId = getVariantId();
        if (initialVariantId) {
          optionLogic(initialVariantId);
        }
      });
    }, 100);

    // Sliding support popup
    setTimeout(function() {
      const popup = document.querySelector("#supportPopup");
      const openBtn = document.querySelector("#openPopup");
      if (popup) popup.style.left = "10px";
      setTimeout(function() {
        if (popup) popup.style.left = "-300px";
        if (openBtn) openBtn.style.display = 'block';
      }, CONFIG.POPUP_HIDE_DELAY);
    }, CONFIG.POPUP_DELAY);

    const closePopupBtn = document.querySelector("#closePopup");
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function() {
        const popup = document.querySelector("#supportPopup");
        const openBtn = document.querySelector("#openPopup");
        if (popup) popup.style.left = "-300px";
        if (openBtn) openBtn.style.display = 'block';
      });
    }

    const openPopupBtn = document.querySelector("#openPopup");
    if (openPopupBtn) {
      openPopupBtn.addEventListener('click', function() {
        const popup = document.querySelector("#supportPopup");
        if (popup) popup.style.left = "10px";
        this.style.display = 'none';
      });
    }

    // FPD designer help popup
    document.querySelectorAll(".support-content-wrapper, .close-designer-help-form").forEach(el => {
      el.addEventListener('click', function() {
        const overlay = document.querySelector("#overlay-support");
        const helpPopup = document.querySelector("#fpd-designer-help-popup");
        if (overlay) overlay.classList.toggle('hidden');
        if (helpPopup) helpPopup.classList.toggle('hidden');
      });
    });

    // Tax exempt form
    document.querySelectorAll('.apply-here-anchor').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const formContainer = document.querySelector("#opt-tax-exempt-form-container");
        if (formContainer) formContainer.style.display = 'block';
        return false;
      });
    });

    // Feedback functionality
    document.querySelectorAll('.feedback-container > .positive').forEach(el => {
      el.addEventListener('click', function() {
        const positiveFeedback = document.querySelector(".positive-feedback");
        if (positiveFeedback) {
          positiveFeedback.classList.remove("hide");
          setTimeout(function() {
            positiveFeedback.classList.add("hide");
          }, 5000);
        }
      });
    });

    document.querySelectorAll('.feedback-container > .negative').forEach(el => {
      el.addEventListener('click', function() {
        const feedbackForm = document.querySelector("#feedback_form");
        if (feedbackForm) feedbackForm.classList.remove("hide");
      });
    });

    document.querySelectorAll('#feedback_form a.close').forEach(el => {
      el.addEventListener('click', function() {
        const feedbackForm = document.querySelector("#feedback_form");
        if (feedbackForm) feedbackForm.classList.add("hide");
      });
    });

    // Call initOnReady at the end of setup - simulating ready state
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnReady);
  } else {
    initOnReady();
  }

  // Load product data from JSON - returns a Promise
  function loadProductData() {
    // Return existing promise if already loading
    if (productDataPromise) {
      return productDataPromise;
    }

    // If already loaded, return resolved promise
    if (productData) {
      return Promise.resolve(productData);
    }

    productDataPromise = new Promise((resolve, reject) => {
      // Method 1: Try to get from ProductJson script tag
      const productJsonScript = document.querySelector('[id^="ProductJson-"]');
      if (productJsonScript) {
        try {
          productData = JSON.parse(productJsonScript.textContent);
          window.productData = productData;
          debugLog('Product data loaded from script tag');
          resolve(productData);
          return;
        } catch (e) {
          console.error('Error parsing ProductJson:', e);
        }
      }

      // Method 2: Try to get from window object (many themes expose this)
      if (window.product) {
        productData = window.product;
        window.productData = productData;
        debugLog('Product data loaded from window.product');
        resolve(productData);
        return;
      }

      // Method 3: Try to fetch from API if we have a product handle
      const productHandle = window.location.pathname.match(/\/products\/([^\/]+)/);
      if (productHandle && productHandle[1]) {
        fetch(`/products/${productHandle[1]}.json`)
          .then(response => response.json())
          .then(data => {
            productData = data.product;
            window.productData = productData;
            debugLog('Product data loaded from API');
            resolve(productData);
          })
          .catch(error => {
            console.error('Failed to load product JSON from API:', error);
            reject(error);
          });
      } else {
        // No product data available
        debugLog('No product data source found');
        resolve(null);
      }
    });

    return productDataPromise;
  }

  // Helper function to check if product data is loaded
  window.isProductDataLoaded = function() {
    return !!productData;
  };

  // Helper function to get current variant data
  window.getCurrentVariantData = function() {
    const variantId = getVariantId();
    return variantId ? getVariantData(variantId) : null;
  };

  // Get variant data from JSON
  function getVariantData(variantId) {
    if (!variantId) return null;
    if (!productData || !productData.variants) return null;
    
    // Ensure variantId is a string for comparison
    const variantIdStr = variantId.toString();
    
    return productData.variants.find(v => {
      // Handle both numeric and string IDs
      return v.id == variantIdStr || v.id === parseInt(variantIdStr);
    });
  }

  // Get product metafield value with support for both flat and nested structures
  function getProductMetafield(namespace, key) {
    if (!productData) return null;

    // Method 1: Check nested structure (productData.metafields.namespace.key)
    if (productData.metafields && typeof productData.metafields === 'object') {
      if (productData.metafields[namespace] && productData.metafields[namespace][key] !== undefined) {
        return productData.metafields[namespace][key];
      }
    }

    // Method 2: Check array structure (Shopify API format)
    if (Array.isArray(productData.metafields)) {
      const metafield = productData.metafields.find(m =>
        m.namespace === namespace && m.key === key
      );
      if (metafield) return metafield.value;
    }

    return null;
  }

  // Get variant metafield value with support for both flat and nested structures
  function getVariantMetafield(variantId, namespace, key) {
    const variant = getVariantData(variantId);
    if (!variant) return null;

    // Method 1: Check nested structure (variant.metafields.namespace.key)
    if (variant.metafields && typeof variant.metafields === 'object') {
      if (variant.metafields[namespace] && variant.metafields[namespace][key] !== undefined) {
        return variant.metafields[namespace][key];
      }
    }

    // Method 2: Check array structure (Shopify API format)
    if (Array.isArray(variant.metafields)) {
      const metafield = variant.metafields.find(m =>
        m.namespace === namespace && m.key === key
      );
      if (metafield) return metafield.value;
    }

    return null;
  }

  // Get collection data from page context (if available)
  function getCollectionMetafield(namespace, key) {
    // Try to get from window.collection if theme exposes it
    if (window.collection && window.collection.metafields) {
      if (typeof window.collection.metafields === 'object') {
        if (window.collection.metafields[namespace] && window.collection.metafields[namespace][key] !== undefined) {
          return window.collection.metafields[namespace][key];
        }
      }
      if (Array.isArray(window.collection.metafields)) {
        const metafield = window.collection.metafields.find(m =>
          m.namespace === namespace && m.key === key
        );
        if (metafield) return metafield.value;
      }
    }
    return null;
  }

  // Helper function to get variant price
  function getVariantPrice(variantId) {
    if (!variantId) {
      debugLog('getVariantPrice: No variantId provided');
      return 0;
    }

    const variant = getVariantData(variantId);
    if (!variant) {
      console.error(`getVariantPrice: Variant not found for ID: ${variantId}`);
      return 0;
    }

    if (variant.price === undefined || variant.price === null) {
      console.error(`getVariantPrice: Price not available for variant: ${variantId}`);
      return 0;
    }

    debugLog('Raw variant.price from JSON:', variant.price, 'for variant:', variantId);

    // Check if price is already in dollars (< 100) or in cents (>= 100)
    // Shopify's product.json API returns prices as strings like "1.58"
    // but ProductJson-* script tags return cents as numbers
    const priceValue = typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price;

    // If price is less than 100 and looks like dollars already, don't divide
    // This handles cases where Shopify returns "1.58" as a string
    if (priceValue < 100 && typeof variant.price === 'string') {
      debugLog('Price appears to be in dollars already:', priceValue);
      return priceValue;
    }

    // Otherwise treat as cents
    const finalPrice = priceValue / 100;
    debugLog('Converted price from cents:', finalPrice);
    return finalPrice;
  }

  // Helper function to get variant compare at price
  function getVariantCompareAtPrice(variantId) {
    if (!variantId) {
      debugLog('getVariantCompareAtPrice: No variantId provided');
      return 0;
    }

    const variant = getVariantData(variantId);
    if (!variant) {
      debugLog(`getVariantCompareAtPrice: Variant not found for ID: ${variantId}`);
      return 0;
    }

    if (!variant.compare_at_price) {
      debugLog(`getVariantCompareAtPrice: No compare_at_price for variant: ${variantId}`);
      return 0;
    }

    debugLog('Raw variant.compare_at_price from JSON:', variant.compare_at_price, 'for variant:', variantId);

    // Check if price is already in dollars or in cents (same logic as getVariantPrice)
    const priceValue = typeof variant.compare_at_price === 'string' ? parseFloat(variant.compare_at_price) : variant.compare_at_price;

    // If price is less than 100 and looks like dollars already, don't divide
    if (priceValue < 100 && typeof variant.compare_at_price === 'string') {
      debugLog('Compare price appears to be in dollars already:', priceValue);
      return priceValue;
    }

    // Otherwise treat as cents
    const finalPrice = priceValue / 100;
    debugLog('Converted compare price from cents:', finalPrice);
    return finalPrice;
  }

  // Core Functions
  function optionLogic(variant_id) {
    const variantIdInput = document.querySelector('input.current_variant_id');
    if (variantIdInput) variantIdInput.value = variant_id;
    
    // Get variant data from JSON
    const variant = getVariantData(variant_id);
    if (!variant) {
      console.error('Variant not found:', variant_id);
      return;
    }
    
    // Use variant data from JSON
    var sku = variant.sku || '';
    var price = getVariantPrice(variant_id);
    var price_num = price;
    var compare_at_price = getVariantCompareAtPrice(variant_id);
    var compare_at_price_num = compare_at_price;
    
    // Get custom data from metafields only
    var customPriceText = getVariantMetafield(variant_id, 'custom', 'price_text') || '';
    var qty = variant.inventory_quantity || 0;

    // Get min and increment from metafields with defaults
    // Priority: variant metafield -> product metafield -> default (1)
    // Try both 'c_f' (custom fields) and 'inventory' namespaces for backwards compatibility
    var min = parseInt(getVariantMetafield(variant_id, 'c_f', 'minimum')) ||
              parseInt(getProductMetafield('c_f', 'minimum')) || 1;
    var increment = parseInt(getVariantMetafield(variant_id, 'c_f', 'increment')) ||
                    parseInt(getProductMetafield('c_f', 'increment')) || 1;

    debugLog(`optionLogic for variant ${variant_id}: min=${min}, increment=${increment}, qty=${qty}, customPriceText=${customPriceText}`);

    const variantSkuEl = document.querySelector('span.variant-sku');
    if (variantSkuEl) variantSkuEl.innerHTML = sku;

    var percent_value = (((compare_at_price_num - price_num) * 100.0) / compare_at_price_num).toFixed(0);

    mapMsrpLogic(variant_id, price);
    manageStockDisplay(variant_id);
    quantityLogic();

    if (customPriceText != "") {
      const priceMinEl = document.querySelector('span.price-min');
      if (priceMinEl) priceMinEl.innerHTML = customPriceText;
      const customPriceEl = document.querySelector(".custom-price-text");
      if (customPriceEl) {
        customPriceEl.innerHTML = customPriceText;
        customPriceEl.classList.remove("hide");
      }
    } else {
      const customPriceEl = document.querySelector(".custom-price-text");
      if (customPriceEl) {
        customPriceEl.classList.add("hide");
        customPriceEl.innerHTML = "";
      }
    }

    if (min != increment) {
      const minQtyEl = document.querySelector(".minimum-quantity-text");
      if (minQtyEl) minQtyEl.classList.remove("hide");
    } else if (min == increment && min > 1) {
      const soldInPack = document.querySelector(".sold-in-pack-text");
      if (soldInPack) soldInPack.classList.remove("hide");
    } else {
      const minQtyEl = document.querySelector(".minimum-quantity-text");
      const soldInPack = document.querySelector(".sold-in-pack-text");
      if (minQtyEl) minQtyEl.classList.add("hide");
      if (soldInPack) soldInPack.classList.add("hide");
    }

    const minQtySpan = document.querySelector(".minimum_qty");
    if (minQtySpan) minQtySpan.innerHTML = min;

    const qtyInputs = document.querySelectorAll(".quantity__input");
    qtyInputs.forEach(input => {
      input.setAttribute('min', min);
      input.setAttribute('step', increment);
      input.setAttribute('value', min);
      input.value = min;

      // Validate only when user finishes typing (blur event)
      input.addEventListener('blur', function() {
        const currentValue = parseInt(this.value);
        if (isNaN(currentValue) || currentValue < min) {
          this.value = min;
        }
      });

      // Also validate on change event (when user confirms the value)
      input.addEventListener('change', function() {
        const currentValue = parseInt(this.value);
        if (isNaN(currentValue) || currentValue < min) {
          this.value = min;
        }
      });
    });

    const priceMinEl = document.querySelector('span.price-min');
    if (min > 1 && min != increment) {
      if (priceMinEl) {
        priceMinEl.classList.remove("hide");
        priceMinEl.innerHTML = '<span class="orange-bg price-min">Minimum Quantity ' + min + '</span>';
      }
    } else if(min == increment && min > 1) {
      if (priceMinEl) {
        priceMinEl.classList.remove("hide");
        priceMinEl.innerHTML = '<span class="green-font price-min">ea. <span class="orange-bg">Sold in Packs of ' + min + '</span></span>';
      }
    } else {
      if (priceMinEl) priceMinEl.classList.add("hide");
    }

    setTimeout(() => {
      updateTablePrice();
    }, 1000);
  }

  function getProductInventoryByLocation(variant_id) {
    if (variantInventory && variantInventory.variantId === variant_id.toString()) {
      return Promise.resolve(variantInventory);
    } else {
      variantInventory = undefined;
      
      var productId = productData?.id || document.querySelector('[name="product_id"]')?.value;
      if (!productId) return null;
      
      if (productId) {
        var postData = JSON.stringify({
          productId: productId
        });
    
        return fetch(CONFIG.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: postData
        })
        .then(response => response.json())
        .then(function(response) {
          if (response && response.product && response.product.variants) {
            variantInventory = response.product.variants.find(function(variant) {
              return variant.variantId == variant_id.toString();
            });
    
            if (variantInventory) {
              return variantInventory;
            } else {
              console.warn('Variant not found for variant_id:', variant_id);
              return null;
            }
          } else {
            console.error('Unexpected response structure:', response);
            return null;
          }
        })
        .catch(function(error) {
          console.error('Error calling API:', error);
          return null;
        });
      } else {
        console.error('Product ID not found.');
        return Promise.reject('Product ID not found.');
      }
    }
  }

  function getVariantId() {
    var variant_id = document.querySelector('input[name="Color"]:checked')?.dataset.variantid;
    if (variant_id === undefined) {
      variant_id = document.querySelector('input[name="Size"]:checked')?.dataset.variantid;
    }
    if (variant_id === undefined) {
      variant_id = document.querySelector('input[name="Layout"]:checked')?.dataset.variantid;
    }
    if (variant_id === undefined) {
      variant_id = document.querySelector('input[name="Pre-Printed"]:checked')?.dataset.variantid;
    }
    if (variant_id === undefined) {
      const variantCount = document.querySelectorAll('input[name="variant_id"]').length;
      if (variantCount === 1) {
        variant_id = document.querySelector('input[name="variant_id"]')?.value;
      }
    }
    if (variant_id === undefined) {
      variant_id = document.querySelector('input.color-swatch-item:checked')?.dataset.variantid;
    }
    if (variant_id === undefined) {
      variant_id = document.querySelector('input.current_variant_id')?.value;
    }
    return variant_id;
  }

  function manageStockDisplay(variant_id) {
    if (!variant_id) {
      variant_id = getVariantId();
      if (!variant_id) return;
    }

    const isDiscontinued = getProductMetafield('status', 'discontinued');
    if (isDiscontinued && isDiscontinued !== 'false' && isDiscontinued !== false) {
      const label2 = document.querySelector(".stock_label.available-2");
      const label3 = document.querySelector(".stock_label.available-3");
      if (label2) label2.classList.add("forcehidden");
      if (label3) {
        label3.classList.add("bottom-padding");
        label3.innerHTML = '';
      }
      return;
    }

    const qtySelector = document.querySelector('.quantity__input');
    const inputQty = parseInt(qtySelector?.value || '1');

    if (inputQty === 1) {
      const perItem = document.querySelector(".per-item-price");
      if (perItem) perItem.style.display = 'none';
    } else {
      const perItem = document.querySelector(".per-item-price");
      if (perItem) perItem.style.display = 'block';
    }
    
    // Get variant from JSON
    const variant = getVariantData(variant_id);
    
    getProductInventoryByLocation(variant_id)
      .then(function(variantInventory) {
        if (!variantInventory) return null;

        if (variantInventory) {
          var doralQty = variantInventory.inventoryLevels["Specialist ID"] || 0;

          var inventory_policy = variant?.inventory_policy || 'deny';

          // Get shipping and inventory info from metafields only
          var product_iscustom = getProductMetafield('product', 'is_custom');
          var product_shipping_info = getProductMetafield('shipping', 'info');
          var variant_shipping_info = getVariantMetafield(variant_id, 'shipping', 'info');
          var product_oos_lead_time = getProductMetafield('inventory', 'oos_lead_time');
          var variant_oos_lead_time = getVariantMetafield(variant_id, 'inventory', 'oos_lead_time');
          var collection_shipping_info = getCollectionMetafield('shipping', 'info');
          var qty = variant?.inventory_quantity || 0;
          var collection_additional_lead_time = getCollectionMetafield('inventory', 'additional_lead_time');
          var product_backordered_lead_time = getProductMetafield('inventory', 'backordered_lead_time');
          var variant_backordered_lead_time = getVariantMetafield(variant_id, 'inventory', 'backordered_lead_time');

          document.querySelectorAll(".stock_label.available-2").forEach(el => el.classList.add("forcehidden"));
          document.querySelectorAll(".stock_label.available-3").forEach(el => el.classList.add("bottom-padding"));

          var lead_time_text = "";
          
          if (doralQty + 1 > inputQty) {
            if (variant_shipping_info && variant_shipping_info !== '') {
              lead_time_text = variant_shipping_info;
            } else if (product_shipping_info && product_shipping_info !== '') {
              lead_time_text = product_shipping_info;
            } else if (collection_shipping_info && collection_shipping_info !== '') {
              lead_time_text = collection_shipping_info;
            } else {
              if (qty > 0) {
                document.querySelectorAll(".stock_label.available-2").forEach(el => el.classList.remove("forcehidden"));
                document.querySelectorAll(".stock_label.available-3").forEach(el => el.classList.remove("bottom-padding"));
                lead_time_text = 'Same day shipping if ordered by 3pm EST';
              } else {
                lead_time_text = 'Usually ships within 24 hours';
              }

              if (isAfterFriday3pmBeforeMonday()) {
                lead_time_text = 'Ships on Monday';
              }
            }
          } else if (product_iscustom === "1") {
            lead_time_text = 'Usually ships within 10-14 business days';
          } else if (variantInventory.inventoryQuantity + 1 > inputQty) {
            lead_time_text = 'Usually ships within 1-2 business days';
          } else {
            if (inventory_policy === 'deny') {
              document.querySelectorAll("button.product-form__submit").forEach(btn => btn.classList.add('out-of-stock'));
              lead_time_text = 'Out of stock';
            } else {
              document.querySelectorAll("button.product-form__submit").forEach(btn => btn.classList.remove('out-of-stock'));

              if (variant_oos_lead_time && variant_oos_lead_time !== '') {
                lead_time_text = variant_oos_lead_time;
              } else if (product_oos_lead_time && product_oos_lead_time !== '') {
                lead_time_text = product_oos_lead_time;
              } else {
                if (variant_backordered_lead_time !== '') {
                  lead_time_text = variant_backordered_lead_time;
                } else if (product_backordered_lead_time !== '') {
                  lead_time_text = product_backordered_lead_time;
                } else {
                  if (variantInventory.inventoryQuantity > 0) {
                    lead_time_text = `${variantInventory.inventoryQuantity} in stock. Order now for immediate shipping, Remainder ships within a few days.`;
                  } else {
                    lead_time_text = 'No confirmed stock, but usually ships within a few days';
                  }
                }
              }
            }
          }

          if (lead_time_text !== "") {
            document.querySelectorAll(".stock_label.available-3").forEach(el => el.innerHTML = lead_time_text);
            const leadTimeInput = document.querySelector("#lead_time");
            if (leadTimeInput) leadTimeInput.value = lead_time_text;
          }

          if (collection_additional_lead_time && collection_additional_lead_time !== '') {
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16,21h-2v-7h2V21z M15,11.5 c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S15.828,11.5,15,11.5z"></path></svg>';
            const label3 = document.querySelector(".stock_label.available-3");
            if (label3) {
              label3.innerHTML = lead_time_text + '<span class="additional-lead-time" title="' + collection_additional_lead_time + '">' + svg + '</span>';
            }
          }
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  }
  
  // Then run every minute (60000 ms)
  setInterval(() => {
    manageStockDisplay(null);
  }, 60000);

  function isAfterFriday3pmBeforeMonday() {
    // Get current time in store timezone using Intl API (handles DST automatically)
    const now = new Date();

    // Format the date in the store's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: CONFIG.STORE_TIMEZONE,
      weekday: 'short',
      hour: 'numeric',
      hour12: false
    });

    // Get the parts of the formatted date
    const parts = formatter.formatToParts(now);
    const weekday = parts.find(part => part.type === 'weekday')?.value;
    const hour = parseInt(parts.find(part => part.type === 'hour')?.value || '0');

    // Check Friday 3 PM or later
    if (weekday === 'Fri' && hour >= CONFIG.CUTOFF_HOUR) {
      return true;
    }
    // Saturday any time
    if (weekday === 'Sat') {
      return true;
    }
    // Sunday any time
    if (weekday === 'Sun') {
      return true;
    }

    return false;
  }

  function quantityLogic() {
    var variant_id = getVariantId();
    if (!variant_id) return;

    const variant = getVariantData(variant_id);
    if (!variant) return;

    var qty = variant?.inventory_quantity || 0;
    var current_qty = parseInt(document.querySelector(".quantity__input")?.value) || 0;
    var inventory_policy = variant?.inventory_policy || 'deny';

    manageStockDisplay();

    if (inventory_policy === 'continue') return;

    const currentQtyEl = document.querySelector('span.current_qty');
    if (currentQtyEl) currentQtyEl.innerHTML = qty;
    document.querySelectorAll(".quantity_warning span.qty-warning").forEach(el => el.classList.add("hide"));

    if (current_qty > qty) {
      setTimeout(function() {
        const submitBtn = document.querySelector(".product-form__submit");
        const submitSpan = submitBtn?.querySelector('span');
        if (submitSpan) submitSpan.innerHTML = "Add to cart";
        if (submitBtn) submitBtn.disabled = false;
      }, 700);
    }
  }

  function mapMsrpLogic(variant_id, price) {
    if (!variant_id) {
      variant_id = getVariantId();
      if (!variant_id) return;
    }
    
    // Use helper function to get price
    if (!price) {
      price = getVariantPrice(variant_id);
    }

    const isDiscontinued = getProductMetafield('status', 'discontinued');
    if (isDiscontinued && isDiscontinued !== 'false' && isDiscontinued !== false) {
      const priceDisplay = document.querySelector(".product-price-display");
      if (priceDisplay) priceDisplay.innerHTML = '';
      const perItem = document.querySelector(".per-item-price");
      if (perItem) perItem.style.display = 'none';
      return;
    }

    var qty = parseInt(document.querySelector(".quantity__input")?.value) || 1;
    const rewardPoints = document.querySelector('div.reward_points > span');
    var price_num = parseFloat(price);
    
    // Get pricing data using helper functions
    var compare_at_price_num = getVariantCompareAtPrice(variant_id);
    
    // Get MAP and MSRP values from metafields only
    var map_value_num = parseFloat(getVariantMetafield(variant_id, 'pricing', 'map_value')) || 0;
    var msrp_value_num = parseFloat(getVariantMetafield(variant_id, 'pricing', 'msrp_value')) || 0;

    // Product-level fallback (if variant doesn't have it)
    if (map_value_num === 0) {
      map_value_num = parseFloat(getProductMetafield('pricing', 'map_value')) || 0;
    }

    if (msrp_value_num === 0) {
      msrp_value_num = parseFloat(getProductMetafield('pricing', 'msrp_value')) || 0;
    }

    debugLog(`mapMsrpLogic for variant ${variant_id}: map=${map_value_num}, msrp=${msrp_value_num}`);

    var msrp_txt = '';
    var map_txt = '';
    var totalPrice = price_num * qty;

    if (price_num < map_value_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">Regular price: <s><span id="map-price">' + formatCurrency(map_value_num) + '</span></s></div>';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">Add to Cart for Price</div>';
      const rewardDiv = document.querySelector("div.reward_points");
      if (rewardDiv) rewardDiv.classList.add("hide");
    } else if (price_num >= map_value_num && price_num < msrp_value_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">MSRP: <s><span id="map-price">' + formatCurrency(msrp_value_num) + '</span></s></div>';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      const rewardDiv = document.querySelector("div.reward_points");
      if (rewardDiv) rewardDiv.classList.add("hide");
    } else if (price_num >= map_value_num && price_num >= msrp_value_num) {
      msrp_txt = '';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      const rewardDiv = document.querySelector("div.reward_points");
      if (rewardDiv) {
        rewardDiv.classList.remove("hide");
        if (rewardPoints) rewardPoints.innerHTML = totalPrice.toFixed(2);
      }
    } else {
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      const rewardDiv = document.querySelector("div.reward_points");
      if (rewardDiv) {
        rewardDiv.classList.remove("hide");
        if (rewardPoints) rewardPoints.innerHTML = totalPrice.toFixed(2);
      }
    }
    
    if (compare_at_price_num > 0 && compare_at_price_num > price_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">Regular Price: <s id="compare-at-price">' + formatCurrency(compare_at_price_num) + ' ea</s></div>';
      totalPrice = price_num * qty;
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      const rewardDiv = document.querySelector("div.reward_points");
      if (rewardDiv) {
        rewardDiv.classList.remove("hide");
        if (rewardPoints) rewardPoints.innerHTML = totalPrice.toFixed(2);
      }
    }

    if (price_num < map_value_num 
      || (price_num >= map_value_num && price_num < msrp_value_num) 
      || (compare_at_price_num > 0 && compare_at_price_num > price_num)) {
      if (price_num < map_value_num 
      || (price_num >= map_value_num && price_num < msrp_value_num)) {
        const wrapper = document.querySelector("div.total-price-wrapper");
        if (wrapper) wrapper.classList.add("hidden");
      }
      
      const actualPrice = document.querySelector(".actual-price");
      if (actualPrice) actualPrice.innerHTML = msrp_txt + map_txt;
    } else {
      const wrapper = document.querySelector("div.total-price-wrapper");
      if (wrapper) wrapper.classList.remove("hidden");
      const productPrice = document.querySelector(".product-price");
      if (productPrice) productPrice.innerHTML = formatCurrency(price_num) + ' each';
    }
    
    const totalPriceEl = document.querySelector(".total-price-wrapper .total-price");
    if (totalPriceEl) totalPriceEl.innerHTML = formatCurrency(totalPrice);

    updateTablePrice();

    if (qty === 1) {
      const perItem = document.querySelector(".per-item-price");
      if (perItem) perItem.style.display = 'none';
    } else {
      const perItem = document.querySelector(".per-item-price");
      if (perItem) perItem.style.display = 'block';
    }
  }

  function formatCurrency(amount, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  function doneTyping() {
    const qtyInput = document.querySelector('.quantity__input');
    const min = parseInt(qtyInput?.getAttribute('min')) || 1;
    let qty = parseInt((qtyInput?.value || '').replace(/\D/g, ''));
    const increment = parseInt(qtyInput?.getAttribute('step')) || 1;

    // If quantity is empty or invalid, set to minimum
    if (isNaN(qty) || qty < min) {
      qty = min;
      if (qtyInput) qtyInput.value = min;
    }

    const stock = parseInt(qtyInput?.getAttribute('max'));

    if (!isNaN(stock)) {
      if (stock > 0 && qty > stock) {
        if (qtyInput) qtyInput.value = stock;
        qty = stock;
      }
    }

    quantityLogic();
    mapMsrpLogic();
    updateTablePrice();

    // Final validation: ensure quantity is not less than minimum
    if (qty < min) {
      if (qtyInput) qtyInput.value = min;
    } else if (increment && !Number.isInteger(qty/increment)) {
      // Round to nearest valid increment, but not less than min
      const roundedQty = Math.max(min, increment * Math.round(qty/increment));
      if (qtyInput) qtyInput.value = roundedQty;
    }
  }


  // Window load events
  window.addEventListener('load', function() {
    // Ensure product data is loaded
    loadProductData().then(() => {
      handleWindowLoad();
    });
  });

  function handleWindowLoad() {
    const body = document.body;
    if (body.classList.contains("product") || body.classList.contains("product.fpd") || 
        body.classList.contains("product.fpd-dynamic") || body.classList.contains("product.custom-badge-buddies")) {
      setTimeout(() => updateTablePrice(), 200);
    }

    setTimeout(function() {
      // If we have product data, use it for SKU updates
      if (productData && productData.variants) {
        const sectionElements = document.querySelectorAll('[id^="shopify-section-"]');
        sectionElements.forEach((section) => {
          const variantSKU = section.querySelector('.variant-sku');
          const inputSelects = section.querySelectorAll('.single-option-selector');
          
          if (variantSKU && inputSelects.length > 0) {
            const inputValues = [];
            
            inputSelects.forEach((input) => {
              inputValues.push(input.value);
              input.addEventListener('change', (evt) => {
                const currentValue = evt.currentTarget.value.toString();
                const changedIndex = Array.from(inputSelects).indexOf(evt.target);
                inputValues[changedIndex] = currentValue;
                variantSKU.innerText = ' ';
                
                // Find matching variant
                productData.variants.forEach((variant) => {
                  if (JSON.stringify(variant.options) == JSON.stringify(inputValues)) {
                    variantSKU.innerText = variant.sku || '';
                  }
                });
              });
            });
          }
        });
      } else {
        // Fallback to original method if product data not available
        const productJson = document.querySelectorAll('[id^=ProductJson-]');
        if (productJson.length > 0) {
          productJson.forEach((product) => {
            const sectionId = product.id.replace("ProductJson-", "shopify-section-");
            const variantSKU = document.querySelector('#' + sectionId + ' .variant-sku');
            const inputSelects = document.querySelectorAll('#' + sectionId + ' .single-option-selector');
            const productInfo = JSON.parse(product.innerHTML);
            const inputValues = [];
            
            inputSelects.forEach((input) => {
              inputValues.push(input.value);
              input.addEventListener('change', (evt) => {
                const currentValue = evt.currentTarget.value.toString();
                const changedIndex = Array.from(inputSelects).indexOf(evt.target);
                inputValues[changedIndex] = currentValue;
                variantSKU.innerText = ' ';
                productInfo.variants.forEach((variant) => {
                  if (JSON.stringify(variant.options) == JSON.stringify(inputValues)) {
                    variantSKU.innerText = variant.sku;
                  }
                });
              });
            });
          });
        }
      }
    }, 100);
  }

  // Sticky header
  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('sticky-header.header-wrapper');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let navIsSticky = false;

    function toggleStickyNav() {
      const navHeight = nav.offsetHeight;
      const navBottom = nav.getBoundingClientRect().bottom;
      const shouldStick = navBottom <= 0 && window.scrollY > lastScrollY;
      const shouldUnstick = window.scrollY <= lastScrollY && window.scrollY <= navHeight;

      if (shouldStick && !navIsSticky) {
        nav.classList.add('sticky-nav');
        document.body.classList.add("sticky-nav-wrapper");
        navIsSticky = true;
      } else if (shouldUnstick && navIsSticky) {
        nav.classList.remove('sticky-nav');
        document.body.classList.remove("sticky-nav-wrapper");
        navIsSticky = false;
      }

      lastScrollY = window.scrollY;
    }

    // Debounce scroll events to improve performance
    window.addEventListener('scroll', debounce(toggleStickyNav, 10));
  });

  // Out of stock popup
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure product data is loaded
    if (window.location.pathname.includes('/products/')) {
      loadProductData().then(() => {
        initOutOfStockPopup();
      });
    } else {
      initOutOfStockPopup();
    }
  });

  function initOutOfStockPopup() {
    var productId = productData?.id;
    if (!productId) {
      debugLog('initOutOfStockPopup: No product ID available');
      return;
    }

    const disable_oos_popup = getProductMetafield('popup', 'disable_oos');
    if (disable_oos_popup === 'true' || disable_oos_popup === true) return;

    const variant_id = getVariantId();
    const variant = getVariantData(variant_id);

    const inventory_policy = variant?.inventory_policy || 'deny';
    const product_oos_lead_time = getProductMetafield('inventory', 'oos_lead_time') || '';
    const variant_oos_lead_time = getVariantMetafield(variant_id, 'inventory', 'oos_lead_time') || '';
    
    const addToCartButton = document.querySelector('[name="add"]');
    const quantityInput = document.querySelector('[name="quantity"]');
    const maxQuantity = variant?.inventory_quantity || 0;
    const popup = document.getElementById('out-of-stock-popup');
    const overlay = document.getElementById('overlay');
    const closePopup = document.getElementById('close-popup2');
    const continue_add_to_cart = document.getElementById('continue-add-to-cart');

    if (continue_add_to_cart) {
      if (inventory_policy !== 'continue') {
        continue_add_to_cart.classList.add('hidden');
      } else {
        continue_add_to_cart.classList.remove('hidden');
      }

      continue_add_to_cart.addEventListener('click', () => {
        continueAddingToCart = true;
        addToCartButton.click();
      });
    }

    if (addToCartButton) {
      addToCartButton.addEventListener('click', (event) => {
        if (product_oos_lead_time !== "" || variant_oos_lead_time !== "") return;
        
        const quantity = parseInt(quantityInput?.value, 10);
    
        if (!continueAddingToCart && quantity > maxQuantity) {
          event.preventDefault();
          if (popup) popup.classList.remove('hidden');
          if (overlay) overlay.classList.remove('hidden');
    
          const unitPrice = getVariantPrice(variant_id);
          if (quantityInput.value * unitPrice > CONFIG.ENTERPRISE_THRESHOLD) {
            const retailContact = document.querySelector(".retail-contact");
            const enterpriseContact = document.querySelector(".enterprise-contact");
            if (retailContact) retailContact.classList.add("hide");
            if (enterpriseContact) enterpriseContact.classList.remove("hide");
          } else {
            const retailContact = document.querySelector(".retail-contact");
            const enterpriseContact = document.querySelector(".enterprise-contact");
            if (retailContact) retailContact.classList.remove("hide");
            if (enterpriseContact) enterpriseContact.classList.add("hide");
          }
        }
      });
    }

    if (closePopup) {
      closePopup.addEventListener('click', () => {
        if (popup) popup.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
      });
    }

    // Prevent popup from closing when clicking inside the popup
    if (popup) {
      popup.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        if (popup) popup.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
      });
    }
  }

  // Pricing table observer
  document.addEventListener("DOMContentLoaded", function() {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const table = document.querySelector(".regios-dopp-generic-volume-pricing-table");
          if (table) {
            observer.disconnect();
            debugLog('Table changed!');
            observeTableChange();
            updateTablePrice();
          }
        }
      }
    });

    const targetNode = document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
  });

  function observeTableChange() {
    const tableNode = document.getElementById('regios-dopp-volume-pricing-table-target');
    if (!tableNode) return;
    
    const config = { 
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    };
    
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {              
          observer.disconnect();
        }
      }
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(tableNode, config);
  }

  function discountProgressBar() {
    const progressEl = document.querySelector("#discount-progress");
    if (progressEl) progressEl.classList.remove("hidden");
    
    const table = document.querySelector(".regios-dopp-generic-volume-pricing-table");
    const slabs = extractRanges(table);
    const quantityInput = document.querySelector('.quantity__input');

    function updateProgress(selectedQty) {
      let currentDiscount = 0;
      let nextSlab = null;

      for (let i = 0; i < slabs.length; i++) {
        if (selectedQty >= slabs[i].start) {
          currentDiscount = slabs[i].perct;
        } else {
          nextSlab = slabs[i];
          break;
        }
      }

      if (isNaN(currentDiscount)) {
        currentDiscount = 0;
      }

      const currentDiscountEl = document.querySelector('#current-discount');
      if (currentDiscountEl) currentDiscountEl.textContent = `Current Discount: ${currentDiscount}%`;

      if (nextSlab) {
        const progress = ((selectedQty / nextSlab.start) * 100).toFixed(1);
        const discountBar = document.querySelector('#discount-bar');
        if (discountBar) discountBar.style.width = `${Math.min(progress, 100)}%`;
        const nextDiscountInfo = document.querySelector('#next-discount-info');
        if (nextDiscountInfo) nextDiscountInfo.textContent = `Add ${nextSlab.start - selectedQty} more to save ${nextSlab.perct}%!`;
      } else {
        const discountBar = document.querySelector('#discount-bar');
        if (discountBar) discountBar.style.width = '100%';
        const nextDiscountInfo = document.querySelector('#next-discount-info');
        if (nextDiscountInfo) nextDiscountInfo.textContent = 'Max Discount Reached';
      }
    }

    if (quantityInput) {
      quantityInput.addEventListener('input', function() {
        const qty = parseInt(this.value) || 0;
        updateProgress(qty);
      });

      const initialQty = parseInt(quantityInput.value) || 0;
      updateProgress(initialQty);
    }
  }

  function updateTablePrice() {
    document.querySelectorAll(".volume_pricing_message").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".bulk-ordering-message").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".volume_pricing_info").forEach(el => el.classList.add("hidden"));
  
    const table = document.querySelector(".regios-dopp-generic-volume-pricing-table");
    if (!table) {
      const progressEl = document.querySelector("#discount-progress");
      if (progressEl) progressEl.classList.add("hidden");
      return;
    }

    discountProgressBar();
    
    const variant_id = getVariantId();
    if (!variant_id) {
      console.error("Variant not found.");
      return;
    }
    
    const variant = getVariantData(variant_id);
    if (!variant) {
      console.error("Variant data not found for ID:", variant_id);
      return;
    }

    const originalPriceElement = document.querySelector(".actual-price")?.querySelector(".product-price");
    if (!originalPriceElement) {
      console.error("Original price element not found.");
      return;
    }

    // Get price using helper function
    const originalPrice = getVariantPrice(variant_id);
    
    // Don't exit if price is 0 - it might be a valid price or just not loaded yet
    const currentQuantity = parseFloat(document.querySelector(".quantity__input")?.value) || 1;
    // Get minimum quantity with same priority logic as optionLogic
    const minQuantity = parseInt(getVariantMetafield(variant_id, 'c_f', 'minimum')) ||
                        parseInt(getVariantMetafield(variant_id, 'inventory', 'minimum')) ||
                        parseInt(getProductMetafield('c_f', 'minimum')) ||
                        parseInt(getProductMetafield('inventory', 'minimum')) || 1;
    const ranges = extractRanges(table);
    const currentRange = findRangeForQuantity(currentQuantity, ranges);

    // Use Shopify currency helpers if available
    const formatCurrencyLocal = (value) => {
      if (typeof Shopify !== "undefined" && Shopify.formatMoney) {
        return Shopify.formatMoney(value * 100); // Shopify expects price in cents
      }
      const discountedPrice = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
      return `$${discountedPrice}`; // Fallback to basic formatting
    };

    const body = document.querySelector("body");
    const bodyHasPrice = body?.classList.contains("product.price-discount");
    debugLog('BodyHasPrice: ' + bodyHasPrice);

    // Check if the "Price" column already exists
    const thead = table.querySelector("thead tr");
    const priceColumnExists = Array.from(thead.querySelectorAll("th")).some(
      th => th.innerText.trim().toLowerCase() === "price"
    );

    let priceColumnIndex = -1;
    thead.querySelectorAll('th').forEach((th, index) => {
      if (th.textContent.trim().toLowerCase() === 'price') {
        priceColumnIndex = index;
      }
    });

    // Update rows with calculated prices
    const tbody = table.querySelector("tbody");
    
    // Check if first row already has "1+" quantity
    const priceCellText = `${minQuantity > 1 ? minQuantity : 1}+`;
    const firstRow = tbody.querySelector("tr:first-child");
    const firstQty = firstRow?.querySelector("td:first-child")?.innerText.trim();
    const hasOnePlusRow = firstRow && (firstQty === priceCellText || minQuantity > +firstQty.replace(/[^0-9.]/g, ''));
    
    if (!hasOnePlusRow) {
      // Create the "1+" row
      const onePlusRow = document.createElement("tr");
      
      // Quantity column
      const quantityCell = document.createElement("td");
      quantityCell.innerText = priceCellText;
      onePlusRow.appendChild(quantityCell);
      
      // Discount column
      const discountCell = document.createElement("td");
      discountCell.innerText = bodyHasPrice ? formatCurrencyLocal(originalPrice) : "NA";
      onePlusRow.appendChild(discountCell);
      
      // Price column (empty if price column exists, or will be added later)
      if (priceColumnExists) {
        const priceCell = document.createElement("td");
        priceCell.innerText = ""; // Empty text
        onePlusRow.appendChild(priceCell);
      }
      
      // Insert at the beginning of tbody
      tbody.insertBefore(onePlusRow, tbody.firstChild);
    }

    const rows = tbody.querySelectorAll("tr");
    const rewardPointsEl = document.querySelector('div.reward_points > span');

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const quantity = parseFloat(cells[0].innerText.replace(/[^0-9.]/g, ''));
      const discountText = cells[1].innerText;
      var discountPercent = parseFloat(discountText.replace(/[^0-9.]/g, '')) / 100;
      const discountPrice = parseFloat(discountText.replace(/[^0-9.]/g, ''));

      if (minQuantity > quantity) {
        row.classList.add("hidden");
      } else {
        row.classList.remove("hidden");
      }

      if (currentRange && quantity === currentRange.start) {
        row.classList.add("current");
      } else {
        row.classList.remove("current");
      }

      if (isNaN(discountPercent)) {
        discountPercent = 0;
      }

      if (!isNaN(discountPercent)) {
        const discountedAmount = originalPrice * discountPercent;
        const discountedPrice = bodyHasPrice ? discountPrice : originalPrice - discountedAmount;
        const discountedPriceRounded = Math.floor((discountedPrice) * 100) / 100;
          // Math.floor((  ) * 100) / 100

        if (!bodyHasPrice && !priceColumnExists) {
          const priceCell = document.createElement("td");
          priceCell.innerText = formatCurrencyLocal(discountedPriceRounded) + " each";
          row.appendChild(priceCell);
        } else {
          const cellsList = row.querySelectorAll('td');
          if (priceColumnIndex > -1 && cellsList[priceColumnIndex]) {
            cellsList[priceColumnIndex].innerText = formatCurrencyLocal(discountedPriceRounded) + " each";
          }
        }

        if (currentRange && quantity === currentRange.start) {
          originalPriceElement.innerText = formatCurrencyLocal(discountedPriceRounded) + " each";
          
          const discountedEstimatedTotal = discountedPrice * currentQuantity;
          const totalPriceEl = document.querySelector(".total-price-wrapper .total-price");
          if (totalPriceEl) totalPriceEl.innerHTML = formatCurrencyLocal(discountedEstimatedTotal);
          if (rewardPointsEl) rewardPointsEl.innerHTML = discountedEstimatedTotal.toFixed(2);
        }
      }
    });

    let currentRowExists = document.querySelector(".regios-dopp-generic-volume-pricing-table tbody tr.current");
    if (!currentRowExists) {
      originalPriceElement.innerText = formatCurrencyLocal(originalPrice) + " each";
    }

    document.querySelectorAll(".bulk-ordering-message").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".volume_pricing_info").forEach(el => el.classList.remove("hidden"));

    adjustTablePadding();

    const maxDiscountEl = document.querySelector('.regios-dopp-generic-volume-pricing-table tbody tr:last-child td:nth-child(2)');
    var maxDiscountPerct = maxDiscountEl?.textContent || '';
    const maxPercentEl = document.querySelector(".max_percent");
    if (maxPercentEl) maxPercentEl.innerHTML = maxDiscountPerct;

    // Update header to include "Price"
    if (!bodyHasPrice && thead && thead.childElementCount === 2) {
      const priceHeader = document.createElement("th");
      priceHeader.scope = "col";
      priceHeader.innerText = "Price";
      thead.appendChild(priceHeader);
    }
  }

  function extractRanges(table) {
    const ranges = [];
    const rows = table.querySelectorAll("tbody tr");
    const body = document.querySelector("body");
    const bodyHasPrice = body?.classList.contains("product.price-discount") || body?.classList.contains("product price-discount");
    const variant_id = getVariantId();
    const originalPrice = getVariantPrice(variant_id);

    rows.forEach((row) => {
      const quantityCell = row.querySelector("td:first-child");
      const discountPerct = row.querySelector("td:nth-child(2)");
      if (quantityCell) {
        const rangeText = quantityCell.innerText.trim();
        const match = rangeText.match(/^(\d+)\+?$/);
        if (match) {
          let perct = 0;
          if (discountPerct) {
            if (bodyHasPrice && originalPrice > 0) {
              const discountPrice = parseFloat(discountPerct.innerText.trim().replace("$", ""));
              if (!isNaN(discountPrice)) {
                perct = parseInt((originalPrice - discountPrice) / originalPrice * 100);
              }
            } else if (!bodyHasPrice) {
              const percentText = discountPerct.innerText.trim().replace("% off", "").replace("%", "");
              const parsedPerct = parseInt(percentText);
              if (!isNaN(parsedPerct)) {
                perct = parsedPerct;
              }
            }
          }
          
          const start = parseInt(match[1], 10);
          ranges.push({ start, perct });
        }
      }
    });

    for (let i = 0; i < ranges.length; i++) {
      ranges[i].end = i < ranges.length - 1 ? ranges[i + 1].start - 1 : null;
    }

    return ranges;
  }

  function findRangeForQuantity(quantity, ranges) {
    if (isNaN(quantity)) {
      console.error("Invalid quantity provided.");
      return null;
    }

    for (let i = 0; i < ranges.length; i++) {
      const { start, end } = ranges[i];
      if (quantity >= start && (end === null || quantity <= end)) {
        return ranges[i];
      }
    }

    return null;
  }

  function adjustTablePadding() {
    let totalHiddenHeight = 0;
    document.querySelectorAll(".regios-dopp-generic-volume-pricing-table tbody tr.hidden").forEach(el => {
      totalHiddenHeight += CONFIG.HIDDEN_ROW_HEIGHT;
    });
    const bulkMessage = document.querySelector(".bulk-ordering-message");
    if (bulkMessage) bulkMessage.style.paddingBottom = totalHiddenHeight + "px";
  }

  // Monitor URL changes
  let currentParams = new URLSearchParams(window.location.search).toString();
  const urlObserver = new MutationObserver(() => {
    const newParams = new URLSearchParams(window.location.search).toString();
    if (currentParams !== newParams) {
      currentParams = newParams;
      const myParam = new URLSearchParams(window.location.search).get('variant');
      debugLog('Query parameter changed:', myParam);
      if (myParam) {
        // Ensure product data is loaded before processing variant
        loadProductData().then(() => {
          optionLogic(myParam);
        });
      }
    }
  });

  urlObserver.observe(document, { subtree: true, childList: true });

})();

// Billing/Shipping address synchronization
document.addEventListener('DOMContentLoaded', function() {
    // Field mappings: billing -> shipping
    var fieldMappings = {
        'Field154': 'Field160', // Street Address
        'Field155': 'Field161', // Address Line 2
        'Field156': 'Field162', // City
        'Field157': 'Field163', // State/Province/Region
        'Field158': 'Field164', // Postal/Zip Code
        'Field159': 'Field165'  // Country (select)
    };
    
    // Cache the shipping address container
    var shippingDiv = document.querySelector('#foli160');
    if (!shippingDiv) return;
    
    // Handle radio button change
    document.querySelectorAll('input[name="Field479"]').forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'Yes') {
          // Copy billing values to shipping
          Object.entries(fieldMappings).forEach(([billingId, shippingId]) => {
            const billingField = document.querySelector('#' + billingId);
            const shippingField = document.querySelector('#' + shippingId);
            if (billingField && shippingField) {
              shippingField.value = billingField.value;
            }
          });
          
          // Hide shipping address div
          shippingDiv.style.display = 'none';
          
          // Remove required attribute from shipping fields (so form can submit)
          shippingDiv.querySelectorAll('[required]').forEach(field => {
            field.removeAttribute('required');
            field.setAttribute('data-was-required', 'true');
          });
          
        } else {
          // Show shipping address div
          shippingDiv.style.display = 'block';
          
          // Restore required attributes
          shippingDiv.querySelectorAll('[data-was-required]').forEach(field => {
            field.setAttribute('required', '');
            field.removeAttribute('data-was-required');
          });
        }
      });
    });
    
    // Optional: Also sync when billing fields change while "Yes" is selected
    Object.entries(fieldMappings).forEach(([billingId, shippingId]) => {
      const billingField = document.querySelector('#' + billingId);
      if (billingField) {
        billingField.addEventListener('input', function() {
          const radioYes = document.querySelector('#Field479_1');
          if (radioYes && radioYes.checked) {
            const shippingField = document.querySelector('#' + shippingId);
            if (shippingField) {
              shippingField.value = this.value;
            }
          }
        });

        billingField.addEventListener('change', function() {
          const radioYes = document.querySelector('#Field479_1');
          if (radioYes && radioYes.checked) {
            const shippingField = document.querySelector('#' + shippingId);
            if (shippingField) {
              shippingField.value = this.value;
            }
          }
        });
      }
    });
});