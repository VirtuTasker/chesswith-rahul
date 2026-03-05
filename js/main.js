/**
 * ChessWithRahul - Maximum SEO JavaScript
 * Personal Chess Coach Mumbai | Private Trainer
 */

(function() {
    'use strict';

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
        initLazyLoading();
        initVideoOptimization();
        initScrollAnimations();
        initPerformanceTracking();
        initAccessibility();
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const lines = this.querySelectorAll('.hamburger-line');
            if (!isExpanded) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = '';
                lines[1].style.opacity = '';
                lines[2].style.transform = '';
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                const lines = hamburger.querySelectorAll('.hamburger-line');
                lines[0].style.transform = '';
                lines[1].style.opacity = '';
                lines[2].style.transform = '';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            });
        });
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', throttle(toggleVisibility, 100));
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // LAZY LOADING
    // ============================================
    function initLazyLoading() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Lazy load iframes (videos)
        const lazyIframes = document.querySelectorAll('iframe[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const iframeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const iframe = entry.target;
                        const src = iframe.getAttribute('src');
                        if (src && src.includes('VIDEO_ID')) {
                            // Replace with actual video ID when in viewport
                            // This is a placeholder - replace VIDEO_ID_1, VIDEO_ID_2, VIDEO_ID_3 with actual IDs
                        }
                        observer.unobserve(iframe);
                    }
                });
            });

            lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
        }
    }

    // ============================================
    // VIDEO OPTIMIZATION
    // ============================================
    function initVideoOptimization() {
        // Pause background video when not visible
        const bgVideo = document.querySelector('.hero-bg-video');
        if (!bgVideo) return;

        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bgVideo.play().catch(() => {
                            // Autoplay blocked, show poster
                            bgVideo.setAttribute('controls', '');
                        });
                    } else {
                        bgVideo.pause();
                    }
                });
            }, { threshold: 0.1 });

            videoObserver.observe(bgVideo);
        }
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.intro-highlight, .trust-item, .program-card, .testimonial-card, .advantage-card, .area-badge'
        );

        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                animationObserver.observe(el);
            });
        }
    }

    // ============================================
    // PERFORMANCE TRACKING (SEO)
    // ============================================
    function initPerformanceTracking() {
        // Core Web Vitals tracking
        if ('web-vitals' in window) {
            // LCP
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // FID
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const delay = entry.processingStart - entry.startTime;
                    console.log('FID:', delay);
                }
            }).observe({ entryTypes: ['first-input'] });

            // CLS
            let clsValue = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }

        // Track user engagement for SEO signals
        let maxScrollDepth = 0;
        const trackScrollDepth = throttle(() => {
            const scrollPercent = Math.round(
                (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                if (maxScrollDepth % 25 === 0) {
                    // Send to analytics: User scrolled X%
                    console.log('Scroll depth:', maxScrollDepth + '%');
                }
            }
        }, 500);

        window.addEventListener('scroll', trackScrollDepth);

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            console.log('Time on page:', timeOnPage + 's');
        });
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    function initAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main-content id to first section
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.id = firstSection.id || 'main-content';
        }

        // Handle focus for dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    toggle.setAttribute('aria-expanded', !isExpanded);
                    menu.style.opacity = isExpanded ? '0' : '1';
                    menu.style.visibility = isExpanded ? 'hidden' : 'visible';
                });
            }
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Preload critical resources
    function preloadResource(url, as, type) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
    }

    // ============================================
    // SERVICE WORKER (PWA)
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        });
    }

})();
