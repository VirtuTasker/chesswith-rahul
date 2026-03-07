/**
 * ChessWithRahul.in — main.js
 * Personal Chess Coach Mumbai
 * Version: 4.0 — Hamburger rebuilt as body overlay
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        buildMobileMenu();
        initStickyHeader();
        initSmoothScroll();
        initLazyImages();
        initActiveNav();
        initSectionFade();
        initPhoneTracking();
    });

    /* =====================================================
       1. MOBILE MENU — injected as body overlay
       The original <ul id="navMenu"> stays in the header
       for desktop. On mobile we clone the links into a
       full-screen overlay div appended directly to <body>.
       Nothing inside the header can clip or constrain it.
    ===================================================== */
    function buildMobileMenu() {

        var hamburger = document.getElementById('hamburger');
        var originalMenu = document.getElementById('navMenu');
        if (!hamburger || !originalMenu) return;

        /* ── 1. Create the overlay ── */
        var overlay = document.createElement('div');
        overlay.id = 'mobileMenuOverlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Navigation menu');

        /* ── 2. Inject styles directly — zero chance of CSS conflicts ── */
        var style = document.createElement('style');
        style.textContent = [
            /* Overlay — full screen, dark background */
            '#mobileMenuOverlay {',
            '  display: none;',
            '  position: fixed;',
            '  top: 0; left: 0; right: 0; bottom: 0;',
            '  z-index: 9999;',
            '  background: rgba(15,37,64,0.55);',
            '  -webkit-tap-highlight-color: transparent;',
            '}',
            '#mobileMenuOverlay.is-open { display: block; }',

            /* Panel slides in from the right */
            '#mobileMenuPanel {',
            '  position: absolute;',
            '  top: 0; right: 0; bottom: 0;',
            '  width: min(320px, 88vw);',
            '  background: #ffffff;',
            '  overflow-y: auto;',
            '  -webkit-overflow-scrolling: touch;',
            '  display: flex;',
            '  flex-direction: column;',
            '  transform: translateX(100%);',
            '  transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);',
            '  box-shadow: -8px 0 40px rgba(0,0,0,0.25);',
            '}',
            '#mobileMenuOverlay.is-open #mobileMenuPanel {',
            '  transform: translateX(0);',
            '}',

            /* Close button top-right inside panel */
            '#mobileMenuClose {',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: flex-end;',
            '  padding: 18px 20px 12px;',
            '  background: #ffffff;',
            '  border-bottom: 1px solid #e8eaed;',
            '  flex-shrink: 0;',
            '}',
            '#mobileMenuClose button {',
            '  width: 40px; height: 40px;',
            '  border: none;',
            '  background: #f1f3f4;',
            '  border-radius: 50%;',
            '  font-size: 22px;',
            '  line-height: 1;',
            '  cursor: pointer;',
            '  color: #343a40;',
            '  display: flex; align-items: center; justify-content: center;',
            '}',

            /* Nav links list */
            '#mobileNavList {',
            '  list-style: none;',
            '  margin: 0; padding: 12px 0;',
            '  flex: 1;',
            '}',
            '#mobileNavList li a {',
            '  display: block;',
            '  padding: 15px 24px;',
            '  font-family: "DM Sans", sans-serif;',
            '  font-size: 16px;',
            '  font-weight: 600;',
            '  color: #212529;',
            '  text-decoration: none;',
            '  border-bottom: 1px solid #f1f3f4;',
            '  transition: background 0.15s, color 0.15s;',
            '}',
            '#mobileNavList li a:hover,',
            '#mobileNavList li a:active {',
            '  background: #e8f0fe;',
            '  color: #1a3a5c;',
            '}',
            '#mobileNavList li a.active { color: #1a3a5c; background: #e8f0fe; }',

            /* Sub-items (dropdown children) */
            '#mobileNavList .mobile-sub-item a {',
            '  padding-left: 40px;',
            '  font-size: 14px;',
            '  font-weight: 500;',
            '  color: #495057;',
            '}',

            /* CTA button at bottom */
            '#mobileMenuCta {',
            '  padding: 20px 24px 32px;',
            '  flex-shrink: 0;',
            '}',
            '#mobileMenuCta a {',
            '  display: block;',
            '  width: 100%;',
            '  padding: 15px 20px;',
            '  background: #c9a227;',
            '  color: #1a1a1a;',
            '  text-align: center;',
            '  font-family: "DM Sans", sans-serif;',
            '  font-size: 16px;',
            '  font-weight: 700;',
            '  text-decoration: none;',
            '  border-radius: 9999px;',
            '  transition: background 0.2s;',
            '}',
            '#mobileMenuCta a:hover { background: #f0d060; }',

            /* Hide the original desktop nav on mobile */
            '@media (max-width: 768px) {',
            '  #navMenu { display: none !important; }',
            '  #hamburger { display: flex !important; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        /* ── 3. Build panel HTML ── */
        var panel = document.createElement('div');
        panel.id = 'mobileMenuPanel';

        /* Close button row */
        var closeRow = document.createElement('div');
        closeRow.id = 'mobileMenuClose';
        var closeBtn = document.createElement('button');
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.innerHTML = '&times;';
        closeRow.appendChild(closeBtn);
        panel.appendChild(closeRow);

        /* Nav links */
        var list = document.createElement('ul');
        list.id = 'mobileNavList';

        /* Collect links from original menu */
        var items = originalMenu.querySelectorAll('li.nav-item');
        items.forEach(function(item) {
            /* Skip the CTA li — handled separately below */
            if (item.classList.contains('nav-cta')) return;

            var link = item.querySelector('a.nav-link');
            if (!link) return;

            /* Main link */
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = link.href || link.getAttribute('href');
            a.textContent = link.textContent.replace('▼','').trim();
            if (link.classList.contains('active')) a.classList.add('active');
            li.appendChild(a);
            list.appendChild(li);

            /* If dropdown — add children as sub-items */
            var subLinks = item.querySelectorAll('.dropdown-link');
            subLinks.forEach(function(sub) {
                var subLi = document.createElement('li');
                subLi.className = 'mobile-sub-item';
                var subA = document.createElement('a');
                subA.href = sub.href || sub.getAttribute('href');
                subA.textContent = '↳ ' + sub.textContent.trim();
                subLi.appendChild(subA);
                list.appendChild(subLi);
            });
        });
        panel.appendChild(list);

        /* CTA button */
        var ctaBox = document.createElement('div');
        ctaBox.id = 'mobileMenuCta';
        var ctaA = document.createElement('a');
        ctaA.href = 'https://wa.me/918591028709?text=Hi%20Rahul,%20I%20want%20personal%20chess%20coaching';
        ctaA.target = '_blank';
        ctaA.rel = 'noopener noreferrer';
        ctaA.textContent = '📱 Book Free Trial';
        ctaBox.appendChild(ctaA);
        panel.appendChild(ctaBox);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        /* ── 4. Open / Close logic ── */
        function openMenu() {
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        /* Hamburger click */
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            overlay.classList.contains('is-open') ? closeMenu() : openMenu();
        });

        /* Close button */
        closeBtn.addEventListener('click', closeMenu);

        /* Tap on dark backdrop (outside panel) */
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeMenu();
        });

        /* ESC key */
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });

        /* Close when any link is clicked */
        list.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', closeMenu);
        });
        ctaA.addEventListener('click', closeMenu);
    }

    /* =====================================================
       2. STICKY HEADER
    ===================================================== */
    function initStickyHeader() {
        var header = document.getElementById('header') || document.querySelector('.header');
        if (!header) return;
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function() {
                    header.classList.toggle('scrolled', window.pageYOffset > 20);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        header.classList.toggle('scrolled', window.pageYOffset > 20);
    }

    /* =====================================================
       3. SMOOTH SCROLL
    ===================================================== */
    function initSmoothScroll() {
        var navH = 70;
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH - 16, behavior: 'smooth' });
            });
        });
    }

    /* =====================================================
       4. LAZY IMAGES
    ===================================================== */
    function initLazyImages() {
        if ('loading' in HTMLImageElement.prototype) return;
        if (!('IntersectionObserver' in window)) return;
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) {
                    var img = e.target;
                    if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '200px 0px' });
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            if (img.dataset.src) obs.observe(img);
        });
    }

    /* =====================================================
       5. ACTIVE NAV
    ===================================================== */
    function initActiveNav() {
        var path = window.location.pathname;
        document.querySelectorAll('.nav-link, .dropdown-link').forEach(function(link) {
            var href = link.getAttribute('href') || '';
            var lp = href.replace(/^https?:\/\/[^\/]+/, '');
            if (lp === path || (path === '/' && (lp === '/' || lp === '/index.html')) ||
                (path !== '/' && lp !== '/' && lp.length > 1 && path.includes(lp))) {
                link.classList.add('active');
            }
        });
    }

    /* =====================================================
       6. SECTION FADE IN
    ===================================================== */
    function initSectionFade() {
        if (!('IntersectionObserver' in window)) return;
        var s = document.createElement('style');
        s.textContent = '.fade-hidden{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}.fade-visible{opacity:1;transform:none}';
        document.head.appendChild(s);
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) { e.target.classList.add('fade-visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.intro-section,.trust-section,.video-section,.single-video-section,.why-personal-section,.programs-section,.why-home-tuition,.testimonials-section,.areas-section,.final-cta-section,.gbp-reviews-section,.about-section,.pricing-section,.faq-section').forEach(function(el) {
            el.classList.add('fade-hidden');
            obs.observe(el);
        });
    }

    /* =====================================================
       7. PHONE / WHATSAPP TRACKING
    ===================================================== */
    function initPhoneTracking() {
        document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(function(link) {
            link.addEventListener('click', function() {
                if (typeof gtag === 'function') {
                    gtag('event', this.href.includes('tel:') ? 'phone_click' : 'whatsapp_click', {
                        event_category: 'Contact', event_label: 'Chess Coach Mumbai'
                    });
                }
            });
        });
    }

})();
