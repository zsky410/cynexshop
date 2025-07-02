document.addEventListener('DOMContentLoaded', function () {
  // Toggle password visibility
  const togglePassword = document.querySelector('.toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', function () {
      const passwordInput = document.querySelector('#password');

      // Toggle eye icon
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');

      // Toggle password visibility
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // Animation effect
      passwordInput.style.borderColor = 'rgba(89, 118, 255, 0.8)';
      setTimeout(() => {
        passwordInput.style.borderColor = '';
      }, 300);
    });
  }

  // Handle form submission
  const authForm = document.querySelector('.auth-form');
  if (authForm) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Add button loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
      submitButton.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> ' + originalText;

        // Show success notification
        showAuthNotification('Authentication successful!', 'success');

        // Reset button after 1.5 seconds
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;

          // If this is a login form, redirect to home page (simulated)
          if (document.title.includes('Đăng nhập')) {
            // Redirect to home page
            // window.location.href = 'index.html';
          }
        }, 1500);
      }, 2000);
    });
  }

  // Input focus effects
  const inputs = document.querySelectorAll('.input-with-icon input');

  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      const icon = this.parentElement.querySelector('i:first-child');
      if (icon) {
        icon.style.color = 'var(--accent-color-1)';
      }
    });

    input.addEventListener('blur', function () {
      const icon = this.parentElement.querySelector('i:first-child');
      if (icon) {
        icon.style.color = '';
      }
    });
  });

  // Function to show styled notifications for auth pages
  function showAuthNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.auth-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'auth-notification';
      document.body.appendChild(notification);

      // Add styles for notification
      notification.style.position = 'fixed';
      notification.style.top = '-100px';
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
      notification.style.top = '30px';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.top = '-100px';
    }, 3000);
  }

  // Add ambient background animation
  createAmbientBackground();

  function createAmbientBackground() {
    // Create canvas for ambient background
    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    canvas.style.pointerEvents = 'none';

    // Insert canvas at the beginning of body
    document.body.insertBefore(canvas, document.body.firstChild);

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get context
    const ctx = canvas.getContext('2d');

    // Create particles
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: getRandomColor(),
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
      });
    }

    function getRandomColor() {
      const colors = [
        'rgba(5, 117, 230, 0.7)',
        'rgba(107, 37, 251, 0.7)',
        'rgba(0, 242, 96, 0.7)'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(89, 118, 255, ${(150 - distance) / 150 * 0.2})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });
    }

    // Start animation
    animate();

    // Resize handler
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
});