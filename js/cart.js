document.addEventListener('DOMContentLoaded', function () {
  initCartFunctionality();

  function initCartFunctionality() {
    // Quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-decrease');
    const increaseButtons = document.querySelectorAll('.quantity-increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.remove-btn');

    // Add event listeners for quantity decrease
    decreaseButtons.forEach(button => {
      button.addEventListener('click', function () {
        const input = this.nextElementSibling;
        let value = parseInt(input.value);

        if (value > 1) {
          value--;
          input.value = value;
          updateCartItem(this.closest('.cart-item'), value);
        }
      });
    });

    // Add event listeners for quantity increase
    increaseButtons.forEach(button => {
      button.addEventListener('click', function () {
        const input = this.previousElementSibling;
        let value = parseInt(input.value);

        value++;
        input.value = value;
        updateCartItem(this.closest('.cart-item'), value);
      });
    });

    // Add event listeners for quantity input
    quantityInputs.forEach(input => {
      input.addEventListener('change', function () {
        let value = parseInt(this.value);

        if (isNaN(value) || value < 1) {
          value = 1;
          this.value = value;
        }

        updateCartItem(this.closest('.cart-item'), value);
      });
    });

    // Add event listeners for remove buttons
    removeButtons.forEach(button => {
      button.addEventListener('click', function () {
        const cartItem = this.closest('.cart-item');

        // Animation
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(20px)';
        cartItem.style.transition = 'all 0.3s ease';

        setTimeout(() => {
          cartItem.remove();
          updateCartTotal();
          checkEmptyCart();
        }, 300);

        // Show notification
        showNotification('Sản phẩm đã được xóa khỏi giỏ hàng');
      });
    });

    // Continue shopping button
    const continueButton = document.querySelector('.continue-shopping');
    if (continueButton) {
      continueButton.addEventListener('click', function () {
        window.location.href = 'index.html';
      });
    }

    // Checkout button
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function () {
        // In a real application, this would redirect to a checkout page
        // For now, show a notification
        showNotification('Đang chuyển hướng đến trang thanh toán...', 'info');

        // Simulate loading
        this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
        this.disabled = true;

        // Reset after 2 seconds
        setTimeout(() => {
          this.innerHTML = '<span>Thanh toán ngay</span><i class="fas fa-arrow-right"></i>';
          this.disabled = false;

          // Show success notification
          showNotification('Chức năng thanh toán đang được phát triển!', 'info');
        }, 2000);
      });
    }

    // Promo code button
    const applyPromoButton = document.querySelector('.apply-btn');
    const promoInput = document.querySelector('.promo-input input');

    if (applyPromoButton && promoInput) {
      applyPromoButton.addEventListener('click', function () {
        const code = promoInput.value.trim();

        if (code === '') {
          showNotification('Vui lòng nhập mã giảm giá', 'error');
          return;
        }

        // Animation
        this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        this.disabled = true;

        // Simulate API call
        setTimeout(() => {
          // Reset button
          this.innerHTML = 'Áp dụng';
          this.disabled = false;

          // For demo purposes, only accept a specific code
          if (code.toUpperCase() === 'CYNEX10') {
            showNotification('Mã giảm giá đã được áp dụng!', 'success');

            // Update cart total to reflect discount
            const summaryRows = document.querySelectorAll('.summary-row');

            if (summaryRows.length >= 3) {
              // Create a new discount row if it doesn't exist
              if (!document.querySelector('.discount-row')) {
                const discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount-row';
                discountRow.innerHTML = '<span>Giảm giá (10%)</span><span>-317,000 đ</span>';

                // Insert before the divider
                const divider = document.querySelector('.summary-divider');
                divider.parentNode.insertBefore(discountRow, divider);

                // Update total
                const totalElement = document.querySelector('.summary-row.total span:last-child');
                totalElement.textContent = '3,170,000 đ';
              }
            }
          } else {
            showNotification('Mã giảm giá không hợp lệ', 'error');
          }
        }, 1500);
      });
    }

    // Initialize cart
    updateCartTotal();
    checkEmptyCart();
  }

  function updateCartItem(cartItem, quantity) {
    // In a real app, this would update the item total based on price and quantity
    // For this demo, we'll just update the overall cart total
    updateCartTotal();
  }

  function updateCartTotal() {
    // In a real app, this would recalculate all totals based on items and quantities
    // For this demo, we'll simply keep the existing values

    // If we need to recalculate, we would do something like:
    /*
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace(/[^\d]/g, ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        subtotal += price * quantity;
    });

    // Update subtotal
    document.querySelector('.summary-row:first-child span:last-child').textContent = formatPrice(subtotal);

    // Update tax
    const tax = subtotal * 0.1;
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = formatPrice(tax);

    // Update total
    document.querySelector('.summary-row.total span:last-child').textContent = formatPrice(subtotal + tax);
    */
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  }

  function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartContent = document.querySelector('.cart-content');
    const emptyCart = document.querySelector('.empty-cart');

    if (cartItems.length === 0 && cartContent && emptyCart) {
      cartContent.style.display = 'none';
      emptyCart.style.display = 'block';
    }
  }

  function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.cart-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'cart-notification';
      document.body.appendChild(notification);

      // Add styles for notification
      notification.style.position = 'fixed';
      notification.style.bottom = '-100px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.padding = '15px 25px';
      notification.style.borderRadius = '10px';
      notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
      notification.style.backdropFilter = 'blur(10px)';
      notification.style.WebkitBackdropFilter = 'blur(10px)';
      notification.style.zIndex = '1000';
      notification.style.transition = 'all 0.3s ease';
      notification.style.fontSize = '14px';
      notification.style.fontWeight = '500';
      notification.style.display = 'flex';
      notification.style.alignItems = 'center';
      notification.style.gap = '10px';
    }

    // Set type-specific styles
    if (type === 'success') {
      notification.style.background = 'rgba(0, 183, 74, 0.9)';
      notification.style.color = 'white';
      notification.style.border = '1px solid rgba(0, 183, 74, 0.3)';
      notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else if (type === 'error') {
      notification.style.background = 'rgba(255, 69, 58, 0.9)';
      notification.style.color = 'white';
      notification.style.border = '1px solid rgba(255, 69, 58, 0.3)';
      notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else if (type === 'info') {
      notification.style.background = 'rgba(89, 118, 255, 0.9)';
      notification.style.color = 'white';
      notification.style.border = '1px solid rgba(89, 118, 255, 0.3)';
      notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }

    // Show notification
    setTimeout(() => {
      notification.style.bottom = '30px';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.bottom = '-100px';
    }, 3000);
  }
});