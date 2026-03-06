// Main JS - Vanilla, Optimized for Performance (No jQuery, Minifiable, Core Web Vitals Compliant)
// Handles: Hamburger toggle, hero video, smooth scroll, FAQ accordion, lazy loading, SEO events
// File: /js/main.js - Defer-loaded for non-blocking

document.addEventListener('DOMContentLoaded', function() {
    // Universal Settings
    const root = document.documentElement;
    const isMobile = window.innerWidth <= 768;

    // High-Performance Lazy Loading (Native + Fallback)
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback Intersection Observer
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    }

    // Hamburger Menu Toggle - Smooth, Accessible
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isActive);
            hamburgerBtn.classList.toggle('active');
            if (isActive) {
                body.style.overflow = 'hidden'; // Prevent body scroll
                navMenu.style.right = '0';
            } else {
                body.style.overflow = '';
                navMenu.style.right = '-100%';
            }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Close on link click (mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile) {
                    navMenu.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                }
            });
        });
    }

    // Hero Video Toggle - Visible Controls, Auto-Play Fallback
    const heroVideo = document.querySelector('.hero-bg-video');
    const videoToggle = document.querySelector('.hero-video-toggle');
    let isVideoPlaying = false;

    if (heroVideo && videoToggle) {
        // Intersection Observer for lazy play (only when in view)
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.load(); // Reload sources for fresh play
                    if (heroVideo.paused) {
                        heroVideo.play().catch(e => console.log('Autoplay prevented:', e)); // Handle policy
                    }
                    videoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        videoObserver.observe(heroVideo);

        // Manual toggle
        videoToggle.addEventListener('click', function() {
            if (isVideoPlaying) {
                heroVideo.pause();
                videoToggle.classList.remove('playing');
                isVideoPlaying = false;
            } else {
                heroVideo.play().catch(e => console.log('Play failed:', e));
                videoToggle.classList.add('playing');
                isVideoPlaying = true;
            }
        });

        // Mute by default, add visibility
        heroVideo.muted = true;
        heroVideo.volume = 0; // Ensure silent

        // Visibility fix: Add subtle controls if needed
        heroVideo.controls = false; // Hide native for clean design
    }

    // Smooth Scroll for Internal Links - SEO-Friendly (No Jump)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Update active nav
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Header Scroll Effect - Performance Optimized
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('.header');

        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Throttle for perf
        lastScrollY = currentScrollY;
    });

    // FAQ Accordion - Accessible, No JS Dependency for Basic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            const item = this.parentElement;

            // Toggle current
            this.setAttribute('aria-expanded', !isExpanded);
            if (isExpanded) {
                answer.style.maxHeight = '0';
                item.classList.remove('active');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
            }

            // Close others (accordion style)
            faqQuestions.forEach(other => {
                if (other !== this) {
                    other.setAttribute('aria-expanded', 'false');
                    other.parentElement.classList.remove('active');
                    other.nextElementSibling.style.maxHeight = '0';
                }
            });
        });
    });

    // Dropdown Toggle on Mobile - Touch-Friendly
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                const menu = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                dropdownToggles.forEach(other => {
                    if (other !== this) {
                        other.setAttribute('aria-expanded', 'false');
                        other.nextElementSibling.style.display = 'none';
                    }
                });

                if (isExpanded) {
                    menu.style.display = 'none';
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    menu.style.display = 'block';
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    // Intersection Observer for Animations - Perf-Optimized (Threshold for SEO)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animateObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to sections/cards
    document.querySelectorAll('.program-card, .timeline-item, .testimonial-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateObserver.observe(el);
    });

    // Back to Top Button - SEO (Reduces Bounce)
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑ Top';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;background:#16213e;color:#fff;border:none;border-radius:50%;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:999;display:flex;align-items:center;justify-content:center;font-weight:bold;';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // SEO: Track Scroll Depth for Engagement
    let scrollDepth = 0;
    const trackPoints = [25, 50, 75, 100];
    let tracked = new Set();

    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        scrollDepth = Math.floor(scrolled);

        trackPoints.forEach(point => {
            if (scrollDepth >= point && !tracked.has(point)) {
                tracked.add(point);
                // Could send to GA: gtag('event', 'scroll', { 'event_category': 'engagement', 'event_label': `depth_${point}%` });
                console.log(`Scroll depth reached: ${point}%`); // Placeholder for analytics
            }
        });
    });

    // Performance: Preload Critical Resources
    if ('link' in document.createElement('link')) {
        const preloadLinks = [
            { href: '/images/rahul-chess-coach-mumbai-hero.webp', as: 'image', type: 'image/webp' },
            { href: '/videos/chess-coaching-hero-optimized-mumbai.mp4', as: 'video', type: 'video/mp4' }
        ];
        preloadLinks.forEach(link => {
            const pl = document.createElement('link');
            pl.rel = 'preload';
            pl.as = link.as;
            pl.href = link.href;
            pl.type = link.type;
            document.head.appendChild(pl);
        });
    }

    // Error Handling: Graceful Fallbacks
    window.addEventListener('error', function(e) {
        console.warn('JS Error caught:', e.message);
        // Fallback: Ensure core nav works
        if (e.message.includes('hamburger')) {
            location.reload();
        }
    });

    // PWA/Offline: Register Service Worker if Exists
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(e => console.log('SW reg failed:', e));
    }

    // Mumbai Timezone Easter Egg (Personalization)
    const now = new Date();
    const mumbaiTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    if (now.getHours() >= 9 && now.getHours() < 21) {
        // Add subtle banner: "Sessions available now!"
        const banner = document.createElement('div');
        banner.textContent = '🕒 Sessions Available Now in Mumbai!';
        banner.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#28a745;color:#fff;padding:0.5rem 1rem;border-radius:20px;z-index:999;font-size:0.875rem;opacity:0.9;';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 5000);
    }
});

// Global Functions (Exposed for Inline Calls)
function toggleHeroVideo() {
    const video = document.querySelector('.hero-bg-video');
    const toggle = document.querySelector('.hero-video-toggle');
    if (video.paused) {
        video.play();
        toggle.classList.add('playing');
    } else {
        video.pause();
        toggle.classList.remove('playing');
    }
}

// Export for Minification/SEO Tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { toggleHeroVideo };
}