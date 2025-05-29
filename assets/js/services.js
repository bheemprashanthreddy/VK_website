/**
 * Services Page JavaScript
 * Interactive functionality for service filtering, FAQ, and animations
 */

(function() {
    'use strict';

    // ==========================================================================
    // SERVICE CATEGORY FILTERING
    // ==========================================================================
    
    class ServiceFilter {
        constructor() {
            this.filterButtons = document.querySelectorAll('.service-nav__btn');
            this.serviceSections = document.querySelectorAll('.service-section[data-category]');
            this.init();
        }

        init() {
            this.bindEvents();
            this.showAllServices();
        }

        bindEvents() {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = button.getAttribute('data-category');
                    this.filterServices(category);
                    this.setActiveButton(button);
                });
            });
        }

        filterServices(category) {
            this.serviceSections.forEach(section => {
                const sectionCategory = section.getAttribute('data-category');
                
                if (category === 'all' || sectionCategory === category) {
                    this.showSection(section);
                } else {
                    this.hideSection(section);
                }
            });

            // Smooth scroll to first visible section if not showing all
            if (category !== 'all') {
                setTimeout(() => {
                    const firstVisibleSection = document.querySelector(`.service-section[data-category="${category}"]`);
                    if (firstVisibleSection) {
                        firstVisibleSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        }

        showSection(section) {
            section.style.display = 'block';
            section.classList.add('active');
            
            // Animate service cards
            const cards = section.querySelectorAll('.service-card-advanced');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        hideSection(section) {
            section.classList.remove('active');
            setTimeout(() => {
                section.style.display = 'none';
            }, 300);
        }

        showAllServices() {
            this.serviceSections.forEach(section => {
                this.showSection(section);
            });
        }

        setActiveButton(activeButton) {
            this.filterButtons.forEach(button => {
                button.classList.remove('service-nav__btn--active');
            });
            activeButton.classList.add('service-nav__btn--active');
        }
    }

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    
    class FAQAccordion {
        constructor() {
            this.faqQuestions = document.querySelectorAll('.faq-question');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    this.toggleFAQ(question);
                });

                // Keyboard accessibility
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(question);
                    }
                });
            });
        }

        toggleFAQ(question) {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            if (isExpanded) {
                this.closeFAQ(question, answer);
            } else {
                // Close other open FAQs
                this.closeAllFAQs();
                this.openFAQ(question, answer);
            }
        }

        openFAQ(question, answer) {
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            
            // Add visual feedback
            question.style.background = 'var(--color-gray-50)';
        }

        closeFAQ(question, answer) {
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = '0';
            question.style.background = '';
        }

        closeAllFAQs() {
            this.faqQuestions.forEach(question => {
                const answer = question.nextElementSibling;
                this.closeFAQ(question, answer);
            });
        }
    }

    // ==========================================================================
    // PRICING CALCULATOR
    // ==========================================================================
    
    class PricingCalculator {
        constructor() {
            this.priceElements = document.querySelectorAll('.service-card-advanced__price');
            this.init();
        }

        init() {
            this.addHoverEffects();
        }

        addHoverEffects() {
            this.priceElements.forEach(priceElement => {
                const card = priceElement.closest('.service-card-advanced');
                
                if (card) {
                    card.addEventListener('mouseenter', () => {
                        this.highlightPrice(priceElement);
                    });

                    card.addEventListener('mouseleave', () => {
                        this.resetPrice(priceElement);
                    });
                }
            });
        }

        highlightPrice(element) {
            element.style.transform = 'scale(1.1)';
            element.style.color = 'var(--color-accent)';
            element.style.transition = 'all 0.3s ease';
        }

        resetPrice(element) {
            element.style.transform = 'scale(1)';
            element.style.color = 'var(--color-primary)';
        }
    }

    // ==========================================================================
    // SERVICE CARD ANIMATIONS
    // ==========================================================================
    
    class ServiceCardAnimations {
        constructor() {
            this.cards = document.querySelectorAll('.service-card-advanced');
            this.init();
        }

        init() {
            this.addParallaxEffect();
            this.addFloatingEffect();
        }

        addParallaxEffect() {
            if (window.innerWidth > 768) {
                window.addEventListener('scroll', () => {
                    this.cards.forEach((card, index) => {
                        const rect = card.getBoundingClientRect();
                        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                        
                        if (scrollPercent > 0 && scrollPercent < 1) {
                            const translateY = (scrollPercent - 0.5) * 20;
                            card.style.transform = `translateY(${translateY}px)`;
                        }
                    });
                });
            }
        }

        addFloatingEffect() {
            this.cards.forEach((card, index) => {
                // Add subtle floating animation with staggered delay
                card.style.animation = `cardFloat 6s ease-in-out infinite`;
                card.style.animationDelay = `${index * 0.5}s`;
            });

            // Add CSS keyframes dynamically
            if (!document.querySelector('#cardFloatStyles')) {
                const style = document.createElement('style');
                style.id = 'cardFloatStyles';
                style.textContent = `
                    @keyframes cardFloat {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // ==========================================================================
    // SCROLL ANIMATIONS
    // ==========================================================================
    
    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll('[data-aos]');
            this.init();
        }

        init() {
            this.observeElements();
        }

        observeElements() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.elements.forEach(element => {
                    element.classList.add('aos-animate');
                });
                return;
            }

            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = element.getAttribute('data-aos-delay') || 0;
                        
                        setTimeout(() => {
                            element.classList.add('aos-animate');
                        }, parseInt(delay));
                        
                        observer.unobserve(element);
                    }
                });
            }, options);

            this.elements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    // ==========================================================================
    // COUNTER ANIMATION FOR HERO STATS
    // ==========================================================================
    
    class HeroCounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.hero-stat__number[data-count]');
            this.init();
        }

        init() {
            if (this.counters.length === 0) return;
            
            this.createObserver();
        }

        createObserver() {
            if (!('IntersectionObserver' in window)) {
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
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        }
    }

    // ==========================================================================
    // FLOATING SHAPES ANIMATION
    // ==========================================================================
    
    class FloatingShapes {
        constructor() {
            this.shapes = document.querySelectorAll('.floating-shape');
            this.init();
        }

        init() {
            this.addMouseInteraction();
            this.addRandomMovement();
        }

        addMouseInteraction() {
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;

                this.shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.5;
                    const x = (mouseX - 0.5) * speed * 20;
                    const y = (mouseY - 0.5) * speed * 20;
                    
                    shape.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        }

        addRandomMovement() {
            this.shapes.forEach((shape, index) => {
                setInterval(() => {
                    const randomX = Math.random() * 20 - 10;
                    const randomY = Math.random() * 20 - 10;
                    
                    shape.style.transform += ` translate(${randomX}px, ${randomY}px)`;
                }, 3000 + index * 500);
            });
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
            this.lazyLoadCards();
            this.optimizeAnimations();
        }

        lazyLoadCards() {
            if ('IntersectionObserver' in window) {
                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const card = entry.target;
                            card.classList.remove('loading');
                            card.classList.add('loaded');
                            cardObserver.unobserve(card);
                        }
                    });
                });

                const cards = document.querySelectorAll('.service-card-advanced');
                cards.forEach(card => {
                    card.classList.add('loading');
                    cardObserver.observe(card);
                });
            }
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
    // SEARCH FUNCTIONALITY
    // ==========================================================================
    
    class ServiceSearch {
        constructor() {
            this.searchInput = this.createSearchInput();
            this.services = document.querySelectorAll('.service-card-advanced');
            this.init();
        }

        createSearchInput() {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'service-search';
            searchContainer.innerHTML = `
                <div class="service-search__container">
                    <input type="text" class="service-search__input" placeholder="Search services..." aria-label="Search services">
                    <i class="fas fa-search service-search__icon"></i>
                </div>
            `;

            // Add CSS for search
            const style = document.createElement('style');
            style.textContent = `
                .service-search {
                    max-width: 400px;
                    margin: 0 auto var(--space-8);
                }
                .service-search__container {
                    position: relative;
                }
                .service-search__input {
                    width: 100%;
                    padding: var(--space-3) var(--space-12) var(--space-3) var(--space-4);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-full);
                    font-size: var(--text-base);
                    transition: all var(--transition-normal);
                }
                .service-search__input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    box-shadow: var(--shadow-lg);
                }
                .service-search__icon {
                    position: absolute;
                    right: var(--space-4);
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-gray-400);
                }
            `;
            document.head.appendChild(style);

            return searchContainer;
        }

        init() {
            this.insertSearchInput();
            this.bindEvents();
        }

        insertSearchInput() {
            const serviceNav = document.querySelector('.service-nav');
            if (serviceNav) {
                serviceNav.parentNode.insertBefore(this.searchInput, serviceNav.nextSibling);
            }
        }

        bindEvents() {
            const input = this.searchInput.querySelector('.service-search__input');
            
            input.addEventListener('input', (e) => {
                this.filterServices(e.target.value);
            });
        }

        filterServices(searchTerm) {
            const term = searchTerm.toLowerCase().trim();

            this.services.forEach(service => {
                const title = service.querySelector('.service-card-advanced__title')?.textContent.toLowerCase() || '';
                const description = service.querySelector('.service-card-advanced__description')?.textContent.toLowerCase() || '';
                const features = Array.from(service.querySelectorAll('.service-card-advanced__features li'))
                    .map(li => li.textContent.toLowerCase()).join(' ');

                const isMatch = title.includes(term) || description.includes(term) || features.includes(term);

                if (isMatch || term === '') {
                    service.style.display = 'flex';
                    service.style.opacity = '1';
                } else {
                    service.style.display = 'none';
                    service.style.opacity = '0';
                }
            });

            // Update section visibility
            this.updateSectionVisibility();
        }

        updateSectionVisibility() {
            const sections = document.querySelectorAll('.service-section[data-category]');
            
            sections.forEach(section => {
                const visibleCards = section.querySelectorAll('.service-card-advanced[style*="display: flex"], .service-card-advanced:not([style*="display: none"])');
                
                if (visibleCards.length > 0) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    }

    // ==========================================================================
    // MAIN APP INITIALIZATION
    // ==========================================================================
    
    class ServicesApp {
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
                // Initialize AOS if available
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
                this.components.serviceFilter = new ServiceFilter();
                this.components.faqAccordion = new FAQAccordion();
                this.components.pricingCalculator = new PricingCalculator();
                this.components.serviceCardAnimations = new ServiceCardAnimations();
                this.components.scrollAnimations = new ScrollAnimations();
                this.components.heroCounterAnimation = new HeroCounterAnimation();
                this.components.floatingShapes = new FloatingShapes();
                this.components.performanceOptimizer = new PerformanceOptimizer();
                this.components.serviceSearch = new ServiceSearch();

                // Add loading complete class
                document.body.classList.add('services-loaded');
                
                console.log('🚀 Services page initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing services page:', error);
            }
        }
    }

    // ==========================================================================
    // INITIALIZE APPLICATION
    // ==========================================================================
    
    // Create global services app instance
    window.ServicesApp = new ServicesApp();

})();