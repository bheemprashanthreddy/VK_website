/**
 * Vakil Properties - Main JavaScript File
 * Modern, accessible, and performance-optimized interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION & CONSTANTS
    // ==========================================================================
    
    const CONFIG = {
        SCROLL_THRESHOLD: 100,
        MOBILE_BREAKPOINT: 768,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 100
    };

    const SELECTORS = {
        // Navigation
        nav: '.nav',
        navToggle: '.nav__toggle',
        navOverlay: '.nav__overlay',
        navClose: '.nav__close',
        navLinks: '.nav__link',
        navMobileLinks: '.nav__mobile-link',
        
        // Header
        header: '.header',
        
        // Back to top
        backToTop: '.back-to-top',
        
        // Smooth scroll links
        smoothScrollLinks: 'a[href^="#"]',
        
        // Hero scroll
        heroScroll: '.hero__scroll-link'
    };

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    /**
     * Debounce function to limit the rate of function execution
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle function to limit function execution frequency
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Get scroll position
     */
    function getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Account for fixed header
        const startPosition = getScrollPosition();
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Lock/unlock body scroll
     */
    function lockBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px';
    }

    function unlockBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    function getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }

    // ==========================================================================
    // NAVIGATION COMPONENT
    // ==========================================================================
    
    class Navigation {
        constructor() {
            this.nav = document.querySelector(SELECTORS.nav);
            this.toggle = document.querySelector(SELECTORS.navToggle);
            this.overlay = document.querySelector(SELECTORS.navOverlay);
            this.closeBtn = document.querySelector(SELECTORS.navClose);
            this.links = document.querySelectorAll(SELECTORS.navLinks);
            this.mobileLinks = document.querySelectorAll(SELECTORS.navMobileLinks);
            
            this.isOpen = false;
            this.init();
        }

        init() {
            if (!this.nav || !this.toggle || !this.overlay) return;
            
            this.bindEvents();
            this.handleResize();
        }

        bindEvents() {
            // Toggle button
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });

            // Close button
            this.closeBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });

            // Overlay click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closeMenu();
                }
            });

            // Mobile links
            this.mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });

            // Handle resize
            window.addEventListener('resize', debounce(() => {
                this.handleResize();
            }, CONFIG.DEBOUNCE_DELAY));

            // Active link highlighting
            this.highlightActiveLink();
            window.addEventListener('scroll', throttle(() => {
                this.highlightActiveLink();
            }, 100));
        }

        toggleMenu() {
            if (this.isOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }

        openMenu() {
            this.isOpen = true;
            this.toggle.setAttribute('aria-expanded', 'true');
            this.overlay.setAttribute('aria-hidden', 'false');
            lockBodyScroll();
            
            // Focus management
            setTimeout(() => {
                const firstLink = this.overlay.querySelector('a, button');
                if (firstLink) firstLink.focus();
            }, CONFIG.ANIMATION_DURATION);
        }

        closeMenu() {
            this.isOpen = false;
            this.toggle.setAttribute('aria-expanded', 'false');
            this.overlay.setAttribute('aria-hidden', 'true');
            unlockBodyScroll();
            
            // Return focus to toggle button
            this.toggle.focus();
        }

        handleResize() {
            if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && this.isOpen) {
                this.closeMenu();
            }
        }

        highlightActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = getScrollPosition() + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    this.links.forEach(link => {
                        link.classList.remove('nav__link--active');
                    });
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`${SELECTORS.navLinks}[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('nav__link--active');
                    }
                }
            });
        }
    }

    // ==========================================================================
    // HEADER COMPONENT
    // ==========================================================================
    
    class Header {
        constructor() {
            this.header = document.querySelector(SELECTORS.header);
            this.lastScrollPos = 0;
            this.isScrolled = false;
            
            this.init();
        }

        init() {
            if (!this.header) return;
            
            this.bindEvents();
            this.updateHeaderState();
        }

        bindEvents() {
            window.addEventListener('scroll', throttle(() => {
                this.updateHeaderState();
            }, 16)); // ~60fps
        }

        updateHeaderState() {
            const scrollPos = getScrollPosition();
            
            // Add/remove scrolled state
            if (scrollPos > CONFIG.SCROLL_THRESHOLD && !this.isScrolled) {
                this.header.classList.add('header--scrolled');
                this.isScrolled = true;
            } else if (scrollPos <= CONFIG.SCROLL_THRESHOLD && this.isScrolled) {
                this.header.classList.remove('header--scrolled');
                this.isScrolled = false;
            }

            this.lastScrollPos = scrollPos;
        }
    }

    // ==========================================================================
    // SMOOTH SCROLL COMPONENT
    // ==========================================================================
    
    class SmoothScroll {
        constructor() {
            this.links = document.querySelectorAll(SELECTORS.smoothScrollLinks);
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Skip if it's just '#' or external link
                    if (href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                        return;
                    }

                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        smoothScrollTo(targetElement);
                        
                        // Update URL without triggering scroll
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                        
                        // Focus management for accessibility
                        setTimeout(() => {
                            targetElement.setAttribute('tabindex', '-1');
                            targetElement.focus();
                            targetElement.addEventListener('blur', () => {
                                targetElement.removeAttribute('tabindex');
                            }, { once: true });
                        }, 800);
                    }
                });
            });
        }
    }

    // ==========================================================================
    // BACK TO TOP COMPONENT
    // ==========================================================================
    
    class BackToTop {
        constructor() {
            this.button = document.querySelector(SELECTORS.backToTop);
            this.isVisible = false;
            
            this.init();
        }

        init() {
            if (!this.button) return;
            
            this.bindEvents();
            this.updateVisibility();
        }

        bindEvents() {
            // Scroll event
            window.addEventListener('scroll', throttle(() => {
                this.updateVisibility();
            }, 16));

            // Click event
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });

            // Keyboard event
            this.button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });
        }

        updateVisibility() {
            const scrollPos = getScrollPosition();
            const shouldShow = scrollPos > CONFIG.SCROLL_THRESHOLD * 3;

            if (shouldShow && !this.isVisible) {
                this.button.classList.add('visible');
                this.button.setAttribute('aria-hidden', 'false');
                this.isVisible = true;
            } else if (!shouldShow && this.isVisible) {
                this.button.classList.remove('visible');
                this.button.setAttribute('aria-hidden', 'true');
                this.isVisible = false;
            }
        }

        scrollToTop() {
            smoothScrollTo(document.body, 600);
            
            // Focus management
            setTimeout(() => {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    skipLink.focus();
                }
            }, 600);
        }
    }

    // ==========================================================================
    // COUNTER ANIMATION COMPONENT
    // ==========================================================================
    
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('[data-count]');
            this.init();
        }

        init() {
            if (this.counters.length === 0) return;
            
            this.createObserver();
        }

        createObserver() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.counters.forEach(counter => {
                    this.animateCounter(counter);
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(counter => {
                observer.observe(counter);
            });
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCounter);
        }
    }

    // ==========================================================================
    // INTERSECTION OBSERVER ANIMATIONS
    // ==========================================================================
    
    class AnimationObserver {
        constructor() {
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.init();
        }

        init() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.addFallbackClasses();
                return;
            }

            this.createObserver();
            this.observeElements();
        }

        createObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
        }

        observeElements() {
            const elementsToAnimate = [
                '.service-card',
                '.trust-indicator',
                '.feature',
                '.section-header',
                '.hero__content',
                '.why-choose__content',
                '.cta__content'
            ];

            elementsToAnimate.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    // Add slight delay for staggered animations
                    element.style.animationDelay = `${index * 0.1}s`;
                    this.observer.observe(element);
                });
            });
        }

        addFallbackClasses() {
            // Add animation classes immediately for browsers without IntersectionObserver
            const elements = document.querySelectorAll('.service-card, .trust-indicator, .feature');
            elements.forEach(element => {
                element.classList.add('fade-in');
            });
        }
    }

    // ==========================================================================
    // FORM COMPONENTS
    // ==========================================================================
    
    class FormHandler {
        constructor() {
            this.forms = document.querySelectorAll('form');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.forms.forEach(form => {
                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                    input.addEventListener('input', () => this.clearErrors(input));
                });

                // Form submission
                form.addEventListener('submit', (e) => this.handleSubmit(e, form));
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            let errorMessage = '';

            // Required validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            // Email validation
            else if (type === 'email' && value && !this.isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            
            // Phone validation
            else if (type === 'tel' && value && !this.isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }

            this.showFieldError(field, isValid ? null : errorMessage);
            return isValid;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        isValidPhone(phone) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            return phoneRegex.test(phone);
        }

        showFieldError(field, message) {
            const fieldContainer = field.closest('.form-group') || field.parentElement;
            let errorElement = fieldContainer.querySelector('.error-message');

            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }

            field.classList.remove('error');

            if (message) {
                // Add error class
                field.classList.add('error');

                // Create error message
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                errorElement.setAttribute('role', 'alert');
                
                fieldContainer.appendChild(errorElement);
            }
        }

        clearErrors(field) {
            const fieldContainer = field.closest('.form-group') || field.parentElement;
            const errorElement = fieldContainer.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            field.classList.remove('error');
        }

        handleSubmit(e, form) {
            e.preventDefault();

            // Validate all fields
            const inputs = form.querySelectorAll('input, textarea, select');
            let isFormValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Focus first invalid field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Form is valid - show loading state
            this.showLoadingState(form);

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                this.showSuccessState(form);
            }, 2000);
        }

        showLoadingState(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            }
        }

        showSuccessState(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    form.reset();
                    submitButton.classList.remove('success');
                    submitButton.innerHTML = 'Send Message';
                }, 3000);
            }
        }
    }

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================
    
    class PerformanceOptimizer {
        constructor() {
            this.init();
        }

        init() {
            this.lazyLoadImages();
            this.prefetchLinks();
            this.optimizeAnimations();
        }

        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }

        prefetchLinks() {
            // Prefetch links on hover for faster navigation
            const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
            
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                }, { once: true });
            });
        }

        optimizeAnimations() {
            // Reduce animations for users who prefer reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const style = document.createElement('style');
                style.textContent = `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // ==========================================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================================================
    
    class AccessibilityEnhancer {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceKeyboardNavigation();
            this.improveScreenReaderExperience();
            this.handleFocusManagement();
        }

        enhanceKeyboardNavigation() {
            // Trap focus in modals
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const modal = document.querySelector('.nav__overlay[aria-hidden="false"]');
                    if (modal) {
                        this.trapFocus(e, modal);
                    }
                }
            });
        }

        trapFocus(e, container) {
            const focusableElements = container.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }

        improveScreenReaderExperience() {
            // Announce dynamic content changes
            this.createLiveRegion();
            
            // Improve button labels
            const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
            buttons.forEach(button => {
                if (!button.textContent.trim()) {
                    const icon = button.querySelector('i[class*="fa-"]');
                    if (icon) {
                        const iconClass = [...icon.classList].find(cls => cls.startsWith('fa-'));
                        if (iconClass) {
                            const label = iconClass.replace('fa-', '').replace('-', ' ');
                            button.setAttribute('aria-label', label);
                        }
                    }
                }
            });
        }

        createLiveRegion() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'live-region';
            document.body.appendChild(liveRegion);

            // Make it globally accessible
            window.announceToScreenReader = (message) => {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            };
        }

        handleFocusManagement() {
            // Add focus indicators for better visibility
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        }
    }

    // ==========================================================================
    // APP INITIALIZATION
    // ==========================================================================
    
    class App {
        constructor() {
            this.components = {};
            this.init();
        }

        init() {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeComponents();
                });
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            try {
                // Initialize AOS first
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 600,
                        easing: 'ease-out-cubic',
                        once: true,
                        offset: 100,
                        delay: 100
                    });
                }

                // Initialize all components
                this.components.navigation = new Navigation();
                this.components.header = new Header();
                this.components.smoothScroll = new SmoothScroll();
                this.components.backToTop = new BackToTop();
                this.components.counterAnimation = new CounterAnimation();
                this.components.formHandler = new FormHandler();
                this.components.performanceOptimizer = new PerformanceOptimizer();
                this.components.accessibilityEnhancer = new AccessibilityEnhancer();

                // Initialize additional features
                this.handleExternalLinks();
                this.addLoadingComplete();
                
                console.log('🚀 Vakil Properties website initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing components:', error);
            }
        }

        handleExternalLinks() {
            // Add target="_blank" and security attributes to external links
            const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + location.hostname + '"])');
            externalLinks.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                // Add screen reader text
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = ' (opens in new tab)';
                link.appendChild(srText);
            });
        }

        addLoadingComplete() {
            // Remove any loading states and add loaded class
            document.body.classList.add('loaded');
            document.body.classList.remove('loading');
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Page loaded successfully');
            }
        }
    }

    // ==========================================================================
    // INITIALIZE APPLICATION
    // ==========================================================================
    
    // Create global app instance
    window.VakilProperties = new App();

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause non-essential animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible - resume animations
            document.body.classList.remove('page-hidden');
        }
    });

    // Error handling for uncaught errors
    window.addEventListener('error', (e) => {
        console.error('Uncaught error:', e.error);
        // Could send error reports to analytics service here
    });

    // Handle promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });

})();