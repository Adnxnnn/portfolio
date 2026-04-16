document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Smooth Scroll with Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Theme Toggle
    const toggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateIcons(savedTheme);

    toggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcons(next);
    });

    function updateIcons(theme) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }

    // Scroll Reveal (Intersection Observer)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // Number Scramble Effect
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                scrambleText(entry.target);
                entry.target.dataset.scrambled = "true";
            }
        });
    }, { threshold: 1.0 });

    document.querySelectorAll('.label-mono').forEach(el => scrambleObserver.observe(el));

    function scrambleText(element) {
        const finalContent = element.textContent;
        const chars = "0123456783X9#@$%";
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.innerText = finalContent.split("")
                .map((char, index) => {
                    if (index < iterations) return finalContent[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iterations >= finalContent.length) clearInterval(interval);
            iterations += 1/3;
        }, 50);
    }

    // Project Parallax Tilt
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30; /* Less aggressive tilt */
            const rotateY = (centerX - x) / 30;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // Pathway Fill on Scroll
    const projectsSection = document.getElementById('projects');
    const pathwayFill = document.getElementById('pathway-fill');

    if (projectsSection && pathwayFill) {
        window.addEventListener('scroll', () => {
            const rect = projectsSection.getBoundingClientRect();
            const trigger = window.innerHeight * 0.5;
            const progress = (trigger - rect.top) / rect.height;
            const clamped = Math.max(0, Math.min(1, progress));
            pathwayFill.style.height = `${clamped * 100}%`;
        }, { passive: true });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.nav-island');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Smooth anchor navigation via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) lenis.scrollTo(target);
        });
    });

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
