/**
 * About Page JavaScript
 * Interactive functionality for timeline, testimonials, team interactions, and advanced animations
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION & CONSTANTS
    // ==========================================================================
    
    const CONFIG = {
        ANIMATION_DURATION: 800,
        TESTIMONIAL_AUTO_DURATION: 5000,
        COUNTER_DURATION: 2000,
        SCROLL_THRESHOLD: 100,
        PARALLAX_SPEED: 0.5
    };

    const SELECTORS = {
        // Hero elements
        heroStats: '.hero-stat__number[data-count]',
        particles: '.particle',
        orbits: '.hero-orbit',
        
        // Timeline
        timelineItems: '.timeline-item',
        timelineMarkers: '.timeline-marker',
        timelineLine: '.timeline-line',
        
        // Testimonials
        testimonialSlider: '.testimonials-slider',
        testimonialTrack: '.testimonial-track',
        testimonialCards: '.testimonial-card',
        testimonialDots: '.testimonial-dot',
        testimonialNavPrev: '.testimonial-nav--prev',
        testimonialNavNext: '.testimonial-nav--next',
        
        // Team
        teamCards: '.team-card',
        teamImages: '.team-card__image',
        
        // Story section
        achievementCards: '.achievement-card',
        storyHighlights: '.highlight-item',
        
        // Values
        valueCards: '.value-card',
        
        // Achievements
        achievementItems: '.achievement-item'
    };

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
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

    function getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    function isElementInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const elementHeight = rect.height;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        
        return visibleHeight / elementHeight >= threshold;
    }

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // ==========================================================================
    // HERO ANIMATIONS
    // ==========================================================================
    
    class HeroAnimations {
        constructor() {
            this.particles = document.querySelectorAll(SELECTORS.particles);
            this.orbits = document.querySelectorAll(SELECTORS.orbits);
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }

        init() {
            this.bindEvents();
            this.animateParticles();
            this.enhanceOrbits();
        }

        bindEvents() {
            // Mouse movement for particle interaction
            document.addEventListener('mousemove', throttle((e) => {
                this.mouseX = e.clientX / window.innerWidth;
                this.mouseY = e.clientY / window.innerHeight;
                this.updateParticlePositions();
            }, 16));

            // Scroll-based parallax
            window.addEventListener('scroll', throttle(() => {
                this.updateParallax();
            }, 16));
        }

        animateParticles() {
            this.particles.forEach((particle, index) => {
                const delay = index * 0.5;
                const duration = 4 + Math.random() * 4;
                
                // Set initial random positions
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                
                particle.style.left = randomX + '%';
                particle.style.top = randomY + '%';
                
                // Add floating animation
                particle.style.animation = `particleFloat ${duration}s ease-in-out infinite ${delay}s`;
            });
        }

        updateParticlePositions() {
            this.particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.3;
                const offsetX = (this.mouseX - 0.5) * speed * 30;
                const offsetY = (this.mouseY - 0.5) * speed * 30;
                
                particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }

        enhanceOrbits() {
            this.orbits.forEach((orbit, index) => {
                const orbitElement = orbit.querySelector('.orbit-element');
                if (orbitElement) {
                    // Add interactive glow effect
                    orbit.addEventListener('mouseenter', () => {
                        orbitElement.style.boxShadow = '0 0 30px rgba(246, 173, 85, 0.8)';
                        orbitElement.style.transform = 'scale(1.3)';
                    });

                    orbit.addEventListener('mouseleave', () => {
                        orbitElement.style.boxShadow = '0 0 20px rgba(246, 173, 85, 0.6)';
                        orbitElement.style.transform = 'scale(1)';
                    });
                }
            });
        }

        updateParallax() {
            const scrolled = getScrollPosition();
            const rate = scrolled * -CONFIG.PARALLAX_SPEED;
            
            this.orbits.forEach((orbit, index) => {
                const speed = (index + 1) * 0.2;
                orbit.style.transform = `translateY(${rate * speed}px)`;
            });
        }
    }

    // ==========================================================================
    // COUNTER ANIMATIONS
    // ==========================================================================
    
    class CounterAnimations {
        constructor() {
            this.counters = document.querySelectorAll(SELECTORS.heroStats);
            this.animated = new Set();
            this.init();
        }

        init() {
            if (this.counters.length === 0) return;
            this.createObserver();
        }

        createObserver() {
            if (!('IntersectionObserver' in window)) {
                this.counters.forEach(counter => this.animateCounter(counter));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = CONFIG.COUNTER_DURATION;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.floor(easedProgress * target);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target;
                    this.addCompletionEffect(element);
                }
            };
            
            requestAnimationFrame(animate);
        }

        addCompletionEffect(element) {
            element.style.transform = 'scale(1.1)';
            element.style.color = 'var(--color-accent)';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 300);
        }
    }

    // ==========================================================================
    // TIMELINE INTERACTIONS
    // ==========================================================================
    
    class TimelineInteractions {
        constructor() {
            this.timelineItems = document.querySelectorAll(SELECTORS.timelineItems);
            this.timelineMarkers = document.querySelectorAll(SELECTORS.timelineMarkers);
            this.timelineLine = document.querySelector(SELECTORS.timelineLine);
            this.init();
        }

        init() {
            this.bindEvents();
            this.createProgressLine();
            this.addMarkerInteractions();
        }

        bindEvents() {
            window.addEventListener('scroll', throttle(() => {
                this.updateTimelineProgress();
            }, 16));
        }

        createProgressLine() {
            if (!this.timelineLine) return;
            
            const progressLine = document.createElement('div');
            progressLine.className = 'timeline-progress';
            progressLine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background: linear-gradient(to bottom, var(--color-accent), #ffd700);
                transition: height 0.3s ease-out;
                z-index: 2;
            `;
            
            this.timelineLine.appendChild(progressLine);
            this.progressLine = progressLine;
        }

        updateTimelineProgress() {
            if (!this.progressLine || this.timelineItems.length === 0) return;
            
            const firstItem = this.timelineItems[0];
            const lastItem = this.timelineItems[this.timelineItems.length - 1];
            
            const firstItemTop = firstItem.offsetTop;
            const lastItemTop = lastItem.offsetTop;
            const scrolled = getScrollPosition() + window.innerHeight / 2;
            
            if (scrolled <= firstItemTop) {
                this.progressLine.style.height = '0%';
            } else if (scrolled >= lastItemTop) {
                this.progressLine.style.height = '100%';
            } else {
                const progress = (scrolled - firstItemTop) / (lastItemTop - firstItemTop);
                this.progressLine.style.height = (progress * 100) + '%';
            }
        }

        addMarkerInteractions() {
            this.timelineMarkers.forEach((marker, index) => {
                marker.addEventListener('mouseenter', () => {
                    marker.style.transform = 'translateX(-50%) scale(1.2) rotate(10deg)';
                    marker.style.boxShadow = 'var(--shadow-2xl)';
                });

                marker.addEventListener('mouseleave', () => {
                    marker.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
                    marker.style.boxShadow = 'var(--shadow-xl)';
                });

                // Add click interaction
                marker.addEventListener('click', () => {
                    this.highlightTimelineItem(index);
                });
            });
        }

        highlightTimelineItem(index) {
            this.timelineItems.forEach((item, i) => {
                if (i === index) {
                    item.style.transform = 'scale(1.05)';
                    item.style.zIndex = '10';
                    setTimeout(() => {
                        item.style.transform = '';
                        item.style.zIndex = '';
                    }, 1000);
                }
            });
        }
    }

    // ==========================================================================
    // TESTIMONIAL SLIDER
    // ==========================================================================
    
    class TestimonialSlider {
        constructor() {
            this.slider = document.querySelector(SELECTORS.testimonialSlider);
            this.track = document.querySelector(SELECTORS.testimonialTrack);
            this.cards = document.querySelectorAll(SELECTORS.testimonialCards);
            this.dots = document.querySelectorAll(SELECTORS.testimonialDots);
            this.prevBtn = document.querySelector(SELECTORS.testimonialNavPrev);
            this.nextBtn = document.querySelector(SELECTORS.testimonialNavNext);
            
            this.currentSlide = 0;
            this.totalSlides = this.cards.length;
            this.autoplayTimer = null;
            this.isPlaying = true;
            
            this.init();
        }

        init() {
            if (!this.slider || this.totalSlides === 0) return;
            
            this.bindEvents();
            this.startAutoplay();
            this.updateSlider();
        }

        bindEvents() {
            // Navigation buttons
            this.prevBtn?.addEventListener('click', () => {
                this.prevSlide();
                this.pauseAutoplay();
            });

            this.nextBtn?.addEventListener('click', () => {
                this.nextSlide();
                this.pauseAutoplay();
            });

            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.pauseAutoplay();
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!isElementInViewport(this.slider)) return;
                
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.pauseAutoplay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.pauseAutoplay();
                }
            });

            // Pause on hover
            this.slider.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });

            this.slider.addEventListener('mouseleave', () => {
                if (this.isPlaying) {
                    this.startAutoplay();
                }
            });

            // Touch/swipe support
            this.addTouchSupport();
        }

        addTouchSupport() {
            let startX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoplay();
            });

            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });

            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                isDragging = false;
            });
        }

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateSlider();
        }

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlider();
        }

        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlider();
        }

        updateSlider() {
  // CORRECTED: Each slide is 100% width, so translate by currentSlide * 100%
  const translateX = -this.currentSlide * 100;
  this.track.style.transform = `translateX(${translateX}%)`;

  // Update card states
  this.cards.forEach((card, index) => {
      card.classList.toggle('testimonial-card--active', index === this.currentSlide);
  });

  // Update dots
  this.dots.forEach((dot, index) => {
      dot.classList.toggle('testimonial-dot--active', index === this.currentSlide);
  });

  // Add slide change effect
  this.addSlideChangeEffect();
}

        addSlideChangeEffect() {
            const activeCard = this.cards[this.currentSlide];
            if (activeCard) {
                activeCard.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    activeCard.style.transform = 'scale(1)';
                }, 200);
            }
        }

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => {
                this.nextSlide();
            }, CONFIG.TESTIMONIAL_AUTO_DURATION);
        }

        pauseAutoplay() {
            this.isPlaying = false;
            this.stopAutoplay();
            
            // Resume after 10 seconds of inactivity
            setTimeout(() => {
                this.isPlaying = true;
                if (isElementInViewport(this.slider)) {
                    this.startAutoplay();
                }
            }, 10000);
        }

        stopAutoplay() {
            if (this.autoplayTimer) {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        }
    }

    // ==========================================================================
    // TEAM CARD INTERACTIONS
    // ==========================================================================
    
    class TeamCardInteractions {
        constructor() {
            this.teamCards = document.querySelectorAll(SELECTORS.teamCards);
            this.init();
        }

        init() {
            this.addCardInteractions();
            this.addProfileImageEffects();
        }

        addCardInteractions() {
            this.teamCards.forEach((card, index) => {
                // Add staggered hover effects
                card.addEventListener('mouseenter', () => {
                    this.activateCard(card, index);
                });

                card.addEventListener('mouseleave', () => {
                    this.deactivateCard(card);
                });

                // Add click for mobile devices
                card.addEventListener('click', () => {
                    this.toggleCardActive(card);
                });
            });
        }

        activateCard(card, index) {
            // Add glow effect
            card.style.boxShadow = `var(--shadow-2xl), 0 0 30px rgba(26, 54, 93, 0.3)`;
            
            // Animate expertise tags
            const expertiseTags = card.querySelectorAll('.expertise-tag');
            expertiseTags.forEach((tag, tagIndex) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px) scale(1.05)';
                    tag.style.background = 'var(--color-primary)';
                    tag.style.color = 'var(--color-white)';
                }, tagIndex * 100);
            });

            // Add ripple effect
            this.addRippleEffect(card);
        }

        deactivateCard(card) {
            card.style.boxShadow = '';
            
            const expertiseTags = card.querySelectorAll('.expertise-tag');
            expertiseTags.forEach(tag => {
                tag.style.transform = '';
                tag.style.background = '';
                tag.style.color = '';
            });
        }

        toggleCardActive(card) {
            card.classList.toggle('team-card--active');
        }

        addRippleEffect(card) {
            const ripple = document.createElement('div');
            ripple.className = 'card-ripple';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(26, 54, 93, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: cardRipple 0.8s ease-out forwards;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            // Add CSS animation
            if (!document.querySelector('#cardRippleStyles')) {
                const style = document.createElement('style');
                style.id = 'cardRippleStyles';
                style.textContent = `
                    @keyframes cardRipple {
                        0% { width: 0; height: 0; opacity: 0.5; }
                        100% { width: 300px; height: 300px; opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        }

        addProfileImageEffects() {
            const teamImages = document.querySelectorAll(SELECTORS.teamImages);
            
            teamImages.forEach(image => {
                const placeholder = image.querySelector('.image-placeholder');
                if (placeholder) {
                    // Add floating animation
                    placeholder.style.animation = 'profileFloat 4s ease-in-out infinite';
                    
                    // Add CSS if not exists
                    if (!document.querySelector('#profileFloatStyles')) {
                        const style = document.createElement('style');
                        style.id = 'profileFloatStyles';
                        style.textContent = `
                            @keyframes profileFloat {
                                0%, 100% { transform: translateY(0px) rotate(0deg); }
                                25% { transform: translateY(-5px) rotate(2deg); }
                                50% { transform: translateY(-10px) rotate(0deg); }
                                75% { transform: translateY(-5px) rotate(-2deg); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
            });
        }
    }

    // ==========================================================================
    // STORY SECTION ANIMATIONS
    // ==========================================================================
    
    class StoryAnimations {
        constructor() {
            this.achievementCards = document.querySelectorAll(SELECTORS.achievementCards);
            this.highlights = document.querySelectorAll(SELECTORS.storyHighlights);
            this.init();
        }

        init() {
            this.addCardFloatingEffects();
            this.addHighlightInteractions();
            this.createIntersectionObserver();
        }

        addCardFloatingEffects() {
            this.achievementCards.forEach((card, index) => {
                // Enhanced floating with mouse interaction
                card.addEventListener('mouseenter', () => {
                    card.style.animationPlayState = 'paused';
                    card.style.transform = `translateY(-15px) rotate(${index % 2 === 0 ? '3deg' : '-3deg'}) scale(1.05)`;
                    card.style.boxShadow = 'var(--shadow-2xl)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.animationPlayState = 'running';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
            });
        }

        addHighlightInteractions() {
            this.highlights.forEach((highlight, index) => {
                highlight.addEventListener('mouseenter', () => {
                    highlight.style.transform = 'translateX(12px) scale(1.02)';
                    highlight.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))';
                    highlight.style.color = 'var(--color-white)';
                    
                    const icon = highlight.querySelector('i');
                    if (icon) {
                        icon.style.color = 'var(--color-accent)';
                        icon.style.transform = 'scale(1.2) rotate(15deg)';
                    }
                });

                highlight.addEventListener('mouseleave', () => {
                    highlight.style.transform = '';
                    highlight.style.background = '';
                    highlight.style.color = '';
                    
                    const icon = highlight.querySelector('i');
                    if (icon) {
                        icon.style.color = '';
                        icon.style.transform = '';
                    }
                });
            });
        }

        createIntersectionObserver() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStoryElements(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            const storySection = document.querySelector('.company-story');
            if (storySection) {
                observer.observe(storySection);
            }
        }

        animateStoryElements(section) {
            const title = section.querySelector('.story-title');
            const descriptions = section.querySelectorAll('.story-description');
            
            if (title) {
                title.style.transform = 'translateY(20px)';
                title.style.opacity = '0';
                setTimeout(() => {
                    title.style.transition = 'all 0.8s ease-out';
                    title.style.transform = 'translateY(0)';
                    title.style.opacity = '1';
                }, 200);
            }

            descriptions.forEach((desc, index) => {
                desc.style.transform = 'translateY(30px)';
                desc.style.opacity = '0';
                setTimeout(() => {
                    desc.style.transition = 'all 0.8s ease-out';
                    desc.style.transform = 'translateY(0)';
                    desc.style.opacity = '1';
                }, 400 + index * 200);
            });
        }
    }

    // ==========================================================================
    // VALUE CARDS INTERACTIONS
    // ==========================================================================
    
    class ValueCardInteractions {
        constructor() {
            this.valueCards = document.querySelectorAll(SELECTORS.valueCards);
            this.init();
        }

        init() {
            this.addCardInteractions();
            this.addSequentialRevealEffect();
        }

        addCardInteractions() {
            this.valueCards.forEach((card, index) => {
                // Enhanced 3D tilt effect
                card.addEventListener('mousemove', (e) => {
                    this.tiltCard(card, e);
                });

                card.addEventListener('mouseleave', () => {
                    this.resetCard(card);
                });

                // Add click interaction for mobile
                card.addEventListener('click', () => {
                    this.pulseCard(card);
                });
            });
        }

        tiltCard(card, event) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = event.clientX - centerX;
            const mouseY = event.clientY - centerY;
            
            const tiltX = (mouseY / rect.height) * 10;
            const tiltY = (mouseX / rect.width) * -10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                translateY(-8px) 
                scale(1.02)
            `;
            
            // Add spotlight effect
            const spotlight = card.querySelector('.value-spotlight') || this.createSpotlight(card);
            spotlight.style.background = `
                radial-gradient(
                    circle at ${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%,
                    rgba(246, 173, 85, 0.1) 0%,
                    transparent 50%
                )
            `;
            spotlight.style.opacity = '1';
        }

        resetCard(card) {
            card.style.transform = '';
            
            const spotlight = card.querySelector('.value-spotlight');
            if (spotlight) {
                spotlight.style.opacity = '0';
            }
        }

        createSpotlight(card) {
            const spotlight = document.createElement('div');
            spotlight.className = 'value-spotlight';
            spotlight.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: var(--radius-2xl);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            card.style.position = 'relative';
            card.appendChild(spotlight);
            return spotlight;
        }

        pulseCard(card) {
            card.style.animation = 'cardPulse 0.6s ease-out';
            
            if (!document.querySelector('#cardPulseStyles')) {
                const style = document.createElement('style');
                style.id = 'cardPulseStyles';
                style.textContent = `
                    @keyframes cardPulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); box-shadow: var(--shadow-2xl); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        }

        addSequentialRevealEffect() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.revealCardsSequentially();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            const valuesSection = document.querySelector('.core-values');
            if (valuesSection) {
                observer.observe(valuesSection);
            }
        }

        revealCardsSequentially() {
            this.valueCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px) rotateY(90deg)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.8s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) rotateY(0)';
                }, index * 150);
            });
        }
    }

    // ==========================================================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ==========================================================================
    
    class ScrollAnimations {
        constructor() {
            this.animatedElements = new Set();
            this.init();
        }

        init() {
            this.createScrollObserver();
            this.addParallaxEffects();
        }

        createScrollObserver() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe achievement items
            const achievementItems = document.querySelectorAll(SELECTORS.achievementItems);
            achievementItems.forEach(item => observer.observe(item));

            // Observe section headers
            const sectionHeaders = document.querySelectorAll('.section-header');
            sectionHeaders.forEach(header => observer.observe(header));
        }

        animateElement(element) {
            if (element.classList.contains('achievement-item')) {
                this.animateAchievementItem(element);
            } else if (element.classList.contains('section-header')) {
                this.animateSectionHeader(element);
            }
        }

        animateAchievementItem(item) {
            const icon = item.querySelector('.achievement-icon');
            const title = item.querySelector('.achievement-title');
            const description = item.querySelector('.achievement-description');

            // Animate icon
            if (icon) {
                icon.style.transform = 'scale(0) rotate(180deg)';
                icon.style.opacity = '0';
                setTimeout(() => {
                    icon.style.transition = 'all 0.6s ease-out';
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.opacity = '1';
                }, 200);
            }

            // Animate title
            if (title) {
                title.style.transform = 'translateX(-30px)';
                title.style.opacity = '0';
                setTimeout(() => {
                    title.style.transition = 'all 0.6s ease-out';
                    title.style.transform = 'translateX(0)';
                    title.style.opacity = '1';
                }, 400);
            }

            // Animate description
            if (description) {
                description.style.transform = 'translateY(20px)';
                description.style.opacity = '0';
                setTimeout(() => {
                    description.style.transition = 'all 0.6s ease-out';
                    description.style.transform = 'translateY(0)';
                    description.style.opacity = '1';
                }, 600);
            }
        }

        animateSectionHeader(header) {
            const title = header.querySelector('.section-header__title');
            const description = header.querySelector('.section-header__description');

            if (title) {
                this.animateText(title, 'fadeInUp');
            }

            if (description) {
                setTimeout(() => {
                    this.animateText(description, 'fadeInUp');
                }, 300);
            }
        }

        animateText(element, animationType) {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map(word => 
                `<span class="animated-word" style="display:inline-block;opacity:0;transform:translateY(20px);">${word}</span>`
            ).join(' ');

            const animatedWords = element.querySelectorAll('.animated-word');
            animatedWords.forEach((word, index) => {
                setTimeout(() => {
                    word.style.transition = 'all 0.6s ease-out';
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        addParallaxEffects() {
            const parallaxElements = document.querySelectorAll('.achievement-card, .value-card');
            
            window.addEventListener('scroll', throttle(() => {
                const scrolled = getScrollPosition();
                
                parallaxElements.forEach((element, index) => {
                    if (isElementInViewport(element)) {
                        const speed = 0.1 + (index % 3) * 0.05;
                        const yPos = scrolled * speed;
                        element.style.transform = `translateY(${yPos}px)`;
                    }
                });
            }, 16));
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
            this.optimizeImages();
            this.lazyLoadContent();
            this.preloadCriticalAssets();
            this.optimizeAnimations();
        }

        optimizeImages() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }

        lazyLoadContent() {
            if (!('IntersectionObserver' in window)) return;

            const lazyElements = document.querySelectorAll('[data-lazy]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });

            lazyElements.forEach(element => observer.observe(element));
        }

        loadElement(element) {
            const src = element.getAttribute('data-lazy');
            if (src) {
                element.src = src;
                element.removeAttribute('data-lazy');
            }
        }

        preloadCriticalAssets() {
            // Preload critical CSS animations
            const criticalAnimations = [
                'cardFloat1', 'cardFloat2', 'cardFloat3',
                'orbit', 'pulse', 'particleFloat'
            ];

            criticalAnimations.forEach(animation => {
                const element = document.createElement('div');
                element.style.animation = `${animation} 0.1s`;
                element.style.visibility = 'hidden';
                element.style.position = 'absolute';
                document.body.appendChild(element);
                
                setTimeout(() => {
                    document.body.removeChild(element);
                }, 100);
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

            // Optimize animations based on device performance
            this.optimizeForDevice();
        }

        optimizeForDevice() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
            const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

            if (isSlowConnection || isLowEndDevice) {
                document.body.classList.add('reduced-animations');
                
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-animations * {
                        animation-duration: 0.3s !important;
                        transition-duration: 0.3s !important;
                    }
                    .reduced-animations .particle,
                    .reduced-animations .hero-orbit,
                    .reduced-animations .floating-shape {
                        display: none !important;
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
            this.addAriaLabels();
            this.manageFocus();
            this.addScreenReaderSupport();
        }

        enhanceKeyboardNavigation() {
            // Make interactive elements keyboard accessible
            const interactiveElements = document.querySelectorAll('.team-card, .value-card, .achievement-item');
            
            interactiveElements.forEach((element, index) => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }

                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });

                element.addEventListener('focus', () => {
                    element.style.outline = '2px solid var(--color-primary)';
                    element.style.outlineOffset = '2px';
                });

                element.addEventListener('blur', () => {
                    element.style.outline = '';
                    element.style.outlineOffset = '';
                });
            });
        }

        addAriaLabels() {
            // Add ARIA labels to timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                const year = item.querySelector('.timeline-year')?.textContent;
                const title = item.querySelector('.timeline-title')?.textContent;
                
                if (year && title) {
                    item.setAttribute('aria-label', `Timeline milestone: ${year}, ${title}`);
                }
            });

            // Add ARIA labels to testimonial controls
            const testimonialDots = document.querySelectorAll('.testimonial-dot');
            testimonialDots.forEach((dot, index) => {
                dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            });

            // Add ARIA labels to team cards
            const teamCards = document.querySelectorAll('.team-card');
            teamCards.forEach(card => {
                const name = card.querySelector('.team-card__name')?.textContent;
                const position = card.querySelector('.team-card__position')?.textContent;
                
                if (name && position) {
                    card.setAttribute('aria-label', `Team member: ${name}, ${position}`);
                }
            });
        }

        manageFocus() {
            // Ensure proper focus management for slider
            const testimonialSlider = document.querySelector('.testimonials-slider');
            if (testimonialSlider) {
                testimonialSlider.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        // Allow normal tab navigation within testimonials
                        return;
                    }
                });
            }
        }

        addScreenReaderSupport() {
            // Create live region for dynamic content announcements
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'about-live-region';
            document.body.appendChild(liveRegion);

            // Announce slide changes
            if (window.TestimonialSlider) {
                const originalUpdateSlider = TestimonialSlider.prototype.updateSlider;
                TestimonialSlider.prototype.updateSlider = function() {
                    originalUpdateSlider.call(this);
                    
                    const activeCard = this.cards[this.currentSlide];
                    const authorName = activeCard?.querySelector('.author-name')?.textContent;
                    
                    if (authorName) {
                        liveRegion.textContent = `Now showing testimonial from ${authorName}`;
                    }
                };
            }
        }
    }

    // ==========================================================================
    // MAIN APP INITIALIZATION
    // ==========================================================================
    
    class AboutApp {
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
                        duration: 800,
                        easing: 'ease-out-cubic',
                        once: true,
                        offset: 50,
                        delay: 100
                    });
                }

                // Initialize all components
                this.components.heroAnimations = new HeroAnimations();
                this.components.counterAnimations = new CounterAnimations();
                this.components.timelineInteractions = new TimelineInteractions();
                this.components.testimonialSlider = new TestimonialSlider();
                this.components.teamCardInteractions = new TeamCardInteractions();
                this.components.storyAnimations = new StoryAnimations();
                this.components.valueCardInteractions = new ValueCardInteractions();
                this.components.scrollAnimations = new ScrollAnimations();
                this.components.performanceOptimizer = new PerformanceOptimizer();
                this.components.accessibilityEnhancer = new AccessibilityEnhancer();

                // Add page-specific enhancements
                this.addPageEnhancements();
                
                console.log('🚀 About page initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing about page:', error);
            }
        }

        addPageEnhancements() {
            // Add smooth reveal animation for page load
            document.body.classList.add('about-loaded');
            
            // Add intersection observer for sections
            this.observeSections();
            
            // Initialize Easter eggs
            this.addEasterEggs();
        }

        observeSections() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                    }
                });
            }, { threshold: 0.1 });

            const sections = document.querySelectorAll('section');
            sections.forEach(section => observer.observe(section));
        }

        addEasterEggs() {
            // Konami Code easter egg
            let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
            let konamiIndex = 0;

            document.addEventListener('keydown', (e) => {
                if (e.keyCode === konamiCode[konamiIndex]) {
                    konamiIndex++;
                    if (konamiIndex === konamiCode.length) {
                        this.activateEasterEgg();
                        konamiIndex = 0;
                    }
                } else {
                    konamiIndex = 0;
                }
            });
        }

        activateEasterEgg() {
            // Add rainbow animation to all cards
            const cards = document.querySelectorAll('.team-card, .value-card, .achievement-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'rainbow 2s ease-in-out';
                    card.style.transform = 'scale(1.05) rotate(5deg)';
                }, index * 100);
            });

            // Add CSS for rainbow effect
            if (!document.querySelector('#rainbowStyles')) {
                const style = document.createElement('style');
                style.id = 'rainbowStyles';
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        50% { filter: hue-rotate(180deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Show celebration message
            if (window.announceToScreenReader) {
                window.announceToScreenReader('🎉 Easter egg activated! Welcome to the rainbow zone!');
            }

            // Reset after 3 seconds
            setTimeout(() => {
                cards.forEach(card => {
                    card.style.animation = '';
                    card.style.transform = '';
                });
            }, 3000);
        }
    }

    // ==========================================================================
    // INITIALIZE APPLICATION
    // ==========================================================================
    
    // Create global about app instance
    window.AboutApp = new AboutApp();

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible - resume animations
            document.body.classList.remove('page-hidden');
        }
    });

})();