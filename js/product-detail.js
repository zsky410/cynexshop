document.addEventListener('DOMContentLoaded', function () {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Add active class to corresponding content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Quantity selector
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  const qtyInput = document.querySelector('.qty-input');

  minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    const maxValue = parseInt(qtyInput.getAttribute('max'));
    if (currentValue < maxValue) {
      qtyInput.value = currentValue + 1;
    }
  });

  // Variant selection
  const variantButtons = document.querySelectorAll('.variant-btn');
  variantButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Find the parent variant group
      const variantGroup = button.closest('.variant-group');

      // Remove active class from all buttons in this group
      variantGroup.querySelectorAll('.variant-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // Add active class to clicked button
      button.classList.add('active');

      // Update price based on selected variants
      updatePrice();
    });
  });

  // Function to update price based on selected variants
  function updatePrice() {
    const selectedPackage = document.querySelector('.variant-group:nth-child(1) .variant-btn.active').textContent;
    const selectedDuration = document.querySelector('.variant-group:nth-child(2) .variant-btn.active').textContent;

    // Price mapping (normally this would come from a database or API)
    const priceMap = {
      'Adobe CC Individual': {
        '1 tháng': { price: 250000, oldPrice: 300000 },
        '12 tháng': { price: 2500000, oldPrice: 3125000 },
        '24 tháng': { price: 4500000, oldPrice: 5625000 }
      },
      'Adobe CC Business': {
        '1 tháng': { price: 350000, oldPrice: 420000 },
        '12 tháng': { price: 3500000, oldPrice: 4200000 },
        '24 tháng': { price: 6300000, oldPrice: 7560000 }
      },
      'Adobe CC Student': {
        '1 tháng': { price: 150000, oldPrice: 180000 },
        '12 tháng': { price: 1500000, oldPrice: 1800000 },
        '24 tháng': { price: 2700000, oldPrice: 3240000 }
      }
    };

    // Format price to Vietnamese currency
    function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    }

    // Update displayed prices
    if (priceMap[selectedPackage] && priceMap[selectedPackage][selectedDuration]) {
      const priceData = priceMap[selectedPackage][selectedDuration];
      document.querySelector('.current-price').textContent = formatPrice(priceData.price);
      document.querySelector('.old-price').textContent = formatPrice(priceData.oldPrice);

      // Calculate discount percentage
      const discountPercent = Math.round((1 - priceData.price / priceData.oldPrice) * 100);
      document.querySelector('.discount-tag').textContent = `Tiết kiệm ${discountPercent}%`;
    }
  }

  // Product action buttons
  const buyNowBtn = document.querySelector('.buy-now-btn');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const wishlistBtn = document.querySelector('.wishlist-btn');

  buyNowBtn.addEventListener('click', function () {
    const productTitle = document.querySelector('.product-info h1').textContent;
    const quantity = parseInt(document.querySelector('.qty-input').value);
    const selectedPackage = document.querySelector('.variant-group:nth-child(1) .variant-btn.active').textContent;
    const selectedDuration = document.querySelector('.variant-group:nth-child(2) .variant-btn.active').textContent;

    console.log('Buy Now clicked!');
    console.log('Product:', productTitle);
    console.log('Quantity:', quantity);
    console.log('Package:', selectedPackage);
    console.log('Duration:', selectedDuration);

    // Redirect to checkout page (in a real implementation)
    // window.location.href = 'checkout.html';

    // For demo purposes - show notification
    showNotification('Đang chuyển đến trang thanh toán...', 'success');

    // In real implementation, would initialize checkout process here
  });

  addToCartBtn.addEventListener('click', function () {
    const productTitle = document.querySelector('.product-info h1').textContent;
    const quantity = parseInt(document.querySelector('.qty-input').value);
    const selectedPackage = document.querySelector('.variant-group:nth-child(1) .variant-btn.active').textContent;
    const selectedDuration = document.querySelector('.variant-group:nth-child(2) .variant-btn.active').textContent;

    console.log('Add to Cart clicked!');
    console.log('Product:', productTitle);
    console.log('Quantity:', quantity);
    console.log('Package:', selectedPackage);
    console.log('Duration:', selectedDuration);

    // In a real implementation, would add to cart via API/localStorage here

    // Show notification
    showNotification('Sản phẩm đã được thêm vào giỏ hàng', 'success');

    // Update cart icon
    updateCartIcon();
  });

  wishlistBtn.addEventListener('click', function () {
    // Toggle wishlist icon
    const wishlistIcon = wishlistBtn.querySelector('i');

    if (wishlistIcon.classList.contains('far')) {
      wishlistIcon.classList.remove('far');
      wishlistIcon.classList.add('fas');
      showNotification('Đã thêm vào danh sách yêu thích', 'info');
    } else {
      wishlistIcon.classList.remove('fas');
      wishlistIcon.classList.add('far');
      showNotification('Đã xóa khỏi danh sách yêu thích', 'info');
    }
  });

  // Load more reviews button
  const loadMoreBtn = document.querySelector('.load-more-btn');

  loadMoreBtn.addEventListener('click', function () {
    // In a real implementation, would load more reviews via API
    // For demo, we'll simulate additional reviews

    const reviewList = document.querySelector('.review-list');

    // Sample review data
    const newReviews = [
      {
        initials: 'PT',
        name: 'Phạm Tùng',
        rating: 5,
        date: '01/04/2023',
        content: 'Sản phẩm chất lượng, giao dịch nhanh chóng và an toàn. Tôi đã sử dụng dịch vụ của CYNEX nhiều lần và luôn hài lòng với trải nghiệm mua hàng.'
      },
      {
        initials: 'VT',
        name: 'Vũ Thắng',
        rating: 4,
        date: '25/03/2023',
        content: 'Adobe CC hoạt động rất tốt trên máy M1 của tôi. Các ứng dụng khởi động nhanh hơn nhiều so với phiên bản cũ. Tuy nhiên, tôi thấy giá vẫn hơi cao so với các đối thủ cạnh tranh mới.'
      }
    ];

    // Create and append new review elements
    newReviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review-item');

      // Generate star icons based on rating
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          starsHTML += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === review.rating) {
          starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
          starsHTML += '<i class="far fa-star"></i>';
        }
      }

      reviewElement.innerHTML = `
        <div class="reviewer-info">
          <div class="avatar">${review.initials}</div>
          <div class="name-rating">
            <div class="reviewer-name">${review.name}</div>
            <div class="review-rating">
              ${starsHTML}
            </div>
          </div>
          <div class="review-date">${review.date}</div>
        </div>
        <div class="review-content">
          <p>${review.content}</p>
        </div>
      `;

      reviewList.appendChild(reviewElement);
    });

    // Hide load more button to indicate all reviews are loaded
    loadMoreBtn.style.display = 'none';

    // Show notification
    showNotification('Đã tải thêm đánh giá', 'info');
  });

  // Write review button
  const writeReviewBtn = document.querySelector('.write-review-btn');

  writeReviewBtn.addEventListener('click', function () {
    // In a real implementation, would show a modal or navigate to review form
    showNotification('Tính năng đánh giá sẽ sớm được triển khai', 'info');
  });

  // Notification system
  function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification-container')) {
      const container = document.createElement('div');
      container.classList.add('notification-container');
      document.body.appendChild(container);

      // Add some basic styling
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '1000';
    }

    const container = document.querySelector('.notification-container');

    // Create notification
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);

    // Style the notification
    notification.style.padding = '12px 20px';
    notification.style.margin = '0 0 10px 0';
    notification.style.borderRadius = '8px';
    notification.style.color = '#fff';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    notification.style.animation = 'slideIn 0.3s forwards';

    // Set background color based on type
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else if (type === 'warning') {
      notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else { // info
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }

    // Add icon based on type
    let icon = '';
    if (type === 'success') {
      icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
      icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === 'warning') {
      icon = '<i class="fas fa-exclamation-triangle"></i>';
    } else { // info
      icon = '<i class="fas fa-info-circle"></i>';
    }

    // Set content
    notification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 10px; font-size: 1.2rem;">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Add event listener to close button
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => {
        notification.remove();
      }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Helper function to update cart icon
  function updateCartIcon() {
    // In a real implementation, would update cart count from actual cart data
    // For demo, we'll just add a cart count badge if it doesn't exist

    const cartIcon = document.querySelector('.cart-icon');

    if (!cartIcon.querySelector('.cart-count')) {
      const cartCount = document.createElement('span');
      cartCount.classList.add('cart-count');
      cartCount.textContent = '1';

      // Style the cart count badge
      cartCount.style.position = 'absolute';
      cartCount.style.top = '-8px';
      cartCount.style.right = '-8px';
      cartCount.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      cartCount.style.color = 'white';
      cartCount.style.borderRadius = '50%';
      cartCount.style.width = '18px';
      cartCount.style.height = '18px';
      cartCount.style.display = 'flex';
      cartCount.style.alignItems = 'center';
      cartCount.style.justifyContent = 'center';
      cartCount.style.fontSize = '10px';
      cartCount.style.fontWeight = 'bold';

      // Make the cart icon position relative if it isn't already
      if (getComputedStyle(cartIcon).position === 'static') {
        cartIcon.style.position = 'relative';
      }

      cartIcon.appendChild(cartCount);
    } else {
      // If cart count already exists, increment it
      const cartCount = cartIcon.querySelector('.cart-count');
      cartCount.textContent = parseInt(cartCount.textContent) + 1;
    }
  }
});