document.addEventListener('DOMContentLoaded', function () {
  // Force create ambient background to ensure it appears
  createGuideBackground();

  // Initialize guide functionality (if needed)
  initGuidePageFunctionality();

  // Function to manually create background animation
  function createGuideBackground() {
    // Check if canvas already exists
    if (document.querySelector('.ambient-background')) return;

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
    const particleCount = 70;

    // Create several larger glow particles
    const glowParticles = [];
    const glowParticleCount = 5;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        color: getRandomColor(),
        speedX: Math.random() * 0.7 - 0.35,
        speedY: Math.random() * 0.7 - 0.35,
        pulse: 0,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    for (let i = 0; i < glowParticleCount; i++) {
      glowParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 30,
        color: getRandomGlowColor(),
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.05 + 0.02
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

    function getRandomGlowColor() {
      const colors = [
        'rgba(5, 117, 230, 0.15)',
        'rgba(107, 37, 251, 0.15)',
        'rgba(0, 242, 96, 0.1)'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw glow particles
      glowParticles.forEach(particle => {
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');

        // Draw glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Move glow
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check for glow
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
      });

      particles.forEach((particle, index) => {
        // Pulse effect for particles
        particle.pulse += particle.pulseSpeed;
        const pulseOpacity = 0.5 + Math.sin(particle.pulse) * 0.2;

        // Draw particle with pulsing opacity
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.7', pulseOpacity);
        ctx.fill();

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw connections with pulsing opacity
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const lineOpacity = (150 - distance) / 150 * 0.2 * pulseOpacity;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(89, 118, 255, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
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

    // Handle window resize
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Add mouse interaction
    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', function (event) {
      mouse.x = event.x;
      mouse.y = event.y;

      // Make particles near the mouse move faster
      particles.forEach(particle => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          particle.x += Math.cos(angle) * force * 1;
          particle.y += Math.sin(angle) * force * 1;
        }
      });
    });
  }

  // Additional guide page functionality
  function initGuidePageFunctionality() {
    // Add interactive functionality for the guide steps if needed
    const stepCards = document.querySelectorAll('.step-card');

    stepCards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      });

      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    });
  }
});