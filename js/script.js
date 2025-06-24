// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjMD1puDZnEt45xIGRXO2BGHmsDMZxK1g",
  authDomain: "cynexshop-cacef.firebaseapp.com",
  projectId: "cynexshop-cacef",
  storageBucket: "cynexshop-cacef.appspot.com",
  messagingSenderId: "16356634788",
  appId: "1:16356634788:web:ef7e77a9bb84ba66b43631",
  measurementId: "G-J36RRJQ27L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

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

  // Load products from Firebase
  const productGrid = document.querySelector('.product-grid');
  if (productGrid) {
    loadProducts(productGrid);
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
  function addGlowEffectToProducts() {
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
  }
});

// Function to load products from Firebase
async function loadProducts(productGrid) {
  try {
    // Show loading state
    productGrid.innerHTML = '<div class="loading-products">Đang tải sản phẩm...</div>';

    // Get products from Firestore
    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
    const querySnapshot = await getDocs(productsQuery);

    // Clear loading
    productGrid.innerHTML = '';

    if (querySnapshot.empty) {
      productGrid.innerHTML = '<div class="no-products">Không có sản phẩm nào</div>';
      return;
    }

    // Add products to grid
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      // Get lowest price from variants
      let lowestPrice = Infinity;
      let highestOriginalPrice = 0;

      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          if (variant.packages && variant.packages.length > 0) {
            variant.packages.forEach(pkg => {
              if (pkg.price < lowestPrice) {
                lowestPrice = pkg.price;
              }
              if (pkg.originalPrice > highestOriginalPrice) {
                highestOriginalPrice = pkg.originalPrice;
              }
            });
          }
        });
      }

      // Fallback to legacy packages structure if variants don't exist
      if (lowestPrice === Infinity && product.packages && product.packages.length > 0) {
        product.packages.forEach(pkg => {
          if (pkg.price < lowestPrice) {
            lowestPrice = pkg.price;
          }
          if (pkg.originalPrice > highestOriginalPrice) {
            highestOriginalPrice = pkg.originalPrice;
          }
        });
      }

      // Calculate discount
      const discountPercent = lowestPrice !== Infinity && highestOriginalPrice > 0
        ? Math.round((1 - lowestPrice / highestOriginalPrice) * 100)
        : 0;

      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <a href="product-detail.html?id=${productId}" class="product-link">
          <span class="discount-percent">-${discountPercent}%</span>
          <div class="product-image">
            ${product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.name}">`
          : `<div class="placeholder">
                  <div class="product-category">${product.type}</div>
                  ${product.name.split(' ').slice(0, 2).join(' ')}
                </div>`
        }
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-pricing">
              <div class="current-price">${formatPrice(lowestPrice)}</div>
              <div class="original-price">${formatPrice(highestOriginalPrice)}</div>
            </div>
          </div>
        </a>
      `;

      productGrid.appendChild(productCard);
    });

    // Add glow effect to new products
    addGlowEffectToProducts();

  } catch (error) {
    console.error("Error loading products: ", error);
    productGrid.innerHTML = '<div class="error-loading">Lỗi khi tải sản phẩm</div>';
  }
}

// Function to format price
function formatPrice(price) {
  if (!price) return '0đ';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
}

// Add neon glow effect to products on mouse move
function addGlowEffectToProducts() {
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
}

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