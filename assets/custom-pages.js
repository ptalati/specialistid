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
})();