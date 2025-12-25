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
    GOOGLE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0zkaovoP8dVMb1Dqbhfzno7Oprzkn03ONaYrwI6-fZKedWVcT93iXkFhwLFk4hLSNNZXHia0k3jtB/pub?gid=0&single=true&output=csv'
  };

  // Global variables (needed for cross-function access)
  let typingTimer;
  let rangeArray = [];
  let variantInventory;
  let continueAddingToCart = false;
  let productData = null; // Store product JSON data

  // Wait for jQuery to be ready
  jQuery(document).ready(function($) {    
    // Load product data from JSON
    loadProductData();

    $("#regios-dopp-volume-pricing-table-target").parent().addClass("volume-pricing-table-wrapper");
    $(".volume_pricing_message, #discount-progress, .volume_pricing_info").click(function() {
      $(".volume-pricing-table-wrapper").toggleClass("open");
    });
    
    $(".bulk-ordering-message").appendTo(".volume-pricing-table-wrapper");

    // Warning popup handlers
    $(".warning-anchor").click(function() {
      $("#warning_popup").toggleClass("hidden");
    });

    $("#warning_popup a.close").click(function() {
      $("#warning_popup").toggleClass("hidden");
    });
    
    // Primary button click handler
    $("button.button--primary").on('click', function() {
      $(".loading-overlay__spinner").removeClass("hidden");
      $("button.button--secondary").click();
      setTimeout(function() {
        $(".loading-overlay__spinner").addClass("hidden");
      }, CONFIG.ANIMATION_DELAY);
    });

    // Initial page load setup
    setTimeout(function() {
      $('body').addClass('loaded');
      
      // Ensure product data is loaded
      if (!productData) {
        loadProductData();
      }
      
      // Give product data time to load
      setTimeout(() => {
        updateTablePrice();

        const isDiscontinued = productData?.metafields?.status?.discontinued || 
                              $('[name="isDiscontinued"]').val();
        if (isDiscontinued && isDiscontinued !== "false") {
          $("a.product-form__submit-out-of-stock").addClass("discontinued");
        }
      }, 100);
    }, CONFIG.ANIMATION_DELAY);

    // Error message monitoring
    $(".product-form__error-message").on("classChange", function() {
      var text = $(this).html();
      var variant_id = getVariantId();
      var variantName = $("div.color-swatch-wrapper.option-color").find(`[data-id='${variant_id}']`).data('option');
      var title = $(".product__title h1").html();
      var generatedMessage = `All 0 ${title.trim()}${variant_id ? ` - ${variantName}` : ''} are in your cart.`;

      if (text === generatedMessage) {
        $(this).html('Sorry, this item is currently out of stock, please contact us...');
      }
    });

    // Animated background setup
    setTimeout(function() {
      $(".animated-background").removeClass('hidden');
    }, 300);

    // Color swatch and option clicks
    $("label.color-swatch, label.other-option").on('click', function() {
      $(".animated-background").removeClass('hidden');
      var variant_id = $(this).data('id');
      
      // Ensure product data is loaded before processing
      if (!productData) {
        loadProductData();
        setTimeout(() => {
          optionLogic(variant_id);
          setTimeout(() => updateTablePrice(), CONFIG.ANIMATION_DELAY);
        }, 100);
      } else {
        optionLogic(variant_id);
        setTimeout(() => updateTablePrice(), CONFIG.ANIMATION_DELAY);
      }
    });

    // Out of stock click
    $("a.out-of-stock").on('click', function() {
      var variant_id = getVariantId();
      if (variant_id !== undefined) {
        quantityLogic();
      }
    });

    // Number input validation
    $(document).on('keydown keyup change', '#facility_code, #starting_number', function() {
      var max = parseInt($(this).attr('max'));
      var min = parseInt($(this).attr('min'));
      if ($(this).val() > max) {
        $(this).val(max);
      } else if ($(this).val() < min) {
        $(this).val(min);
      }
    });

    // Quantity input change
    $(document).on('change', '.quantity__input', function() {
      doneTyping();
    });

    // Quantity input keydown
    $(document).on('keydown', '.quantity__input', function(event) {
      if (event.which === 13) {
        doneTyping();
      }
    });

    // Color swatch value update
    $(".color-swatch-wrapper .color-swatch-item").on('click', function() {
      $(".form__label .option-label").html($(this).val());
      var variant_id = $(this).data('id');
      // Price is now handled by optionLogic
    });

    // Read more functionality
    $(".read-more-wrapper .read-more").on("click", function() {
      if ($(this).html() == 'Read more') {
        $(".collection-hero .collection-hero__description").addClass("show-all");
        $(this).html("Read less");
      } else {
        $(".collection-hero .collection-hero__description").removeClass("show-all");
        $(this).html("Read more");
      }
    });

    // Address management
    $(".customer.addresses button.edit_button").on('click', function() {
      $(this).attr('aria-expanded', $(this).attr('aria-expanded') === 'true' ? false : true);
    });

    $(".customer.addresses button.cancel_button").on('click', function() {
      $(".customer.addresses button.edit_button").attr('aria-expanded', false);
    });

    $(".add_address, .add_address_cancel").on('click', function() {
      $(".add-address-wrapper").toggle();
    });

    $("form.address-delete-form").on('submit', function(event) {
      var confirmation = confirm($("button.delete_button").data('confirm-message'));
      if (!confirmation) {
        event.preventDefault();
      }
    });

    // Copy to clipboard functionality
    $(".copy-btn").on('click', function() {
      var discountText = $(this).siblings("h3").text().trim();
      
      navigator.clipboard.writeText(discountText).then(() => {
        var message = $(this).siblings(".copyMessage");
        message.text("Copied!").fadeIn();
        
        setTimeout(() => {
          message.fadeOut();
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    });

    // Image popup functionality
    $('.product-thumbnails-popup img').on('click', function() {
      var fullImageSrc = $(this).data('full-image');
      $('#popup-img').attr('src', fullImageSrc);
      $('#image-popup').show();
    });

    $('#close-popup, #image-popup').on('click', function() {
      $('#image-popup').hide();
    });

    $('.popup-content').on('click', function(event) {
      event.stopPropagation();
    });

    // Thumbnail slider
    $('.product-thumbnails li img').on('click', function() {
      var newImageSrc = $(this).data('full-image');
      var newImageAlt = $(this).attr('alt');
      $('.product-main-image img').attr('src', newImageSrc).attr('alt', newImageAlt);
    });

    // Thumbnail navigation
    var visibleThumbs = 4;
    var totalThumbs = $('.product-thumbnails li').length;
    var maxIndex = totalThumbs - visibleThumbs;
    var currentIndex = 0;

    $('.thumbnail-slider .next-btn').on('click', function() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateThumbnailPosition();
      }
    });

    $('.thumbnail-slider .prev-btn').on('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateThumbnailPosition();
      }
    });

    function updateThumbnailPosition() {
      var thumbWidth = $('.product-thumbnails li').outerWidth(true) + 10;
      var moveDistance = currentIndex * (thumbWidth * -1);
      $('.product-thumbnails').css('transform', 'translateX(' + moveDistance + 'px)');
    }

    // Initialize tooltips
    if ($.fn.tooltip) {
      $(document).tooltip();
    }

    // Load and apply tooltips from Google Sheet
    $.get(CONFIG.GOOGLE_SHEET_URL, function(data) {
      Papa.parse(data, {
        complete: function(results) {
          var wordsToReplace = results.data.map(function(row) {
            var word = row[0] && row[0].trim();
            var url = row[1] && row[1].trim();
            var tooltip = row[2] && row[2].trim();
            if (word && url && tooltip) {
              return { word, url, tooltip };
            }
          }).filter(Boolean);

          function replaceText(node) {
            wordsToReplace.forEach(function(item) {
              var regex = new RegExp(`\\b${item.word}\\b`, "gi");
              if (node.nodeType === 3) {
                if ($(node.parentNode).is('script')) {
                  return;
                }
                var tempContainer = $('<div>').html(node.nodeValue.replace(regex, function(match) {
                  let itemUrl = item.url.trim();
                  if (itemUrl === "#") itemUrl = "javascript:void(0);";
                  return '<a href="' + itemUrl + '" class="tooltip" title="' + item.tooltip.replaceAll('"', '') + '">' + match + '</a>';
                }));
                if (tempContainer.children().length > 0) {
                  $(node).replaceWith(tempContainer.contents());
                }
              }
            });
          }

          function traverseNodes(node) {
            if (node.nodeType === 1) {
              if (/^(h1|h2|h3|h4|h5|h6|a)$/i.test(node.tagName)) {
                return;
              }
              var children = node.childNodes;
              for (var i = 0; i < children.length; i++) {
                traverseNodes(children[i]);
              }
            } else {
              replaceText(node);
            }
          }

          traverseNodes(document.body);
        },
        error: function(error) {
          console.error("Parsing error:", error);
        }
      });
    });

    // Initialize pricing and stock
    setTimeout(() => {
      // Ensure product data is loaded first
      if (!productData) {
        loadProductData();
        setTimeout(() => {
          mapMsrpLogic();
          manageStockDisplay();
        }, 200);
      } else {
        mapMsrpLogic();
        manageStockDisplay();
      }
    }, 100);

    // Sliding support popup
    setTimeout(function() {
      $("#supportPopup").css("left", "10px");
      setTimeout(function() {
        $("#supportPopup").css("left", "-300px");
        $("#openPopup").fadeIn();
      }, CONFIG.POPUP_HIDE_DELAY);
    }, CONFIG.POPUP_DELAY);

    $("#closePopup").on('click', function() {
      $("#supportPopup").css("left", "-300px");
      $("#openPopup").fadeIn();
    });

    $("#openPopup").on('click', function() {
      $("#supportPopup").css("left", "10px");
      $(this).fadeOut();
    });

    // FPD designer help popup
    $(".support-content-wrapper, .close-designer-help-form").on('click', function() {
      $("#overlay-support").toggleClass('hidden');
      $("#fpd-designer-help-popup").toggleClass('hidden');
    });

    // Tax exempt form
    $("body").on('click', '.apply-here-anchor', function(e) {
      e.preventDefault();
      $("#opt-tax-exempt-form-container").show();
      return false;
    });

    // Feedback functionality
    $("body").on('click', '.feedback-container > .positive', function() {
      $(".positive-feedback").removeClass("hide");
      setTimeout(function() {
        $(".positive-feedback").addClass("hide");
      }, 5000);
    });

    $("body").on('click', '.feedback-container > .negative', function() {
      $("#feedback_form").removeClass("hide");
    });

    $("body").on('click', '#feedback_form a.close', function() {
      $("#feedback_form").addClass("hide");
    });
  });

  // Load product data from JSON
  function loadProductData() {
    // Method 1: Try to get from ProductJson script tag
    const productJsonScript = document.querySelector('[id^="ProductJson-"]');
    if (productJsonScript) {
      try {
        productData = JSON.parse(productJsonScript.textContent);
        // Expose globally for debugging
        window.productData = productData;
        console.log('Product data loaded from script tag');
        return;
      } catch (e) {
        console.error('Error parsing ProductJson:', e);
      }
    }

    // Method 2: Try to get from window object (many themes expose this)
    if (window.product) {
      productData = window.product;
      window.productData = productData;
      console.log('Product data loaded from window.product');
      return;
    }

    // Method 3: Try to fetch from API if we have a product handle
    const productHandle = window.location.pathname.match(/\/products\/([^\/]+)/);
    if (productHandle && productHandle[1]) {
      jQuery.getJSON(`/products/${productHandle[1]}.json`, function(data) {
        productData = data.product;
        window.productData = productData;
        console.log('Product data loaded from API');
      }).fail(function() {
        console.error('Failed to load product JSON from API');
      });
    }
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

  // Get product metafield value
  function getProductMetafield(namespace, key) {
    if (!productData || !productData.metafields) return null;
    
    const metafield = productData.metafields.find(m => 
      m.namespace === namespace && m.key === key
    );
    
    return metafield ? metafield.value : null;
  }

  // Helper function to get variant price
  function getVariantPrice(variantId) {
    const variant = getVariantData(variantId);
    if (variant && variant.price) {
      return variant.price / 100; // Convert from cents
    } else {
      // Fallback to hidden field
      const priceStr = jQuery(`[name="variant_price_${variantId}"]`).val();
      if (priceStr) {
        return parseFloat(priceStr.replace(/[$,]/g, ''));
      }
    }
    
    return 0;
  }

  // Helper function to get variant compare at price
  function getVariantCompareAtPrice(variantId) {
    const variant = getVariantData(variantId);
    if (variant && variant.compare_at_price) {
      return variant.compare_at_price / 100; // Convert from cents
    }
    
    // Fallback to hidden field
    const priceStr = jQuery(`[name="variant_compare_at_price_${variantId}"]`).val();
    if (priceStr) {
      return parseFloat(priceStr.replace(/[$,]/g, ''));
    }
    
    return 0;
  }

  // Core Functions
  function optionLogic(variant_id) {
    jQuery('input.current_variant_id').val(variant_id);
    
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
    
    // Try to get custom data from metafields or fallback to hidden fields
    var customPriceText = variant.metafields?.custom?.price_text || 
                         jQuery('[name="variant_customPriceText_' + variant_id + '"]').val() || '';
    var qty = variant.inventory_quantity || 
              parseInt(jQuery('[name="variant_quantity_' + variant_id + '"]').val()) || 0;
    
    // Get min and increment from metafields or hidden fields
    var min = parseInt(variant.metafields?.inventory?.minimum) || 
              parseInt(jQuery('[name="variant_minimum_' + variant_id + '"]').val()) || 1;
    var increment = parseInt(variant.metafields?.inventory?.increment) || 
                   parseInt(jQuery('[name="variant_increment_' + variant_id + '"]').val()) || 1;

    jQuery('span.variant-sku').html(sku);

    var percent_value = (((compare_at_price_num - price_num) * 100.0) / compare_at_price_num).toFixed(0);

    mapMsrpLogic(variant_id, price);
    manageStockDisplay(variant_id);
    quantityLogic();

    if (customPriceText != "") {
      jQuery('span.price-min').html(customPriceText);
      jQuery(".custom-price-text").html(customPriceText);
      jQuery(".custom-price-text").removeClass("hide");
    } else {
      jQuery(".custom-price-text").addClass("hide");
      jQuery(".custom-price-text").html("");
    }

    if (min != increment) {
      jQuery(".minimum-quantity-text").removeClass("hide");
    } else if (min == increment && min > 1) {
      jQuery(".sold-in-pack-text").removeClass("hide");
    } else {
      jQuery(".minimum-quantity-text").addClass("hide");
      jQuery(".sold-in-pack-text").addClass("hide");
    }

    jQuery(".minimum_qty").html(min);
    jQuery(".quantity__input").attr('min', min);
    jQuery(".quantity__input").attr('step', increment);
    jQuery(".quantity__input").attr('value', min);
    jQuery(".quantity__input").val(min);

    if (min > 1 && min != increment) {
      jQuery('span.price-min').removeClass("hide");
      jQuery('span.price-min').html('<span class="orange-bg price-min">Minimum Quantity ' + min + '</span>');
    } else if(min == increment && min > 1) {
      jQuery('span.price-min').removeClass("hide");
      jQuery('span.price-min').html('<span class="green-font price-min">ea. <span class="orange-bg">Sold in Packs of ' + min + '</span></span>');
    } else {
      jQuery('span.price-min').addClass("hide");
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
      
      var productId = productData?.id || jQuery('[name="product_id"]').val();
      if (!productId) return null;
      
      if (productId) {
        var postData = JSON.stringify({
          productId: productId
        });
    
        return jQuery.ajax({
          url: CONFIG.API_URL,
          type: 'POST',
          data: postData,
          contentType: 'application/json',
        })
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
    var variant_id = jQuery('input[name="Color"]:checked').data('variantid');
    if (variant_id === undefined) {
      variant_id = jQuery('input[name="Size"]:checked').data('variantid');
    }
    if (variant_id === undefined) {
      variant_id = jQuery('input[name="Layout"]:checked').data('variantid');
    }
    if (variant_id === undefined) {
      variant_id = jQuery('input[name="Pre-Printed"]:checked').data('variantid');
    }
    if (variant_id === undefined) {
      var variant_count = jQuery('input[name="variant_id"]').length;
      if (variant_count === 1) {
        variant_id = jQuery('input[name="variant_id"]').val();
      }
    }
    if (variant_id === undefined) {
      variant_id = jQuery('input.color-swatch-item:checked').data('variantid');
    }
    if (variant_id === undefined) {
      variant_id = jQuery('input.current_variant_id').val();
    }
    return variant_id;
  }

  function manageStockDisplay(variant_id) {
    if (!variant_id) {
      variant_id = getVariantId();
      if (!variant_id) return;
    }

    const isDiscontinued = productData?.metafields?.status?.discontinued || 
                          jQuery('[name="isDiscontinued"]').val();
    if (isDiscontinued && isDiscontinued !== 'false') {
      jQuery(".stock_label.available-2").addClass("forcehidden");
      jQuery(".stock_label.available-3").addClass("bottom-padding");
      jQuery(".stock_label.available-3").html('');
      return;
    }

    var jQueryqtySelector = jQuery('.quantity__input'),
      inputQty = parseInt(jQueryqtySelector.val() || '1');

    if (inputQty === 1) {
      jQuery(".per-item-price").hide();
    } else {
      jQuery(".per-item-price").show();
    }
    
    // Get variant from JSON
    const variant = getVariantData(variant_id);
    
    getProductInventoryByLocation(variant_id)
      .then(function(variantInventory) {
        if (!variantInventory) return null;

        if (variantInventory) {
          var doralQty = variantInventory.inventoryLevels["Specialist ID"] || 0;

          var inventory_policy = variant?.inventory_policy || 
                              jQuery('[name="variant_inventory_policy_' + variant_id + '"]').val() || 
                              'deny';
          
          // Try to get shipping info from metafields first, then hidden fields
          var product_iscustom = productData?.metafields?.product?.is_custom || 
                               jQuery('[name="product_iscustom"]').val();
          var product_shipping_info = productData?.metafields?.shipping?.info || 
                                    jQuery('[name="product_shipping_info"]').val();
          var variant_shipping_info = variant?.metafields?.shipping?.info || 
                                    jQuery('[name="variant_shipping_info_' + variant_id + '"]').val();
          var product_oos_lead_time = productData?.metafields?.inventory?.oos_lead_time || 
                                    jQuery('[name="product_oos_lead_time"]').val();
          var variant_oos_lead_time = variant?.metafields?.inventory?.oos_lead_time || 
                                    jQuery('[name="variant_oos_lead_time_' + variant_id + '"]').val();
          var collection_shipping_info = jQuery('[name="collection_shipping_info"]').val();
          var qty = variant?.inventory_quantity || 
                   parseInt(jQuery('[name="variant_quantity_' + variant_id + '"]').val()) || 0;
          var collection_additional_lead_time = jQuery('[name="collection_additional_lead_time"]').val();
          var product_backordered_lead_time = jQuery('[name="product_backordered_lead_time"]').val();
          var variant_backordered_lead_time = jQuery('[name="variant_backordered_lead_time"]').val();

          jQuery(".stock_label.available-2").addClass("forcehidden");
          jQuery(".stock_label.available-3").addClass("bottom-padding");

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
                jQuery(".stock_label.available-2").removeClass("forcehidden");
                jQuery(".stock_label.available-3").removeClass("bottom-padding");
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
              jQuery("button.product-form__submit").addClass('out-of-stock');
              lead_time_text = 'Out of stock';
            } else {
              jQuery("button.product-form__submit").removeClass('out-of-stock');

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
            jQuery(".stock_label.available-3").html(lead_time_text);
            jQuery("#lead_time").val(lead_time_text);
          }

          if (collection_additional_lead_time && collection_additional_lead_time !== '') {
            jQuery(".stock_label.available-3").html(lead_time_text + '<span class="additional-lead-time" title="' + collection_additional_lead_time + '"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16,21h-2v-7h2V21z M15,11.5 c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S15.828,11.5,15,11.5z"></path></svg></span>');
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
    // Get current date in store timezone, assuming EST
    const now = new Date();
  
    // Convert to EST timezone by offsetting UTC time accordingly
    // EST is UTC-5 normally, but consider daylight saving changes as needed
    // For simplicity, this example assumes fixed offset to EST (-5 hours)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estOffset = -5; // EST offset in hours
  
    const estTime = new Date(utc + (3600000 * estOffset));
  
    const day = estTime.getDay(); // 0=Sun, 5=Fri, 6=Sat
    const hours = estTime.getHours();
  
    // Check Friday 15:00 (3 PM) or later
    if (day === 5 && hours >= 15) {
      return true;
    }
    // Saturday any time
    if (day === 6) {
      return true;
    }
    // Sunday any time
    if (day === 0) {
      return true;
    }
    // Monday before 00:00 (should be excluded)
    if (day === 1) {
      return false;
    }
    
    return false;
  }

  function quantityLogic() {
    var variant_id = getVariantId();
    const variant = getVariantData(variant_id);
    
    var qty = variant?.inventory_quantity || 
              parseInt(jQuery('[name="variant_quantity_' + variant_id + '"]').val()) || 0;
    var current_qty = parseInt(jQuery(".quantity__input").val());
    var inventory_policy = variant?.inventory_policy || 
                         jQuery('[name="variant_inventory_policy_' + variant_id + '"]').val() || 
                         'deny';

    manageStockDisplay();

    if (inventory_policy === 'continue') return;

    jQuery('span.current_qty').html(qty);
    jQuery(".quantity_warning span.qty-warning").addClass("hide");

    if (current_qty > qty) {
      setTimeout(function() {
        jQuery(".product-form__submit span").html("Add to cart");
        jQuery(".product-form__submit").prop("disabled", false);
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

    const isDiscontinued = productData?.metafields?.status?.discontinued || 
                          jQuery('[name="isDiscontinued"]').val();
    if (isDiscontinued && isDiscontinued !== 'false') {
      jQuery(".product-price-display").html('');
      jQuery(".per-item-price").hide();
      return;
    }

    var qty = parseInt(jQuery(".quantity__input").val()) || 1;
    var rewardPoints = jQuery('div.reward_points > span');
    var price_num = parseFloat(price);
    
    // Get pricing data using helper functions
    var compare_at_price_num = getVariantCompareAtPrice(variant_id);
    
    // Get MAP and MSRP values
    const variant = getVariantData(variant_id);
    var map_value_num = 0;
    var msrp_value_num = 0;
    
    if (variant) {
      map_value_num = parseFloat(variant.metafields?.pricing?.map_value || 0);
      msrp_value_num = parseFloat(variant.metafields?.pricing?.msrp_value || 0);
    }
    
    // Fallback to hidden fields if not in JSON
    if (map_value_num === 0) {
      const mapStr = jQuery('[name="variant_map_value_' + variant_id + '"]').val();
      if (mapStr) map_value_num = parseFloat(mapStr.replace("$", "")) || 0;
    }
    
    if (msrp_value_num === 0) {
      const msrpStr = jQuery('[name="variant_msrp_value_' + variant_id + '"]').val();
      if (msrpStr) msrp_value_num = parseFloat(msrpStr.replace("$", "")) || 0;
    }

    // Product-level fallbacks
    if (map_value_num === 0) {
      map_value_num = parseFloat(productData?.metafields?.pricing?.map_value || 0);
      if (map_value_num === 0) {
        const mapStr = jQuery('[name="product_map_value"]').val();
        if (mapStr) map_value_num = parseFloat(mapStr.replace("$", "")) || 0;
      }
    }

    if (msrp_value_num === 0) {
      msrp_value_num = parseFloat(productData?.metafields?.pricing?.msrp_value || 0);
      if (msrp_value_num === 0) {
        const msrpStr = jQuery('[name="product_msrp_value"]').val();
        if (msrpStr) msrp_value_num = parseFloat(msrpStr.replace("$", "")) || 0;
      }
    }

    var msrp_txt = '';
    var map_txt = '';
    var totalPrice = price_num * qty;

    if (price_num < map_value_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">Regular price: <s><span id="map-price">' + formatCurrency(map_value_num) + '</span></s></div>';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">Add to Cart for Price</div>';
      jQuery("div.reward_points").addClass("hide");
    } else if (price_num >= map_value_num && price_num < msrp_value_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">MSRP: <s><span id="map-price">' + formatCurrency(msrp_value_num) + '</span></s></div>';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      jQuery("div.reward_points").addClass("hide");
    } else if (price_num >= map_value_num && price_num >= msrp_value_num) {
      msrp_txt = '';
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      jQuery("div.reward_points").removeClass("hide");
      rewardPoints.html(totalPrice.toFixed(2));
    } else {
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      jQuery("div.reward_points").removeClass("hide");
      rewardPoints.html(totalPrice.toFixed(2));
    }
    
    if (compare_at_price_num > 0 && compare_at_price_num > price_num) {
      msrp_txt = '<div class="regios-dopp-generic-price-item--regular">Regular Price: <s id="compare-at-price">' + formatCurrency(compare_at_price_num) + ' ea</s></div>';
      totalPrice = price_num * qty;
      map_txt = '<div class="product-price regios-dopp-generic-price-item--sale">' + formatCurrency(price_num) + ' each</div>';
      jQuery("div.reward_points").removeClass("hide");
      rewardPoints.html(totalPrice.toFixed(2));
    }

    if (price_num < map_value_num 
      || (price_num >= map_value_num && price_num < msrp_value_num) 
      || (compare_at_price_num > 0 && compare_at_price_num > price_num)) {
      if (price_num < map_value_num 
      || (price_num >= map_value_num && price_num < msrp_value_num)) {
        jQuery("div.total-price-wrapper").addClass("hidden");
      }
      
      jQuery(".actual-price").html(msrp_txt + map_txt);
    } else {
      jQuery("div.total-price-wrapper").removeClass("hidden");
      jQuery(".product-price").html(formatCurrency(price_num) + ' each');
    }
    
    jQuery(".total-price-wrapper .total-price").html(formatCurrency(totalPrice));

    updateTablePrice();

    if (qty === 1) {
      jQuery(".per-item-price").hide();
    } else {
      jQuery(".per-item-price").show();
    }
  }

  function formatCurrency(amount, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  function doneTyping() {
    var jQueryel = jQuery('.quantity__input'),
      jQueryqtySelector = jQuery('.quantity__input'),
      min = parseInt(jQueryqtySelector.attr('min')) || 1,
      qty = parseInt(jQueryqtySelector.val().replace(/\D/g, '')) || min,
      increment = parseInt(jQueryqtySelector.attr('step')) || 1;
    
    var stock = parseInt(jQueryqtySelector.attr('max'));

    if (!isNaN(stock)) {
      if (stock > 0 && qty > stock) {
        qty = stock;
        jQuery('.quantity__input').val(stock);
      }
    }

    quantityLogic();
    mapMsrpLogic();
    updateTablePrice();

    if (qty < min) {
      jQueryqtySelector.val(min);
    } else if (increment && !Number.isInteger(qty/increment)) {
      jQueryqtySelector.val(min * Math.round(qty/increment));
    }
  }

  function validateQty(qty) {
    if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
      // Valid number
    } else {
      qty = 1;
    }
    return qty;
  }

  // Window load events
  jQuery(window).on("load", function() {
    // Ensure product data is loaded
    if (!productData) {
      loadProductData();
    }
    
    if (jQuery("body").hasClass("product") || jQuery("body").hasClass("product.fpd") || 
        jQuery("body").hasClass("product.fpd-dynamic") || jQuery("body").hasClass("product.custom-badge-buddies")) {
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
  });

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
        jQuery("body").addClass("sticky-nav-wrapper");
        navIsSticky = true;
      } else if (shouldUnstick && navIsSticky) {
        nav.classList.remove('sticky-nav');
        jQuery("body").removeClass("sticky-nav-wrapper");
        navIsSticky = false;
      }

      lastScrollY = window.scrollY;
    }

    window.addEventListener('scroll', toggleStickyNav);
  });

  // Out of stock popup
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure product data is loaded
    if (!productData && window.location.pathname.includes('/products/')) {
      loadProductData();
      // Wait a bit for data to load
      setTimeout(() => initOutOfStockPopup(), 300);
    } else {
      initOutOfStockPopup();
    }
  });

  function initOutOfStockPopup() {
    var productId = productData?.id || jQuery('[name="product_id"]').val();
    if (!productId) return;

    const disable_oos_popup = jQuery('[name="disable_oos_popup"]').val();
    if (disable_oos_popup === 'true') return;

    const variant_id = jQuery('[name="current_variant_id"]').val() || getVariantId();
    const variant = getVariantData(variant_id);
    
    const inventory_policy = variant?.inventory_policy || 
                           jQuery('[name="variant_inventory_policy_' + variant_id + '"]').val() || 
                           'deny';
    const product_oos_lead_time = productData?.metafields?.inventory?.oos_lead_time || 
                                 jQuery('[name="product_oos_lead_time"]').val() || '';
    const variant_oos_lead_time = variant?.metafields?.inventory?.oos_lead_time || 
                                 jQuery('[name="variant_oos_lead_time_' + variant_id + '"]').val() || '';
    
    const addToCartButton = document.querySelector('[name="add"]');
    const quantityInput = document.querySelector('[name="quantity"]');
    const maxQuantity = variant?.inventory_quantity || 
                       parseInt(document.querySelector('[data-stock]')?.dataset.stock || '0', 10);
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
        
        const quantity = parseInt(quantityInput.value, 10);
    
        if (!continueAddingToCart && quantity > maxQuantity) {
          event.preventDefault();
          popup.classList.remove('hidden');
          overlay.classList.remove('hidden');
    
          const unitPrice = getVariantPrice(variant_id);
          if (quantityInput.value * unitPrice > 1000) {
            jQuery(".retail-contact").addClass("hide");
            jQuery(".enterprise-contact").removeClass("hide");
          } else {
            jQuery(".retail-contact").removeClass("hide");
            jQuery(".enterprise-contact").addClass("hide");
          }
        }
      });
    }

    if (closePopup) {
      closePopup.addEventListener('click', () => {
        popup.classList.add('hidden');
        overlay.classList.add('hidden');
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
        popup.classList.add('hidden');
        overlay.classList.add('hidden');
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
            console.log('Table changed!');
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
    jQuery("#discount-progress").removeClass("hidden");
    
    const table = document.querySelector(".regios-dopp-generic-volume-pricing-table");
    const slabs = extractRanges(table);
    const $quantityInput = jQuery('.quantity__input');

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

      jQuery('#current-discount').text(`Current Discount: ${currentDiscount}%`);

      if (nextSlab) {
        const progress = ((selectedQty / nextSlab.start) * 100).toFixed(1);
        jQuery('#discount-bar').css('width', `${Math.min(progress, 100)}%`);
        jQuery('#next-discount-info').text(`Add ${nextSlab.start - selectedQty} more to save ${nextSlab.perct}%!`);
      } else {
        jQuery('#discount-bar').css('width', '100%');
        jQuery('#next-discount-info').text('Max Discount Reached');
      }
    }

    if ($quantityInput.length) {
      $quantityInput.on('input', function() {
        const qty = parseInt(jQuery(this).val()) || 0;
        updateProgress(qty);
      });

      const initialQty = parseInt($quantityInput.val()) || 0;
      updateProgress(initialQty);
    }
  }

  function updateTablePrice() {
    jQuery(".volume_pricing_message").addClass("hidden");
    jQuery(".bulk-ordering-message").addClass("hidden");
    jQuery(".volume_pricing_info").addClass("hidden");
  
    const table = document.querySelector(".regios-dopp-generic-volume-pricing-table");
    if (!table) {
      jQuery("#discount-progress").addClass("hidden");
      return;
    }

    discountProgressBar();
    
    const variant_id = getVariantId();
    if (!variant_id) {
      console.error("Variant not found.");
      return;
    }
    
    const variant = getVariantData(variant_id);
    const originalPriceElement = document.querySelector(".actual-price")?.querySelector(".product-price");
    // const estimatedTotalElement = document.querySelector(".actual-price")?.querySelector(".per-item-price");
    if (!originalPriceElement) {
      console.error("Original price element not found.");
      return;
    }

    // Get price using helper function
    const originalPrice = getVariantPrice(variant_id);
    
    if (!originalPrice) {
      console.error("Original price not found.");
      return;
    }
    
    const currentQuantity = parseFloat(document.querySelector(".quantity__input").value);
    const minQuantity = variant?.metafields?.inventory?.minimum || 
                       parseFloat(jQuery('[name="variant_minimum_' + variant_id + '"]').val()) || 1;
    const ranges = extractRanges(table);
    const currentRange = findRangeForQuantity(currentQuantity, ranges);

    // Use Shopify currency helpers if available
    const formatCurrency = (value) => {
      if (typeof Shopify !== "undefined" && Shopify.formatMoney) {
        return Shopify.formatMoney(value * 100); // Shopify expects price in cents
      }
      const discountedPrice = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
      return `$${discountedPrice}`; // Fallback to basic formatting
    };

    const bodyHasPrice = jQuery("body").hasClass("product.price-discount");
    console.log('BodyHasPrice: ' + bodyHasPrice);

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
    const firstQty = firstRow.querySelector("td:first-child")?.innerText.trim();
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
      discountCell.innerText = bodyHasPrice ? formatCurrency(originalPrice) : "NA";
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
    const rewardPoints = jQuery('div.reward_points > span');

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
        const discountedPrice = Math.floor((bodyHasPrice ? discountPrice : originalPrice - discountedAmount) * 100) / 100;

        if (!bodyHasPrice && !priceColumnExists) {
          const priceCell = document.createElement("td");
          priceCell.innerText = formatCurrency(discountedPrice) + " each";
          row.appendChild(priceCell);
        } else {
          const cells = row.querySelectorAll('td');
          if (priceColumnIndex > -1 && cells[priceColumnIndex]) {
            cells[priceColumnIndex].innerText = formatCurrency(discountedPrice) + " each";
          }
        }

        if (currentRange && quantity === currentRange.start) {
          originalPriceElement.innerText = formatCurrency(discountedPrice) + " each";
          
          const discountedEstimatedTotal = discountedPrice * currentQuantity;
          jQuery(".total-price-wrapper .total-price").html(formatCurrency(discountedEstimatedTotal));
          rewardPoints.html(discountedEstimatedTotal.toFixed(2));
        }
      }
    });

    let currentRowExists = jQuery(".regios-dopp-generic-volume-pricing-table tbody tr.current");
    if (currentRowExists.length === 0) {
      originalPriceElement.innerText = formatCurrency(originalPrice) + " each";
    }

    jQuery(".bulk-ordering-message").removeClass("hidden");
    jQuery(".volume_pricing_info").removeClass("hidden");

    adjustTablePadding();

    var maxDiscountPerct = $('.regios-dopp-generic-volume-pricing-table tbody tr:last td:eq(1)').text();
    // console.log('Max discount: ' + maxDiscountPerct);
    $(".max_percent").html(maxDiscountPerct);

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
    const bodyHasPrice = jQuery("body").hasClass("product.price-discount");
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
            perct = bodyHasPrice
              ? parseInt((originalPrice - parseFloat(discountPerct.innerText.trim().replace("$", ""))) / originalPrice * 100)
              : parseInt(discountPerct.innerText.trim().replace("% off", ""));
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
    jQuery(".regios-dopp-generic-volume-pricing-table tbody tr.hidden").each(function() {
      totalHiddenHeight += 46;
    });
    jQuery(".bulk-ordering-message").css("padding-bottom", totalHiddenHeight + "px");
  }

  // Monitor URL changes
  let currentParams = new URLSearchParams(window.location.search).toString();
  const observer = new MutationObserver(() => {
    const newParams = new URLSearchParams(window.location.search).toString();
    if (currentParams !== newParams) {
      currentParams = newParams;
      const myParam = new URLSearchParams(window.location.search).get('variant');
      console.log('Query parameter changed:', myParam);
      if (myParam) {
        // Ensure product data is loaded before processing variant
        if (!productData) {
          loadProductData();
          setTimeout(() => optionLogic(myParam), 200);
        } else {
          optionLogic(myParam);
        }
      }
    }
  });

  observer.observe(document, { subtree: true, childList: true });

})();


$(document).ready(function() {
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
    var $shippingDiv = $('#foli160');
    
    // Handle radio button change
    $('input[name="Field479"]').on('change', function() {
        if ($(this).val() === 'Yes') {
            // Copy billing values to shipping
            $.each(fieldMappings, function(billingId, shippingId) {
                $('#' + shippingId).val($('#' + billingId).val());
            });
            
            // Hide shipping address div
            $shippingDiv.hide();
            
            // Remove required attribute from shipping fields (so form can submit)
            $shippingDiv.find('[required]').removeAttr('required').attr('data-was-required', 'true');
            
        } else {
            // Show shipping address div
            $shippingDiv.show();
            
            // Restore required attributes
            $shippingDiv.find('[data-was-required]').attr('required', '').removeAttr('data-was-required');
        }
    });
    
    // Optional: Also sync when billing fields change while "Yes" is selected
    $.each(fieldMappings, function(billingId, shippingId) {
        $('#' + billingId).on('input change', function() {
            if ($('#Field479_1').is(':checked')) {
                $('#' + shippingId).val($(this).val());
            }
        });
    });
});