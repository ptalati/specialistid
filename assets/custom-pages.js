(function() {
    'use strict';

    // Read more functionality
    document.querySelectorAll(".read-more-wrapper .read-more").forEach(el => {
      el.addEventListener("click", function() {
        const desc = document.querySelector(".collection-hero .collection-hero__description");
        if (this.innerHTML === 'Read more') {
          if (desc) desc.classList.add("show-all");
          this.innerHTML = "Read less";
        } else {
          if (desc) desc.classList.remove("show-all");
          this.innerHTML = "Read more";
        }
      });
    });

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

    // Tax exempt form
    document.querySelectorAll('.apply-here-anchor').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const formContainer = document.querySelector("#opt-tax-exempt-form-container");
        if (formContainer) formContainer.style.display = 'block';
        return false;
      });
    });
})();