/**
 * ChessWithRahul.in — main.js
 * Personal Chess Coach Mumbai
 * Version: 2.0
 */

(function () {
    'use strict';

    /* =====================================================
       1. DOM READY
    ===================================================== */
    document.addEventListener('DOMContentLoaded', function () {
        initHamburger();
        initStickyHeader();
        initDropdowns();
        initSmoothScroll();
        initLazyImages();
        initActiveNav();
    });

    /* =====================================================
       2. HAMBURGER MENU
    ===================================================== */
    function initHamburger() {
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('navMenu');
        var header = document.getElementById('header') || document.querySelector('.header');

        if (!hamburger || !navMenu) return;

        // Toggle menu
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = navMenu.classList.contains('open');
            toggleMenu(!isOpen);
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                toggleMenu(false);
                hamburger.focus();
            }
        });

        // Close menu when a nav link is clicked (except dropdown toggles)
        navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-link').forEach(function (link) {
            link.addEventListener('click', function () {
                toggleMenu(false);
            });
        });

        // Prevent body scroll when menu open
        function toggleMenu(open) {
            navMenu.classList.toggle('open', open);
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        }
    }

    /* =====================================================
       3. MOBILE DROPDOWN INSIDE HAMBURGER
    ===================================================== */
    function initDropdowns() {
        var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

        dropdownToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                var isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    e.preventDefault();
                    var parentItem = this.closest('.nav-item.dropdown');
                    if (!parentItem) return;
                    var isOpen = parentItem.classList.contains('open');
                    // Close all dropdowns first
                    document.querySelectorAll('.nav-item.dropdown').forEach(function (item) {
                        item.classList.remove('open');
                    });
                    // Toggle clicked one
                    if (!isOpen) {
                        parentItem.classList.add('open');
                        this.setAttribute('aria-expanded', 'true');
                    } else {
                        this.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Desktop: close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth > 768) {
                var dropdowns = document.querySelectorAll('.nav-item.dropdown');
                dropdowns.forEach(function (item) {
                    if (!item.contains(e.target)) {
                        item.classList.remove('open');
                    }
                });
            }
        });
    }

    /* =====================================================
       4. STICKY HEADER — add shadow on scroll
    ===================================================== */
    function initStickyHeader() {
        var header = document.getElementById('header') || document.querySelector('.header');
        if (!header) return;

        var lastScroll = 0;
        var ticking = false;

        function onScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = scrollTop;
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        // Run once on load
        onScroll();
    }

    /* =====================================================
       5. SMOOTH SCROLL for anchor links
    ===================================================== */
    function initSmoothScroll() {
        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;

        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* =====================================================
       6. LAZY IMAGE LOADING (native + fallback)
    ===================================================== */
    function initLazyImages() {
        // Use native lazy loading — already set in HTML via loading="lazy"
        // Add intersection observer for older browsers as fallback
        if ('loading' in HTMLImageElement.prototype) return;

        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '200px 0px' });

            document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }

    /* =====================================================
       7. ACTIVE NAV LINK
    ===================================================== */
    function initActiveNav() {
        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;

            // Normalize both paths
            var linkPath = href.replace(/^https?:\/\/[^\/]+/, ''); // strip domain if absolute
            if (linkPath === currentPath ||
                (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html')) ||
                (currentPath !== '/' && linkPath !== '/' && currentPath.includes(linkPath) && linkPath.length > 1)) {
                link.classList.add('active');
            }
        });
    }

    /* =====================================================
       8. INTERSECTION OBSERVER — fade in sections
    ===================================================== */
    if ('IntersectionObserver' in window) {
        var sections = document.querySelectorAll(
            '.intro-section, .trust-section, .video-section, .why-personal-section, .programs-section, .why-home-tuition, .testimonials-section, .areas-section, .final-cta-section, .single-video-section'
        );

        // Add CSS for fade-in
        var style = document.createElement('style');
        style.textContent = [
            '.animate-hidden { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }',
            '.animate-visible { opacity: 1; transform: translateY(0); }'
        ].join('');
        document.head.appendChild(style);

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        sections.forEach(function (section) {
            section.classList.add('animate-hidden');
            sectionObserver.observe(section);
        });
    }

    /* =====================================================
       9. RESIZE HANDLER — close mobile menu on resize
    ===================================================== */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768) {
                var navMenu = document.getElementById('navMenu');
                var hamburger = document.getElementById('hamburger');
                if (navMenu && navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                    document.body.style.overflow = '';
                }
            }
        }, 150);
    }, { passive: true });

    /* =====================================================
       10. PHONE CLICK TRACKING (analytics-ready)
    ===================================================== */
    document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(function (link) {
        link.addEventListener('click', function () {
            // Google Analytics 4 / gtag event (fires if gtag is loaded)
            if (typeof gtag === 'function') {
                var isPhone = this.href.includes('tel:');
                gtag('event', isPhone ? 'phone_click' : 'whatsapp_click', {
                    'event_category': 'Contact',
                    'event_label': 'Personal Chess Coach Mumbai'
                });
            }
        });
    });

})();
