document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Product quantity buttons in product details page
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  const qtyInput = document.querySelector('.qty-input');

  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', function () {
      let currentValue = parseInt(qtyInput.value);
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
      }
    });

    plusBtn.addEventListener('click', function () {
      let currentValue = parseInt(qtyInput.value);
      let maxValue = parseInt(qtyInput.getAttribute('max') || '99');
      if (currentValue < maxValue) {
        qtyInput.value = currentValue + 1;
      }
    });
  }

  // Product detail page tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length && tabContents.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        // Remove active class from all tabs
        tabBtns.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        // Add active class to current tab
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // Add to cart functionality
  const cartButtons = document.querySelectorAll('.cart-button');

  cartButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Get product info
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;

      // Animation effect
      button.classList.add('adding');

      // Simulate adding to cart
      setTimeout(() => {
        button.classList.remove('adding');

        // Show notification
        showNotification(`${productName} đã được thêm vào giỏ hàng!`);
      }, 500);
    });
  });

  // Buy now buttons
  const buyButtons = document.querySelectorAll('.buy-button');

  buyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;

      // Animation
      animateButton(this);

      // Show notification
      showNotification(`Bạn đang mua sản phẩm: ${productName}`);

      // Redirect to cart (in a real app)
      // setTimeout(() => window.location.href = 'cart.html', 1000);
    });
  });

  // CTA button on banner
  const ctaButton = document.querySelector('.cta-button');

  if (ctaButton) {
    ctaButton.addEventListener('click', function () {
      animateButton(this);

      // Smooth scroll to products section
      const productsSection = document.querySelector('.products');
      if (productsSection) {
        window.scrollTo({
          top: productsSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  }

  // Add parallax effect to banner
  const banner = document.querySelector('.banner');

  if (banner) {
    window.addEventListener('scroll', function () {
      const scrollPosition = window.scrollY;
      const translateY = scrollPosition * 0.3;

      banner.style.backgroundPositionY = `-${translateY}px`;
    });
  }

  // Function to show notification
  function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);

      // Add styles for notification
      notification.style.position = 'fixed';
      notification.style.bottom = '-100px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.background = 'rgba(13, 21, 43, 0.8)';
      notification.style.color = 'white';
      notification.style.padding = '15px 25px';
      notification.style.borderRadius = '30px';
      notification.style.boxShadow = '0 0 10px rgba(89, 118, 255, 0.5)';
      notification.style.backdropFilter = 'blur(10px)';
      notification.style.WebkitBackdropFilter = 'blur(10px)';
      notification.style.zIndex = '1000';
      notification.style.transition = 'all 0.3s ease';
      notification.style.border = '1px solid rgba(89, 118, 255, 0.3)';
    }

    // Set message
    notification.textContent = message;

    // Show notification
    setTimeout(() => {
      notification.style.bottom = '30px';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.bottom = '-100px';
    }, 3000);
  }

  // Function to animate button click
  function animateButton(button) {
    button.style.transform = 'scale(0.95)';

    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  }

  // Add neon glow effect to products on mouse move
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.style.setProperty('--glow-x', `${x}px`);
      this.style.setProperty('--glow-y', `${y}px`);
    });
  });
});

// Add page transition effects
window.addEventListener('beforeunload', function () {
  document.body.classList.add('fade-out');
});

// Simulate page loading effect
window.addEventListener('load', function () {
  const body = document.body;

  // Add loading class
  body.classList.add('loading');

  // Remove loading class after page loads
  setTimeout(() => {
    body.classList.remove('loading');
  }, 500);
});