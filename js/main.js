/**
 * ChessWithRahul.in — main.js
 * Version: 5.0 — Hamburger bulletproofed for all mobile browsers
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        buildMobileMenu();
        initStickyHeader();
        initSmoothScroll();
        initActiveNav();
        initSectionFade();
        initPhoneTracking();
    });

    /* ─────────────────────────────────────────────
       1. MOBILE MENU — full-screen overlay injected
          into <body> so nothing clips it.
          FIXED: touchend + click dedup for iOS/Android
    ───────────────────────────────────────────── */
    function buildMobileMenu() {
        var hamburger = document.getElementById('hamburger');
        var originalMenu = document.getElementById('navMenu');
        if (!hamburger || !originalMenu) return;

        /* ── Overlay shell ── */
        var overlay = document.createElement('div');
        overlay.id = 'mobileMenuOverlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Navigation menu');

        /* ── Inline styles — zero CSS conflict risk ── */
        var style = document.createElement('style');
        style.textContent = [
            '#mobileMenuOverlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:rgba(10,20,40,.6);-webkit-tap-highlight-color:transparent;}',
            '#mobileMenuOverlay.is-open{display:block;}',
            '#mobileMenuPanel{position:absolute;top:0;right:0;bottom:0;width:min(320px,88vw);background:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-8px 0 40px rgba(0,0,0,.25);}',
            '#mobileMenuOverlay.is-open #mobileMenuPanel{transform:translateX(0);}',
            '#mobileMenuClose{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;background:#fff;border-bottom:1px solid #e8eaed;flex-shrink:0;}',
            '#mobileMenuClose span{font-family:"Playfair Display",serif;font-size:1rem;font-weight:700;color:#0f2540;}',
            '#mobileMenuClose button{width:40px;height:40px;border:none;background:#f1f3f4;border-radius:50%;font-size:22px;cursor:pointer;color:#343a40;display:flex;align-items:center;justify-content:center;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}',
            '#mobileNavList{list-style:none;margin:0;padding:8px 0;flex:1;}',
            '#mobileNavList li a{display:block;padding:14px 24px;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:600;color:#212529;text-decoration:none;border-bottom:1px solid #f1f3f4;transition:background .15s,color .15s;-webkit-tap-highlight-color:transparent;}',
            '#mobileNavList li a:active,#mobileNavList li a:hover{background:#e8f0fe;color:#1a3a5c;}',
            '#mobileNavList li a.active{color:#1a3a5c;background:#e8f0fe;}',
            '#mobileNavList .mobile-sub a{padding-left:40px;font-size:13px;font-weight:500;color:#495057;}',
            '#mobileMenuCta{padding:20px 24px 36px;flex-shrink:0;}',
            '#mobileMenuCta a{display:block;width:100%;padding:15px 20px;background:#c9a227;color:#1a1a1a;text-align:center;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:9999px;transition:background .2s;-webkit-tap-highlight-color:transparent;}',
            '#mobileMenuCta a:active{background:#f0d060;}',
            '@media(max-width:768px){#navMenu{display:none!important;}#hamburger{display:flex!important;}}'
        ].join('');
        document.head.appendChild(style);

        /* ── Panel ── */
        var panel = document.createElement('div');
        panel.id = 'mobileMenuPanel';

        var closeRow = document.createElement('div');
        closeRow.id = 'mobileMenuClose';
        closeRow.innerHTML = '<span>ChessWithRahul</span>';
        var closeBtn = document.createElement('button');
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.setAttribute('type', 'button');
        closeBtn.innerHTML = '&times;';
        closeRow.appendChild(closeBtn);
        panel.appendChild(closeRow);

        /* Nav links */
        var list = document.createElement('ul');
        list.id = 'mobileNavList';
        originalMenu.querySelectorAll('li.nav-item').forEach(function (item) {
            if (item.classList.contains('nav-cta')) return;
            var link = item.querySelector('a.nav-link');
            if (!link) return;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = link.getAttribute('href') || '#';
            a.textContent = link.textContent.replace('▼', '').trim();
            if (link.classList.contains('active')) a.classList.add('active');
            li.appendChild(a);
            list.appendChild(li);
            item.querySelectorAll('.dropdown-link').forEach(function (sub) {
                var sli = document.createElement('li');
                sli.className = 'mobile-sub';
                var sa = document.createElement('a');
                sa.href = sub.getAttribute('href') || '#';
                sa.textContent = '↳ ' + sub.textContent.trim();
                sli.appendChild(sa);
                list.appendChild(sli);
            });
        });
        panel.appendChild(list);

        var ctaBox = document.createElement('div');
        ctaBox.id = 'mobileMenuCta';
        var ctaA = document.createElement('a');
        ctaA.href = 'https://wa.me/918591028709?text=Hi%20Rahul%2C%20I%20want%20personal%20chess%20coaching';
        ctaA.target = '_blank';
        ctaA.rel = 'noopener noreferrer';
        ctaA.textContent = '📱 Book FREE Trial';
        ctaBox.appendChild(ctaA);
        panel.appendChild(ctaBox);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        /* ── Open / Close ── */
        function openMenu() {
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        /* BULLETPROOF: touchend fires before click on mobile.
           We handle touchend and set a flag to skip the
           subsequent click so it never double-fires.        */
        var _skipClick = false;

        hamburger.addEventListener('touchend', function (e) {
            e.preventDefault(); /* stops 300ms click delay */
            _skipClick = true;
            overlay.classList.contains('is-open') ? closeMenu() : openMenu();
        }, { passive: false });

        hamburger.addEventListener('click', function (e) {
            if (_skipClick) { _skipClick = false; return; }
            overlay.classList.contains('is-open') ? closeMenu() : openMenu();
        });

        closeBtn.addEventListener('touchend', function (e) { e.preventDefault(); closeMenu(); }, { passive: false });
        closeBtn.addEventListener('click', closeMenu);

        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeMenu(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

        list.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMenu);
        });
        ctaA.addEventListener('click', closeMenu);
    }

    /* ─────────────────────────────────────────────
       2. STICKY HEADER
    ───────────────────────────────────────────── */
    function initStickyHeader() {
        var header = document.getElementById('header') || document.querySelector('.header');
        if (!header) return;
        var ticking = false;
        function update() { header.classList.toggle('scrolled', window.pageYOffset > 20); ticking = false; }
        window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
        update();
    }

    /* ─────────────────────────────────────────────
       3. SMOOTH SCROLL
    ───────────────────────────────────────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 86, behavior: 'smooth' });
            });
        });
    }

    /* ─────────────────────────────────────────────
       4. ACTIVE NAV LINK
    ───────────────────────────────────────────── */
    function initActiveNav() {
        var path = window.location.pathname;
        document.querySelectorAll('.nav-link, .dropdown-link').forEach(function (link) {
            var href = (link.getAttribute('href') || '').replace(/^https?:\/\/[^/]+/, '');
            if (href === path || (path === '/' && href === '/') ||
                (path !== '/' && href.length > 1 && path.startsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    /* ─────────────────────────────────────────────
       5. SECTION FADE IN
    ───────────────────────────────────────────── */
    function initSectionFade() {
        if (!('IntersectionObserver' in window)) return;
        var s = document.createElement('style');
        s.textContent = '.fade-in{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.fade-in.visible{opacity:1;transform:none}';
        document.head.appendChild(s);
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.07 });
        document.querySelectorAll('section').forEach(function (el) { el.classList.add('fade-in'); obs.observe(el); });
    }

    /* ─────────────────────────────────────────────
       6. CONTACT TRACKING
    ───────────────────────────────────────────── */
    function initPhoneTracking() {
        document.querySelectorAll('a[href^="tel:"],a[href*="wa.me"]').forEach(function (link) {
            link.addEventListener('click', function () {
                if (typeof gtag === 'function') {
                    gtag('event', this.href.includes('tel:') ? 'phone_click' : 'whatsapp_click', { event_category: 'Contact' });
                }
            });
        });
    }

})();
