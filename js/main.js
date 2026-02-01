/**
 * CHESSWITHRAHUL.IN - MAIN JAVASCRIPT
 * Pure vanilla JavaScript - No dependencies
 * Handles: Navigation, Hamburger Menu, Smooth Scroll, Lazy Loading
 */

'use strict';

// ========================================
// NAVIGATION & HAMBURGER MENU
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Close mobile menu when clicking nav links
 */
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Event Listeners
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Close menu on mobile when link is clicked
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    });
});

/**
 * Handle dropdown menus on mobile
 */
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = toggle.closest('.dropdown');
            dropdown.classList.toggle('active');
        }
    });
});

/**
 * Close menu when clicking outside on mobile
 */
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }
});

/**
 * Close menu on ESC key press
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only apply to valid hash links (not just #)
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// LAZY LOADING FOR IMAGES & VIDEOS
// ========================================

/**
 * Intersection Observer for lazy loading
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Load srcset if exists
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }
                
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Observe videos
    const lazyVideos = document.querySelectorAll('video[data-src]');
    lazyVideos.forEach(video => {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sources = video.querySelectorAll('source');
                    sources.forEach(source => {
                        if (source.dataset.src) {
                            source.src = source.dataset.src;
                        }
                    });
                    video.load();
                    observer.unobserve(video);
                }
            });
        });
        videoObserver.observe(video);
    });
}

// ========================================
// HERO VIDEO OPTIMIZATION
// ========================================

const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
    // Pause video when not in viewport (performance optimization)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.25 });
    
    videoObserver.observe(heroVideo);
    
    // Reduce quality on mobile for performance
    if (window.innerWidth < 768) {
        heroVideo.style.filter = 'brightness(0.9)';
    }
}

// ========================================
// SCROLL ANIMATIONS (FADE IN ON SCROLL) - FIXED VERSION
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add fade-in animation
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('fade-in');
            // DON'T unobserve - let it stay visible
            // fadeInObserver.unobserve(entry.target); // REMOVED THIS LINE
        }
    });
}, observerOptions);

// Observe elements that should fade in
const fadeElements = document.querySelectorAll('.feature-card, .audience-card, .testimonial-card, .step');
fadeElements.forEach(el => {
    // Set initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInObserver.observe(el);
});

// ========================================
// WHATSAPP BUTTON ENHANCEMENT
// ========================================

const whatsappButton = document.querySelector('.whatsapp-float');

if (whatsappButton) {
    // Track WhatsApp button clicks (can be used for analytics)
    whatsappButton.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
        // You can add Google Analytics tracking here if needed
        // Example: gtag('event', 'whatsapp_click', { 'event_category': 'engagement' });
    });
    
    // Show/hide based on scroll position (hide in footer to avoid overlap)
    window.addEventListener('scroll', () => {
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Hide WhatsApp button when footer is visible
            if (footerRect.top < windowHeight) {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.pointerEvents = 'none';
            } else {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.pointerEvents = 'auto';
            }
        }
    });
}

// ========================================
// FORM VALIDATION (FOR CONTACT PAGE)
// ========================================

const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Remove error class on input
                field.addEventListener('input', () => {
                    field.classList.remove('error');
                }, { once: true });
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ========================================
// ACTIVE PAGE HIGHLIGHT IN NAVIGATION
// ========================================

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPath = new URL(link.href).pathname;
        
        // Exact match or index page match
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath.endsWith('index.html')) ||
            (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });
}

// Set active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ========================================
// PAGE LOAD OPTIMIZATION
// ========================================

window.addEventListener('load', () => {
    // Remove loading class if you have one
    document.body.classList.remove('loading');
    
    // Log page load time (development only - remove in production)
    if (window.performance) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                         window.performance.timing.navigationStart;
        console.log('Page loaded in:', loadTime + 'ms');
    }
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message);
    // You can send errors to analytics here
});

// ========================================
// CONSOLE MESSAGE (BRANDING)
// ========================================

console.log('%c🎓 ChessWithRahul.in', 'font-size: 20px; font-weight: bold; color: #2c5f2d;');
console.log('%cLearn Chess from a Champion Coach', 'font-size: 14px; color: #666;');
console.log('%c📱 WhatsApp: +91-8591028709', 'font-size: 12px; color: #25d366;');

// ========================================
// EXPORT FOR MODULES (IF NEEDED)
// ========================================

// Expose functions globally if needed
window.ChessWithRahul = {
    toggleMenu,
    closeMenu,
    debounce
};
🚀 ADDITIONAL SEO IMPROVEMENTS
1. Add Alt Text to ALL Images
Replace image tags in ALL HTML files. Find and replace:
FIND:
<img src="images/rahul-coach.webp" alt="Rahul - Personal Chess Coach with trophies" loading="lazy">
REPLACE WITH (ADD MORE DESCRIPTIVE ALT):
<img src="images/rahul-coach.webp" alt="Rahul, multiple-time Inter-College Chess Champion and personal chess coach in Mumbai, standing with tournament trophies and certificates" loading="lazy">
Do this for EVERY image across all pages.
2. Add Google Analytics & Search Console
Add this BEFORE </head> in ALL HTML files:
<!-- Google Analytics (Replace G-XXXXXXXXXX with your actual ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Google Search Console Verification (Add your verification meta tag) -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
3. Enhanced Local SEO - Add to index.html
Add this schema AFTER the existing schemas in index.html:
<!-- Enhanced Local SEO Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "ChessWithRahul - Personal Chess Coaching",
  "image": "https://chesswithrahul.in/images/rahul-coach.webp",
  "@id": "https://chesswithrahul.in",
  "url": "https://chesswithrahul.in",
  "telephone": "+918591028709",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "",
    "addressLocality": "Mumbai",
    "postalCode": "",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "21:00"
  },
  "sameAs": [
    "https://wa.me/918591028709"
  ]
}
</script>