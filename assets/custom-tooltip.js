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
    // Load and apply tooltips from Google Sheet
    fetch(CONFIG.GOOGLE_SHEET_URL)
      .then(response => response.text())
      .then(data => {
        if (typeof Papa !== 'undefined') {
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
                        // Safely set tooltip - no HTML injection possible with setAttribute
                        link.setAttribute('title', item.tooltip);
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
                  if (/^(h1|h2|h3|h4|h5|h6|a)$/i.test(node.tagName)) {
                    return;
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
            },
            error: function(error) {
              console.error("Parsing error:", error);
            }
          });
        }
      })
      .catch(err => console.error('Error fetching tooltip data:', err));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }

})();
