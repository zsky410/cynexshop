// Import Firebase functions
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from './firebase-config.js';

let currentProduct = null;
let selectedVariant = null;
let selectedPackage = null;

document.addEventListener('DOMContentLoaded', async function () {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'index.html';
    return;
  }

  await loadProduct(productId);
  setupEventListeners();
});

async function loadProduct(productId) {
  try {
    console.log("Loading product:", productId);

    const productDoc = await getDoc(doc(db, "products", productId));

    if (!productDoc.exists()) {
      console.error("Product not found");
      window.location.href = 'index.html';
      return;
    }

    currentProduct = { id: productDoc.id, ...productDoc.data() };
    console.log("Product loaded:", currentProduct);

    displayProduct(currentProduct);

  } catch (error) {
    console.error("Error loading product:", error);
    window.location.href = 'index.html';
  }
}

function displayProduct(product) {
  // Update basic info
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-short-desc').textContent = product.shortDescription || '';

  // Update breadcrumb
  document.querySelector('.breadcrumb span').textContent = product.name;

  // Update image
  const productImage = document.querySelector('.product-image .placeholder');
  if (product.imageUrl) {
    productImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}">`;
  } else {
    productImage.textContent = product.name.charAt(0);
  }

  // Display variants
  displayVariants(product.variants || []);

  // Update product description content
  const descriptionContent = document.getElementById('product-description-content');
  if (descriptionContent) {
    if (product.description) {
      // Format the description - convert line breaks to paragraphs
      const formattedDescription = product.description
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line.trim()}</p>`)
        .join('');
      descriptionContent.innerHTML = formattedDescription;
    } else {
      descriptionContent.innerHTML = '<p>Thông tin chi tiết sản phẩm sẽ được cập nhật sớm.</p>';
    }
  }
}

function displayVariants(variants) {
  const packageVariants = document.getElementById('package-variants');

  if (!variants || variants.length === 0) {
    packageVariants.innerHTML = '<button class="variant-btn disabled">Không có gói nào</button>';
    return;
  }

  // Display package variants
  packageVariants.innerHTML = '';
  variants.forEach((variant, index) => {
    const button = document.createElement('button');
    button.className = 'variant-btn';
    button.textContent = variant.name;
    button.dataset.variantIndex = index;
    button.addEventListener('click', () => selectVariant(index));
    packageVariants.appendChild(button);
  });

  // Reset duration variants
  const durationVariants = document.getElementById('duration-variants');
  durationVariants.innerHTML = '<button class="variant-btn disabled">Chọn gói trước</button>';

  // Hide pricing initially
  document.getElementById('pricing-section').style.display = 'none';

  // Reset selections
  selectedVariant = null;
  selectedPackage = null;
}

function selectVariant(variantIndex) {
  selectedVariant = variantIndex;
  selectedPackage = null;

  // Update variant buttons
  document.querySelectorAll('#package-variants .variant-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === variantIndex);
  });

  // Display duration options for selected variant
  const variant = currentProduct.variants[variantIndex];
  const durationVariants = document.getElementById('duration-variants');

  durationVariants.innerHTML = '';
  variant.packages.forEach((pkg, index) => {
    const button = document.createElement('button');
    button.className = 'variant-btn';
    button.textContent = pkg.duration;
    button.dataset.packageIndex = index;
    button.addEventListener('click', () => selectPackage(index));
    durationVariants.appendChild(button);
  });

  // Hide pricing until duration is selected
  document.getElementById('pricing-section').style.display = 'none';
}

function selectPackage(packageIndex) {
  selectedPackage = packageIndex;

  // Update duration buttons
  document.querySelectorAll('#duration-variants .variant-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === packageIndex);
  });

  // Show pricing for selected package
  const variant = currentProduct.variants[selectedVariant];
  const selectedPkg = variant.packages[packageIndex];

  updatePricing(selectedPkg);
}

function updatePricing(packageData) {
  const pricingSection = document.getElementById('pricing-section');
  const oldPrice = document.getElementById('old-price');
  const currentPrice = document.getElementById('current-price');
  const discountTag = document.getElementById('discount-tag');

  // Format prices
  const formattedCurrentPrice = formatPrice(packageData.price);
  const formattedOldPrice = formatPrice(packageData.originalPrice);

  oldPrice.textContent = formattedOldPrice;
  currentPrice.textContent = formattedCurrentPrice;
  discountTag.textContent = `Tiết kiệm ${packageData.discountPercent}%`;

  // Show pricing section
  pricingSection.style.display = 'block';
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function setupEventListeners() {
  // No event listeners needed for buttons since we removed them
  console.log('Product detail page initialized');
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.classList.add('notification-container');
    document.body.appendChild(container);

    // Add some basic styling
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
  }

  const container = document.querySelector('.notification-container');

  // Create notification
  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  // Style based on type
  notification.style.padding = '12px 20px';
  notification.style.margin = '10px 0';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  notification.style.animation = 'slideIn 0.3s ease-out forwards';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.backdropFilter = 'blur(10px)';

  if (type === 'success') {
    notification.style.background = 'rgba(40, 167, 69, 0.9)';
    notification.style.border = '1px solid rgba(40, 167, 69, 0.3)';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.background = 'rgba(220, 53, 69, 0.9)';
    notification.style.border = '1px solid rgba(220, 53, 69, 0.3)';
    notification.style.color = 'white';
  } else {
    notification.style.background = 'rgba(13, 21, 43, 0.8)';
    notification.style.border = '1px solid rgba(89, 118, 255, 0.3)';
    notification.style.color = 'white';
  }

  // Add icon based on type
  let icon;
  if (type === 'success') {
    icon = '<i class="fas fa-check-circle"></i>';
  } else if (type === 'error') {
    icon = '<i class="fas fa-exclamation-circle"></i>';
  } else {
    icon = '<i class="fas fa-info-circle"></i>';
  }

  notification.innerHTML = `
    <div style="margin-right: 10px;">${icon}</div>
    <div>${message}</div>
  `;

  // Add to container
  container.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

