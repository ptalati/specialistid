/**
 * Custom Page JavaScript - Tooltip Functionality
 * This file handles tooltip replacement from Google Sheets data
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    GOOGLE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0zkaovoP8dVMb1Dqbhfzno7Oprzkn03ONaYrwI6-fZKedWVcT93iXkFhwLFk4hLSNNZXHia0k3jtB/pub?gid=0&single=true&output=csv'
  };

  // Wait for DOM to be ready
  function initTooltips() {
    // Check if Papa Parse is loaded
    if (typeof Papa === 'undefined') {
      console.warn('PapaParse library not loaded. Tooltips will not work.');
      return;
    }

    // Load and apply tooltips from Google Sheet
    fetch(CONFIG.GOOGLE_SHEET_URL)
      .then(response => response.text())
      .then(data => {
        console.log('Tooltip data fetched successfully');
        Papa.parse(data, {
          complete: function(results) {
            console.log('Parsed tooltip data:', results.data);
            var wordsToReplace = results.data.map(function(row) {
              var word = row[0] && row[0].trim();
              var url = row[1] && row[1].trim();
              var tooltip = row[2] && row[2].trim();
              if (word && url && tooltip) {
                return { word, url, tooltip };
              }
            }).filter(Boolean);

            console.log('Words to replace:', wordsToReplace);

            function replaceText(node) {
              wordsToReplace.forEach(function(item) {
                var regex = new RegExp(`\\b${item.word}\\b`, "gi");
                if (node.nodeType === 3) {
                  if (node.parentNode && node.parentNode.tagName === 'SCRIPT') {
                    return;
                  }

                  // Check if replacement is needed
                  if (!regex.test(node.nodeValue)) {
                    return;
                  }

                  // Create elements safely without innerHTML
                  const fragment = document.createDocumentFragment();
                  const parts = node.nodeValue.split(regex);
                  const matches = node.nodeValue.match(regex) || [];

                  parts.forEach(function(part, index) {
                    if (part) {
                      fragment.appendChild(document.createTextNode(part));
                    }

                    if (index < matches.length) {
                      const link = document.createElement('a');
                      let itemUrl = item.url.trim();
                      if (itemUrl === "#") itemUrl = "javascript:void(0);";
                      link.href = itemUrl;
                      link.className = 'tooltip';
                      // Use data-tooltip instead of title to avoid browser default tooltip
                      link.setAttribute('data-tooltip', item.tooltip);
                      link.textContent = matches[index];
                      fragment.appendChild(link);
                    }
                  });

                  if (fragment.hasChildNodes()) {
                    node.parentNode.replaceChild(fragment, node);
                  }
                }
              });
            }

            function traverseNodes(node) {
              if (node.nodeType === 1) {
                // Skip headers, links, and buttons
                if (/^(h1|h2|h3|h4|h5|h6|a|button)$/i.test(node.tagName)) {
                  return;
                }
                // Skip if parent is a button or link
                var parent = node.parentNode;
                while (parent) {
                  if (/^(a|button)$/i.test(parent.tagName)) {
                    return;
                  }
                  parent = parent.parentNode;
                }
                var children = Array.from(node.childNodes);
                for (var i = 0; i < children.length; i++) {
                  traverseNodes(children[i]);
                }
              } else {
                replaceText(node);
              }
            }

            traverseNodes(document.body);
            console.log('Tooltips created:', document.querySelectorAll('a.tooltip').length);

            // Add viewport boundary detection for tooltips after DOM updates
            setTimeout(function() {
              adjustTooltipPositions();
            }, 100);
          },
          error: function(error) {
            console.error("Parsing error:", error);
          }
        });
      })
      .catch(err => console.error('Error fetching tooltip data:', err));
  }

  // Adjust tooltip positions to stay within viewport
  function adjustTooltipPositions() {
    const tooltips = document.querySelectorAll('a.tooltip');

    tooltips.forEach(function(tooltip) {
      // Skip if already has event listener
      if (tooltip.hasAttribute('data-tooltip-initialized')) {
        return;
      }

      tooltip.setAttribute('data-tooltip-initialized', 'true');

      tooltip.addEventListener('mouseenter', function() {
        // Reset classes
        this.classList.remove('tooltip-adjust-left', 'tooltip-adjust-right');

        // Get element position
        const rect = this.getBoundingClientRect();
        const tooltipWidth = 300; // max-width of tooltip
        const tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        const tooltipRight = rect.left + (rect.width / 2) + (tooltipWidth / 2);
        const viewportWidth = window.innerWidth;

        // Check if tooltip would overflow on the left
        if (tooltipLeft < 10) {
          this.classList.add('tooltip-adjust-left');
        }
        // Check if tooltip would overflow on the right
        else if (tooltipRight > viewportWidth - 10) {
          this.classList.add('tooltip-adjust-right');
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }

  // Re-adjust on window resize
  window.addEventListener('resize', function() {
    adjustTooltipPositions();
  });

})();
