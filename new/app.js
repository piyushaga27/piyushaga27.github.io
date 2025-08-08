// Matrix Background Effect
class MatrixBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.matrixContainer = document.getElementById('matrix');
    this.matrixContainer.appendChild(this.canvas);
    
    this.characters = '01アカサタナハマヤラワ'.split('');
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    
    this.init();
    this.animate();
  }
  
  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }
  
  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = this.fontSize + 'px monospace';
    
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters[Math.floor(Math.random() * this.characters.length)];
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
      
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  resize() {
    this.init();
  }
}

// Typing Animation for Job Titles
class TypingAnimation {
  constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.pauseTime = pauseTime;
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    
    this.start();
  }
  
  start() {
    this.type();
  }
  
  type() {
    const fullText = this.texts[this.currentIndex];
    
    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }
    
    this.element.textContent = this.currentText;
    
    let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    
    if (!this.isDeleting && this.currentText === fullText) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// Navigation Controller
class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  bindEvents() {
    // Mobile menu toggle
    this.navToggle.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
      });
    });
    
    // Smooth scroll for navigation links - FIXED
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            const navbarHeight = this.navbar.offsetHeight || 70;
            const offsetTop = targetSection.offsetTop - navbarHeight;
            
            // Use both scrollTo and scrollIntoView for better compatibility
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
            
            // Update active link immediately
            this.setActiveLink(link);
          }
        }
      });
    });
    
    // Handle scroll events with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
        this.highlightActiveSection();
      }, 10);
    });
  }
  
  setActiveLink(activeLink) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }
  
  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
  }
  
  highlightActiveSection() {
    const scrollPos = window.scrollY + 100;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Animate On Scroll (AOS) Implementation
class AOS {
  constructor() {
    this.elements = document.querySelectorAll('[data-aos]');
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkElements();
  }
  
  bindEvents() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.checkElements();
      }, 10);
    });
  }
  
  checkElements() {
    this.elements.forEach((element, index) => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      if (scrollTop + windowHeight > elementTop + 100) {
        const delay = element.dataset.aosDelay || 0;
        setTimeout(() => {
          element.classList.add('aos-animate');
        }, delay);
      }
    });
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Add floating label effect
      const inputs = this.form.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            input.parentNode.classList.remove('focused');
          }
        });
        
        // Check if input has value on load
        if (input.value) {
          input.parentNode.classList.add('focused');
        }
      });
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const action = this.form.getAttribute('action');
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.querySelector('.btn__text').textContent;
    
    // Basic validation
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('email'))) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    
    submitButton.querySelector('.btn__text').textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        this.form.reset();
        this.showNotification('Message sent successfully!', 'success');

        // Remove focused class from form groups
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('focused'));
      } else {
        this.showNotification('Something went wrong. Try again later.', 'error');
      }
    } catch (error) {
      this.showNotification('An error occurred. Please try again.', 'error');
    } finally {
      submitButton.querySelector('.btn__text').textContent = originalText;
      submitButton.disabled = false;
    }
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 2rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: #00ff41; color: #0a0a0a;' : 'background: #ff0040;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// Particle System for Enhanced Visual Effects
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    
    this.init();
  }
  
  init() {
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.3;
    `;
    
    document.body.appendChild(this.canvas);
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: ['#00ff41', '#00d9ff', '#b300ff'][Math.floor(Math.random() * 3)]
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // Draw connections
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Enhanced Scroll Effects
class ScrollEffects {
  constructor() {
    this.init();
  }
  
  init() {
    // Parallax effect for hero section
    this.handleParallax();
    
    // Smooth reveal animations
    this.handleRevealAnimations();
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.handleParallax();
      }, 10);
    });
  }
  
  handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    floatingCards.forEach((card, index) => {
      if (scrolled < window.innerHeight) {
        const speed = 0.2 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
      }
    });
  }
  
  handleRevealAnimations() {
    const cards = document.querySelectorAll('.achievement-card, .project-card, .skill-category');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.8s ease forwards';
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
      observer.observe(card);
    });
  }
}

// Enhanced Cursor (only for desktop)
class EnhancedCursor {
  constructor() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    this.cursor = document.createElement('div');
    this.cursorTrail = document.createElement('div');
    this.init();
  }
  
  init() {
    // Main cursor
    this.cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: #00ff41;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
      opacity: 0.8;
    `;
    
    // Cursor trail
    this.cursorTrail.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 1px solid #00ff41;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.2s ease;
      opacity: 0.5;
    `;
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorTrail);
    
    this.bindEvents();
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      if (this.cursor && this.cursorTrail) {
        this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        this.cursorTrail.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
    });
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .achievement-card, .project-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (this.cursor && this.cursorTrail) {
          this.cursor.style.transform += ' scale(1.5)';
          this.cursorTrail.style.transform += ' scale(1.2)';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        if (this.cursor && this.cursorTrail) {
          this.cursor.style.transform = this.cursor.style.transform.replace(' scale(1.5)', '');
          this.cursorTrail.style.transform = this.cursorTrail.style.transform.replace(' scale(1.2)', '');
        }
      });
    });
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 20px #00ff41;
    }
    50% {
      text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41;
    }
  }
  
  .neon-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  /* Ensure smooth scrolling is supported */
  html {
    scroll-behavior: smooth;
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Matrix background
  const matrix = new MatrixBackground();
  
  // Initialize typing animation
  const typingElement = document.getElementById('typing-text');
  const jobTitles = ['Ethical Hacker', 'Cyber Security Expert', 'Security Researcher', 'Bug Bounty Hunter'];
  new TypingAnimation(typingElement, jobTitles, 100, 50, 2000);
  
  // Initialize navigation
  new Navigation();
  
  // Initialize AOS
  new AOS();
  
  // Initialize form handler
  new FormHandler();
  
  // Initialize particle system and enhanced cursor (only on desktop for performance)
  if (window.innerWidth > 768) {
    new ParticleSystem();
    new EnhancedCursor();
  }
  
  // Initialize scroll effects
  new ScrollEffects();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    matrix.resize();
  });
  
  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});