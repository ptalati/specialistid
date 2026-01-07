(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initOnReady() {
        // Copy to clipboard functionality
        document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener('click', function() {
            const h3 = this.previousElementSibling;
            const discountText = h3 ? h3.textContent.trim() : '';
            
            navigator.clipboard.writeText(discountText).then(() => {
            const message = this.nextElementSibling;
            if (message && message.classList.contains('copyMessage')) {
                message.textContent = "Copied!";
                message.style.display = 'block';
                
                setTimeout(() => {
                fadeOut(message);
                }, 2000);
            }
            }).catch(err => {
            console.error("Failed to copy: ", err);
            });
        });
        });

        // Helper function for fade out
        function fadeOut(el) {
        el.style.opacity = '1';
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
            el.style.opacity = '1';
        }, 300);
        }
    }
});