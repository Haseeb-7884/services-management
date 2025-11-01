// ===== QUANTITY SELECTOR FUNCTIONALITY =====
// Get quantity input and buttons
const quantityInput = document.getElementById('quantityInput');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');

// Increase quantity
increaseBtn.addEventListener('click', function () {
    quantityInput.value = parseInt(quantityInput.value) + 1;
});

// Decrease quantity (minimum 1)
decreaseBtn.addEventListener('click', function () {
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

// ===== IMAGE UPLOAD FUNCTIONALITY =====
// Get image input and wrapper
const imageInput = document.getElementById('imageInput');
const productImage = document.getElementById('productImage');

// Handle image upload
imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        // Create file reader to display image
        const reader = new FileReader();
        reader.onload = function (event) {
            // Update product image with uploaded image
            productImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ===== STAR RATING FUNCTIONALITY =====
function initStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    const selectedRating = document.getElementById('selectedRating');

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', function () {
                const value = parseInt(this.getAttribute('data-value'));
                if (selectedRating) selectedRating.value = value;

                stars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }
}

// Initialize when page loads
initStarRating();

// ===== CART FUNCTIONALITY =====
// Add to cart function
function addToCart() {
    const quantity = quantityInput.value;
    const packageID = '<?= $packageID ?>';
    const marketplaceID = '<?= $marketplaceID ?>';

    // Create professional toast notification at top
    const toastHTML = `
        <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 9999; width: 100%; max-width: 500px;">
            <div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center flex-grow-1">
                        <i class="fas fa-check-circle me-3 fs-4"></i>
                        <div class="flex-grow-1">
                            <div class="fw-bold">Awesome! ${quantity} item(s) added to your shopping cart</div>
                            <div class="small">Taking you to cart details now...</div>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    `;

    // Add toast to body
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // Redirect after 2 seconds
    setTimeout(function () {
        window.location.href = `cart_details.php?packageID=${packageID}&marketplaceID=${marketplaceID}&cartQuantity=${quantity}`;
    }, 2000);
}

// ===== SHARE FUNCTIONALITY =====
// Share on Facebook
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Share on Twitter/X
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this amazing Instagram Package!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

// Client Suggestions Form Handler
document.getElementById('clientSuggestionsForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const formData = {
        name: document.getElementById('csYourName').value,
        category: document.getElementById('csCategory').value,
        title: document.getElementById('csSuggestionTitle').value,
        suggestion: document.getElementById('csYourSuggestion').value
    };

    // Here you can add your form submission logic
    console.log('Form submitted:', formData);

    // Example: Show success message
    alert('Thank you for your suggestion! We appreciate your feedback.');

    // Reset form
    this.reset();
});

// toasts

setTimeout(function () {
    const toast = document.getElementById('successToast');
    if (toast) {
        toast.remove();
    }
}, 5000);

function hideToast() {
    const toast = document.getElementById('successToast');
    if (toast) {
        toast.classList.remove('show');
        // Remove from DOM after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Also allow manual close
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-close')) {
        hideToast();
    }
});

(function () {
      // Safety: ensure bootstrap's Toast exists
      if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
        console.error('Bootstrap Toast is not available. Make sure bootstrap.bundle.min.js is loaded.');
        return;
      }

      // Ensure DOM is ready
      document.addEventListener('DOMContentLoaded', function () {
        const toastEl = document.getElementById('gecErrorToast');
        if (!toastEl) {
          console.warn('gecErrorToast element not found.');
          return;
        }

        // Create Toast instance (autohide after 3000ms)
        const gecToast = new bootstrap.Toast(toastEl, {
          autohide: true,
          delay: 3000 // 3 seconds
        });

        // Show it
        gecToast.show();

        // Remove from DOM after hidden (optional cleanup)
        toastEl.addEventListener('hidden.bs.toast', function () {
          // remove wrapper if you want entire container removed
          const wrapper = document.getElementById('gecToastWrapper');
          if (wrapper) wrapper.remove();
        });

        // Wire close button: use event delegation or direct handler
        // (Bootstrap handles [data-bs-dismiss="toast"] automatically,
        // but since we removed that attribute in this snippet, call hide())
        const closeBtn = toastEl.querySelector('.gec-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            try {
              gecToast.hide();
            } catch (err) {
              // fallback: remove immediately
              toastEl.classList.remove('show');
              toastEl.remove();
            }
          });
        }
      });
    })();

{/* <a href="../../includes/pages/cart_details.php"></a> */}