/* ====== ULTRA POLISH — PORTFOLIO SCRIPT ====== */

const App = {
  // Initializer function
  init() {
    // Add event listeners once the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.theme.init();        // Initialize theme switcher
      this.nav.init();          // Initialize navigation effects
      this.mobileMenu.init();   // Initialize mobile menu
      this.hero.init();         // Initialize hero section animations
      this.scroll.init();       // Initialize scroll-based animations
      this.cards.init();        // Initialize card-specific effects
      this.buttons.init();      // Initialize button effects
      this.parallax.init();     // Initialize parallax effects
      this.contactForm.init();  // Initialize contact form handling
      this.search.init();       // Initialize search functionality
    });
  },

  // Theme switcher logic
  theme: {
    init() {
      const html = document.documentElement;
      const themeBtn = document.getElementById('themeToggle');
      
      // Set initial theme from local storage or default to 'dark'
      html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
      
      // Handle theme toggle button click
      themeBtn?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  },

  // Navigation effects
  nav: {
    init() {
      const navbar = document.getElementById('navbar');
      const sections = document.querySelectorAll('section[id], div[id="home"]');
      const navAnchors = document.querySelectorAll('.nav-links a');

      // Add scroll effect to navbar
      window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });

      // Highlight active nav link on scroll
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.style.color = '');
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.style.color = 'var(--text)';
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });

      sections.forEach(s => sectionObserver.observe(s));
    }
  },

  // Mobile menu logic
  mobileMenu: {
    init() {
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileClose = document.getElementById('mobileClose');

      hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
      mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
      
      // Allow closing mobile menu via a global function
      window.closeMobileMenu = () => mobileMenu?.classList.remove('open');

      // Close on outside click
      mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) mobileMenu.classList.remove('open');
      });
    }
  },

  // Hero section entrance animation
  hero: {
    init() {
      const hero = document.querySelector('.hero');
      if (hero) setTimeout(() => hero.classList.add('active'), 200);
    }
  },

  // Scroll-based animations
  scroll: {
    init() {
      // General reveal animation for sections
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');

          // Trigger counter if it's a stat item
          if (entry.target.classList.contains('stat-item')) {
            const valEl = entry.target.querySelector('.stat-val');
            if (valEl) this.animateCounter(valEl);
          }

          // Trigger progress bars
          entry.target.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.style.getPropertyValue('--progress') || getComputedStyle(bar).getPropertyValue('--progress');
          });

          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });

      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

      // Specific observer for skill columns
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.progress-fill').forEach(bar => {
            const target = bar.style.getPropertyValue('--progress');
            if (target) bar.style.width = target;
          });
          skillObserver.unobserve(entry.target);
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('.skill-column').forEach(col => skillObserver.observe(col));
    },

    // Counter animation function
    animateCounter(el) {
      if (el.dataset.started) return;
      el.dataset.started = 'true';

      const target = parseInt(el.dataset.target) || 0;
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // Ease out quart
        el.innerText = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.innerText = target;
        }
      }
      requestAnimationFrame(tick);
    }
  },

  // Card-specific effects
  cards: {
    init() {
      // Spotlight effect on glow cards
      document.querySelectorAll('.glow-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const mx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
          const my = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
          card.style.setProperty('--mx', mx);
          card.style.setProperty('--my', my);
        });
      });
    }
  },

  // Button effects
  buttons: {
    init() {
      // Magnetic effect on primary and ghost buttons
      document.querySelectorAll('.btn-primary, .btn-ghost, .btn-nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.25;
          btn.style.transform = `translate3d(${x}px,${y}px,0) scale(1.04)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    }
  },

  // Parallax effects for orbs
  parallax: {
    init() {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const o1 = document.querySelector('.orb-1');
          const o2 = document.querySelector('.orb-2');
          const o3 = document.querySelector('.orb-3');
          if (o1) o1.style.transform = `translate3d(0,${y * 0.12}px,0)`;
          if (o2) o2.style.transform = `translate3d(0,${-y * 0.08}px,0)`;
          if (o3) o3.style.transform = `translate3d(${y * 0.04}px,${y * 0.04}px,0)`;
          ticking = false;
        });
        ticking = true;
      }, { passive: true });
    }
  },

  // Contact form handling
  contactForm: {
    init() {
      const contactForm = document.getElementById('contactForm');
      const submitBtn = document.getElementById('submitBtn');

      contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!submitBtn || submitBtn.disabled) return;

        const original = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          submitBtn.innerHTML = 'Sent! I\'ll be in touch soon. <span class="material-symbols-outlined">check_circle</span>';
          submitBtn.classList.add('success');
          contactForm.reset();
        } catch (error) {
          submitBtn.innerHTML = 'Error! Please try again.';
          submitBtn.classList.add('error');
        } finally {
          setTimeout(() => {
            submitBtn.innerHTML = original;
            submitBtn.classList.remove('success', 'error');
            submitBtn.disabled = false;
          }, 4000);
        }
      });
    }
  },

  // Search overlay functionality
  search: {
    init() {
      const searchToggle = document.getElementById('searchToggle');
      const searchOverlay = document.getElementById('searchOverlay');
      const closeSearch = document.getElementById('closeSearch');
      const searchInput = document.getElementById('searchInput');

      searchToggle?.addEventListener('click', () => {
        searchOverlay?.classList.add('active');
        setTimeout(() => searchInput?.focus(), 150);
      });

      closeSearch?.addEventListener('click', () => searchOverlay?.classList.remove('active'));

      searchOverlay?.addEventListener('click', (e) => {
        if (e.target === searchOverlay) searchOverlay.classList.remove('active');
      });

      searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchOverlay?.classList.remove('active');
          return;
        }
        if (e.key === 'Enter') {
          const q = searchInput.value.trim();
          if (q) {
            const sections = {
              'home': '#home', 'hero': '#home',
              'expertise': '#expertise', 'skills': '#skills',
              'works': '#works', 'portfolio': '#works',
              'contact': '#contact',
            };
            const match = Object.keys(sections).find(k => q.toLowerCase().includes(k));
            if (match) {
              searchOverlay.classList.remove('active');
              document.querySelector(sections[match])?.scrollIntoView({ behavior: 'smooth' });
            } else {
              searchInput.style.borderColor = 'var(--accent)';
              setTimeout(() => {
                searchInput.style.borderColor = '';
                searchInput.value = '';
              }, 1200);
            }
          }
        }
      });
    }
  }
};

// Start the application
App.init();