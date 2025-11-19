// Enhanced UI interactions and animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                entry.target.style.animationDelay = `${index * 100}ms`;
            fadeInObserver.unobserve(entry.target);
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el) => fadeInObserver.observe(el));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
                const headerOffset = 80;
            const offsetPosition = target.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
            history.pushState(null, '', href);
                target.setAttribute('tabindex', '-1');
                target.focus();
        });
    });

    // Hero parallax + navbar state
    let ticking = false;
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-visual');
        const heroContent = document.querySelector('.hero-content');
        const navbar = document.querySelector('.navbar');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            const opacity = Math.max(0, 1 - scrolled / (window.innerHeight * 0.7));
            const scale = Math.max(0.9, 1 - scrolled / (window.innerHeight * 2));
            
            if (heroContent) {
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `scale(${scale}) translateY(${scrolled * 0.1}px)`;
            }
        }

        if (navbar) {
            const isScrolled = scrolled > 100;
            navbar.style.background = isScrolled
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = isScrolled ? 'blur(20px)' : 'blur(15px)';
        }
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
    });

    handleScroll();

    // Ripple effect on buttons
    document.querySelectorAll('.btn, .hero-cta').forEach((button) => {
        button.addEventListener('mouseenter', () => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Treatment pill hover feedback
    document.querySelectorAll('.treatment-pill').forEach((pill) => {
        pill.addEventListener('mouseenter', (event) => {
            const rect = pill.getBoundingClientRect();
            pill.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
            pill.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
        });
    });

    // Doctor card tilt effect
    document.querySelectorAll('.doctor-card').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-16px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Counter animation helper
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    };

    // Lazy-load images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
                const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.onload = () => {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                };
            }
                observer.unobserve(img);
        });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));

    window.addEventListener('load', () => document.body.classList.add('loaded'));

    // Scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1a5f3a, #4caf50, #ffd700);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    const updateScrollProgress = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = windowHeight === 0 ? 0 : (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    // Custom cursor (hidden by default but ready for future use)
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #4caf50;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0;
        display: none;
    `;
    document.body.appendChild(cursor);

    // Count-up support
    document.querySelectorAll('[data-count]').forEach((element) => {
        fadeInObserver.observe(element);
        element.addEventListener('animationstart', () => {
            const target = parseInt(element.dataset.count, 10);
            if (!Number.isNaN(target)) {
            animateCounter(element, target);
            }
        }, { once: true });
    });

    // Optional hero particle effect
    const createParticle = () => {
        const hero = document.querySelector('.hero-visual');
        if (!hero) return;
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float-up 10s linear;
        `;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = '0';
        hero.appendChild(particle);
        setTimeout(() => particle.remove(), 10000);
    };
    // setInterval(createParticle, 2000);

    // Inject keyframes for helper effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            to {
                transform: translateY(-100vh);
                opacity: 0;
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            animation: ripple-animation 0.6s;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        body.loaded {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    console.log('%c🌿 Welcome to Guru Parampara - Shree Vishwa Asha Ayurvedic Panchakarma Centre', 'color: #1a5f3a; font-size: 16px; font-weight: bold;');
    console.log('%cWebsite designed with modern UI/UX practices', 'color: #4caf50; font-size: 12px;');
});

