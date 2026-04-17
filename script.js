document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.querySelector('.preloader');
    const counter = document.querySelector('.loader-counter');
    let count = 0;
    
    // Lock scroll during load
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const loaderInterval = setInterval(() => {
        count += Math.floor(Math.random() * 15) + 5;
        if (count > 100) count = 100;
        counter.textContent = count < 10 ? `0${count}` : count;
        
        if (count === 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                preloader.classList.add('hide');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.body.classList.add('loaded'); // Trigger hero text animations
            }, 600);
        }
    }, 40);

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

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let cursorX = 0; let cursorY = 0;
    let outlineX = 0; let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
    });

    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for cursor
    const interactables = document.querySelectorAll('a, button, .project-card, .service-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Magnetic Buttons
    const magnets = document.querySelectorAll('.btn-main, .btn-outline, .btn-cv, .nav-brand');
    magnets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navIsland = document.querySelector('.nav-island');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navIsland.classList.toggle('menu-open');
            document.body.style.overflow = navIsland.classList.contains('menu-open') ? 'hidden' : '';
        });
    }

    // Project Parallax Tilt
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    
    if (!isMobile) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });
    }

    // Page Pathway Fill on Scroll
    const pathwayFill = document.getElementById('pathway-fill');
    if (pathwayFill) {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            pathwayFill.style.height = `${scrollPercent}%`;
        }, { passive: true });
    }

    // Parallax Footer Curtain Reveal
    const contactSection = document.getElementById('contact');
    const contactInner = contactSection ? contactSection.querySelector('.container') : null;

    if (contactSection && contactInner) {
        window.addEventListener('scroll', () => {
            const rect = contactSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight) {
                const progress = (windowHeight - rect.top) / rect.height; 
                const clamped = Math.min(Math.max(progress, 0), 1);
                
                const yOffset = (1 - clamped) * 150;
                const scale = 0.9 + (clamped * 0.1);
                
                contactInner.style.transform = `translateY(${yOffset}px) scale(${scale})`;
                contactInner.style.opacity = clamped * 1.5;
            }
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
            
            // Close mobile menu if open
            if (navIsland.classList.contains('menu-open')) {
                navIsland.classList.remove('menu-open');
                document.body.style.overflow = '';
            }

            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) lenis.scrollTo(target);
        });
    });

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
