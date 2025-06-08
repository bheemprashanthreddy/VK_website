/**
 * Contact Page JavaScript
 * Advanced interactive functionality with multi-step forms, animations, and modern UX
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION & CONSTANTS
    // ==========================================================================
    
    const CONFIG = {
        ANIMATION_DURATION: 600,
        TYPEWRITER_SPEED: 100,
        COUNTER_DURATION: 2000,
        TESTIMONIAL_AUTO_DURATION: 5000,
        PARTICLE_COUNT: 8,
        MAP_ZOOM: 15,
        FORM_STEPS: 3,
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    };

    const SELECTORS = {
        // Hero elements
        typewriterText: '.typewriter-text',
        heroStats: '.hero-stat__number[data-count]',
        particles: '.particle',
        morphingShapes: '.morphing-shape',
        
        // Contact cards
        contactCards: '.contact-card',
        
        // Form elements
        contactForm: '#contactForm',
        formSteps: '.form-step',
        formNavigation: '.form-navigation',
        prevBtn: '#prevStep',
        nextBtn: '#nextStep',
        submitBtn: '#submitForm',
        progressFill: '.progress-fill',
        progressText: '.progress-current',
        formSuccess: '#formSuccess',
        sendAnotherBtn: '#sendAnother',
        
        // File upload
        fileUploadArea: '#fileUploadArea',
        fileInput: '#documents',
        fileList: '.file-list',
        
        // FAQ
        faqQuestions: '.faq-question',
        faqSearch: '#faqSearch',
        faqCategoryBtns: '.faq-category-btn',
        faqItems: '.faq-item',
        
        // Testimonials
        testimonialSlider: '.testimonials-slider',
        testimonialTrack: '.testimonial-track',
        testimonialCards: '.testimonial-card',
        testimonialDots: '.testimonial-dot',
        testimonialNavPrev: '.testimonial-nav--prev',
        testimonialNavNext: '.testimonial-nav--next',
        
        // Map
        loadMapBtn: '#loadMap',
        googleMap: '#googleMap',
        mapPlaceholder: '.map-placeholder'
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

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    }

    // ==========================================================================
    // TYPEWRITER EFFECT
    // ==========================================================================
    
    class TypewriterEffect {
        constructor() {
            this.element = document.querySelector(SELECTORS.typewriterText);
            this.text = '';
            this.index = 0;
            this.init();
        }

        init() {
            if (!this.element) return;
            
            this.text = this.element.getAttribute('data-text') || this.element.textContent;
            this.element.textContent = '';
            this.element.style.borderRight = '3px solid var(--color-accent)';
            
            setTimeout(() => {
                this.typeText();
            }, 1000);
        }

        typeText() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(() => this.typeText(), CONFIG.TYPEWRITER_SPEED);
            } else {
                this.startBlinking();
            }
        }

        startBlinking() {
            setInterval(() => {
                this.element.style.borderRightColor = 
                    this.element.style.borderRightColor === 'transparent' 
                        ? 'var(--color-accent)' 
                        : 'transparent';
            }, 1000);
        }
    }

    // ==========================================================================
    // PARTICLE SYSTEM
    // ==========================================================================
    
    class ParticleSystem {
        constructor() {
            this.particles = document.querySelectorAll(SELECTORS.particles);
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }

        init() {
            this.bindEvents();
            this.animateParticles();
        }

        bindEvents() {
            document.addEventListener('mousemove', throttle((e) => {
                this.mouseX = e.clientX / window.innerWidth;
                this.mouseY = e.clientY / window.innerHeight;
                this.updateParticlePositions();
            }, 16));
        }

        animateParticles() {
            this.particles.forEach((particle, index) => {
                const delay = index * 0.5;
                const duration = 6 + Math.random() * 4;
                
                particle.style.animationDelay = `${delay}s`;
                particle.style.animationDuration = `${duration}s`;
                
                // Add click interaction
                particle.addEventListener('click', () => {
                    this.createRipple(particle);
                });
            });
        }

        updateParticlePositions() {
            this.particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.2;
                const offsetX = (this.mouseX - 0.5) * speed * 20;
                const offsetY = (this.mouseY - 0.5) * speed * 20;
                
                particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }

        createRipple(particle) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(246, 173, 85, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: particleRipple 0.8s ease-out forwards;
            `;
            
            particle.style.position = 'relative';
            particle.appendChild(ripple);
            
            if (!document.querySelector('#particleRippleStyles')) {
                const style = document.createElement('style');
                style.id = 'particleRippleStyles';
                style.textContent = `
                    @keyframes particleRipple {
                        0% { width: 0; height: 0; opacity: 0.7; }
                        100% { width: 100px; height: 100px; opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
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
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target.toLocaleString();
                    this.addCompletionEffect(element);
                }
            };
            
            requestAnimationFrame(animate);
        }

        addCompletionEffect(element) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // ==========================================================================
    // CONTACT CARD INTERACTIONS
    // ==========================================================================
    
    class ContactCardInteractions {
        constructor() {
            this.cards = document.querySelectorAll(SELECTORS.contactCards);
            this.init();
        }

        init() {
            this.addCardInteractions();
        }

        addCardInteractions() {
            this.cards.forEach((card, index) => {
                // Enhanced hover effects
                card.addEventListener('mouseenter', () => {
                    this.activateCard(card);
                });

                card.addEventListener('mouseleave', () => {
                    this.deactivateCard(card);
                });

                // Click interactions
                card.addEventListener('click', () => {
                    this.handleCardClick(card);
                });

                // Keyboard accessibility
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleCardClick(card);
                    }
                });

                // Add tab index for accessibility
                card.setAttribute('tabindex', '0');
            });
        }

        activateCard(card) {
            const icon = card.querySelector('.contact-card__icon');
            const hoverEffect = card.querySelector('.contact-card__hover-effect');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            if (hoverEffect) {
                hoverEffect.style.opacity = '1';
            }

            // Add pulse effect to availability dot
            const dot = card.querySelector('.availability-dot');
            if (dot) {
                dot.style.animationDuration = '1s';
            }
        }

        deactivateCard(card) {
            const icon = card.querySelector('.contact-card__icon');
            const hoverEffect = card.querySelector('.contact-card__hover-effect');
            
            if (icon) {
                icon.style.transform = '';
            }
            
            if (hoverEffect) {
                hoverEffect.style.opacity = '';
            }

            const dot = card.querySelector('.availability-dot');
            if (dot) {
                dot.style.animationDuration = '';
            }
        }

        handleCardClick(card) {
            const link = card.querySelector('.contact-card__link');
            if (link) {
                // Add visual feedback
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                    if (link.href.startsWith('tel:') || link.href.startsWith('mailto:') || link.href.includes('wa.me')) {
                        window.open(link.href, '_self');
                    } else {
                        link.click();
                    }
                }, 150);
            }
        }
    }

    // ==========================================================================
    // MULTI-STEP FORM HANDLER
    // ==========================================================================
    
    class MultiStepForm {
        constructor() {
            this.form = document.querySelector(SELECTORS.contactForm);
            this.steps = document.querySelectorAll(SELECTORS.formSteps);
            this.prevBtn = document.querySelector(SELECTORS.prevBtn);
            this.nextBtn = document.querySelector(SELECTORS.nextBtn);
            this.submitBtn = document.querySelector(SELECTORS.submitBtn);
            this.progressFill = document.querySelector(SELECTORS.progressFill);
            this.progressText = document.querySelector(SELECTORS.progressText);
            this.formSuccess = document.querySelector(SELECTORS.formSuccess);
            this.sendAnotherBtn = document.querySelector(SELECTORS.sendAnotherBtn);
            
            this.currentStep = 1;
            this.totalSteps = CONFIG.FORM_STEPS;
            this.formData = {};
            
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.bindEvents();
            this.updateProgress();
            this.setupValidation();
            this.setupFileUpload();
            this.setupCharacterCount();
        }

        bindEvents() {
            // Navigation buttons
            this.prevBtn?.addEventListener('click', () => this.previousStep());
            this.nextBtn?.addEventListener('click', () => this.nextStep());
            this.submitBtn?.addEventListener('click', (e) => this.handleSubmit(e));
            this.sendAnotherBtn?.addEventListener('click', () => this.resetForm());

            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.closest('.form-step--active')) {
                    e.preventDefault();
                    if (this.currentStep < this.totalSteps) {
                        this.nextStep();
                    } else {
                        this.handleSubmit(e);
                    }
                }
            });
        }

        nextStep() {
            // Validate current step
            if (!this.validateCurrentStep()) {
                this.showValidationErrors();
                return;
            }

            if (this.currentStep < this.totalSteps) {
                this.hideStep(this.currentStep);
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateButtons();
                
                // Smooth scroll to form
                this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        previousStep() {
            if (this.currentStep > 1) {
                this.hideStep(this.currentStep);
                this.currentStep--;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateButtons();
            }
        }

        showStep(stepNumber) {
            const step = this.form.querySelector(`.form-step[data-step="${stepNumber}"]`);
            if (step) {
                step.classList.add('form-step--active');
                step.style.display = 'block';
                
                // Focus first input in step
                setTimeout(() => {
                    const firstInput = step.querySelector('input, textarea, select');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 300);
            }
        }

        hideStep(stepNumber) {
            const step = this.form.querySelector(`.form-step[data-step="${stepNumber}"]`);
            if (step) {
                step.classList.remove('form-step--active');
                setTimeout(() => {
                    step.style.display = 'none';
                }, 300);
            }
        }

        updateProgress() {
            const progress = (this.currentStep / this.totalSteps) * 100;
            
            if (this.progressFill) {
                this.progressFill.style.width = `${progress}%`;
            }
            
            if (this.progressText) {
                this.progressText.textContent = Math.round(progress);
            }
        }

        updateButtons() {
            // Previous button
            if (this.prevBtn) {
                if (this.currentStep === 1) {
                    this.prevBtn.style.display = 'none';
                } else {
                    this.prevBtn.style.display = 'inline-flex';
                }
            }

            // Next/Submit buttons
            if (this.currentStep === this.totalSteps) {
                if (this.nextBtn) this.nextBtn.style.display = 'none';
                if (this.submitBtn) this.submitBtn.style.display = 'inline-flex';
            } else {
                if (this.nextBtn) this.nextBtn.style.display = 'inline-flex';
                if (this.submitBtn) this.submitBtn.style.display = 'none';
            }
        }

        validateCurrentStep() {
            const currentStepElement = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            const requiredFields = currentStepElement.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const validation = field.getAttribute('data-validation');
            let isValid = true;
            let errorMessage = '';

            // Required validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            // Email validation
            else if ((type === 'email' || validation === 'email') && value && !validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            // Phone validation
            else if ((type === 'tel' || validation === 'phone') && value && !validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            // Name validation
            else if (validation === 'name' && value && !validateName(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid name (letters only)';
            }
            // Textarea minimum length
            else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (minimum 10 characters)';
            }

            this.showFieldError(field, isValid ? null : errorMessage);
            return isValid;
        }

        showFieldError(field, message) {
            const fieldGroup = field.closest('.form-group');
            let errorElement = fieldGroup.querySelector('.error-message');

            // Remove existing error
            if (errorElement) {
                errorElement.classList.remove('show');
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.textContent = '';
                    }
                }, 300);
            }

            field.classList.remove('error', 'success');

            if (message) {
                // Add error class
                field.classList.add('error');

                // Show error message
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.classList.add('show');
                }
            } else if (field.value.trim()) {
                field.classList.add('success');
            }
        }

        clearFieldError(field) {
            const fieldGroup = field.closest('.form-group');
            const errorElement = fieldGroup.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.classList.remove('show');
            }
            
            field.classList.remove('error');
        }

        showValidationErrors() {
            const currentStepElement = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            const firstError = currentStepElement.querySelector('.error');
            
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Add shake animation to form
            this.form.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.form.style.animation = '';
            }, 500);
            
            // Add CSS for shake if not exists
            if (!document.querySelector('#shakeStyles')) {
                const style = document.createElement('style');
                style.id = 'shakeStyles';
                style.textContent = `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        async handleSubmit(e) {
            e.preventDefault();

            // Validate all fields
            if (!this.validateCurrentStep()) {
                this.showValidationErrors();
                return;
            }

            // Show loading state
            this.showLoadingState();

            // Collect form data
            this.collectFormData();

            try {
                // Simulate form submission (replace with actual API call)
                await this.submitForm();
                this.showSuccessState();
            } catch (error) {
                this.showErrorState(error.message);
            }
        }

        showLoadingState() {
            if (this.submitBtn) {
                this.submitBtn.classList.add('loading');
                this.submitBtn.disabled = true;
            }
        }

        collectFormData() {
            const formData = new FormData(this.form);
            this.formData = {};
            
            for (let [key, value] of formData.entries()) {
                if (this.formData[key]) {
                    if (Array.isArray(this.formData[key])) {
                        this.formData[key].push(value);
                    } else {
                        this.formData[key] = [this.formData[key], value];
                    }
                } else {
                    this.formData[key] = value;
                }
            }
        }

        async submitForm() {
            // Simulate API call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success (90% chance)
                    if (Math.random() > 0.1) {
                        resolve({ success: true, message: 'Form submitted successfully' });
                    } else {
                        reject(new Error('Network error. Please try again.'));
                    }
                }, 2000);
            });
        }

        showSuccessState() {
            this.form.style.display = 'none';
            if (this.formSuccess) {
                this.formSuccess.style.display = 'block';
            }

            // Send confirmation to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Form submitted successfully! We will contact you within 24 hours.');
            }
        }

        showErrorState(message) {
            if (this.submitBtn) {
                this.submitBtn.classList.remove('loading');
                this.submitBtn.disabled = false;
            }

            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.innerHTML = `
                <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <strong>Error:</strong> ${message}
                </div>
            `;
            
            this.form.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }

        resetForm() {
            this.form.reset();
            this.form.style.display = 'block';
            if (this.formSuccess) {
                this.formSuccess.style.display = 'none';
            }
            
            this.currentStep = 1;
            this.showStep(1);
            this.updateProgress();
            this.updateButtons();
            
            // Clear all validation states
            const fields = this.form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                field.classList.remove('error', 'success');
            });
            
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.classList.remove('show');
                error.textContent = '';
            });
        }

        setupValidation() {
            // Custom validation patterns
            const phoneInput = this.form.querySelector('input[type="tel"]');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 0 && !value.startsWith('91')) {
                        value = '91' + value;
                    }
                    if (value.length > 12) {
                        value = value.slice(0, 12);
                    }
                    e.target.value = value.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
                });
            }

            // Currency input formatting
            const currencyInput = this.form.querySelector('input[data-validation="currency"]');
            if (currencyInput) {
                currencyInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/[^\d]/g, '');
                    if (value) {
                        value = parseInt(value).toLocaleString('en-IN');
                        e.target.value = '₹ ' + value;
                    }
                });
            }
        }

        setupFileUpload() {
            const fileUploadArea = document.querySelector(SELECTORS.fileUploadArea);
            const fileInput = document.querySelector(SELECTORS.fileInput);
            const fileList = document.querySelector(SELECTORS.fileList);

            if (!fileUploadArea || !fileInput || !fileList) return;

            // Drag and drop events
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });

            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('dragover');
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }

        handleFiles(files) {
            const fileList = document.querySelector(SELECTORS.fileList);
            
            Array.from(files).forEach(file => {
                if (this.validateFile(file)) {
                    this.addFileToList(file, fileList);
                }
            });
        }

        validateFile(file) {
            const extension = getFileExtension(file.name);
            const size = file.size;

            if (!CONFIG.ALLOWED_FILE_TYPES.includes(extension)) {
                this.showFileError(`File type .${extension} is not allowed`);
                return false;
            }

            if (size > CONFIG.MAX_FILE_SIZE) {
                this.showFileError(`File size exceeds ${formatFileSize(CONFIG.MAX_FILE_SIZE)} limit`);
                return false;
            }

            return true;
        }

        addFileToList(file, fileList) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-file-${this.getFileIcon(file)}"></i>
                    </div>
                    <div class="file-details">
                        <h5>${file.name}</h5>
                        <p>${formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button type="button" class="file-remove" aria-label="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            `;

            fileList.appendChild(fileItem);

            // Add remove functionality
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', () => {
                fileItem.remove();
            });
        }

        getFileIcon(file) {
            const extension = getFileExtension(file.name);
            const iconMap = {
                'pdf': 'pdf',
                'doc': 'word',
                'docx': 'word',
                'jpg': 'image',
                'jpeg': 'image',
                'png': 'image'
            };
            return iconMap[extension] || 'alt';
        }

        showFileError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'file-error';
            errorDiv.style.cssText = `
                background: #fee;
                border: 1px solid #fcc;
                color: #c33;
                padding: 0.5rem;
                border-radius: 0.25rem;
                margin: 0.5rem 0;
                font-size: 0.875rem;
            `;
            errorDiv.textContent = message;

            const fileUploadArea = document.querySelector(SELECTORS.fileUploadArea);
            fileUploadArea.parentNode.insertBefore(errorDiv, fileUploadArea.nextSibling);

            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 3000);
        }

        setupCharacterCount() {
            const textarea = this.form.querySelector('textarea');
            const characterCount = this.form.querySelector('.character-count');
            const currentCount = characterCount?.querySelector('.count-current');
            const maxCount = characterCount?.querySelector('.count-max');

            if (textarea && currentCount && maxCount) {
                const maxLength = parseInt(maxCount.textContent);
                
                textarea.addEventListener('input', () => {
                    const currentLength = textarea.value.length;
                    currentCount.textContent = currentLength;
                    
                    if (currentLength > maxLength * 0.9) {
                        characterCount.style.color = '#ef4444';
                    } else if (currentLength > maxLength * 0.7) {
                        characterCount.style.color = '#f59e0b';
                    } else {
                        characterCount.style.color = '';
                    }
                });
            }
        }
    }

    // ==========================================================================
    // FAQ FUNCTIONALITY
    // ==========================================================================
    
    class FAQManager {
        constructor() {
            this.faqQuestions = document.querySelectorAll(SELECTORS.faqQuestions);
            this.faqSearch = document.querySelector(SELECTORS.faqSearch);
            this.categoryBtns = document.querySelectorAll(SELECTORS.faqCategoryBtns);
            this.faqItems = document.querySelectorAll(SELECTORS.faqItems);
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // FAQ accordion
            this.faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    this.toggleFAQ(question);
                });

                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(question);
                    }
                });
            });

            // Search functionality
            if (this.faqSearch) {
                this.faqSearch.addEventListener('input', debounce((e) => {
                    this.searchFAQs(e.target.value);
                }, 300));
            }

            // Category filtering
            this.categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.filterFAQs(btn.getAttribute('data-category'));
                    this.setActiveCategory(btn);
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
            question.style.background = 'var(--color-gray-50)';
            
            // Smooth scroll to question
            setTimeout(() => {
                question.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 300);
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

        searchFAQs(searchTerm) {
            const term = searchTerm.toLowerCase().trim();

            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                const isMatch = question.includes(term) || answer.includes(term);
                
                if (isMatch || term === '') {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });

            // Show "no results" message if needed
            this.showNoResultsMessage(term);
        }

        filterFAQs(category) {
            this.faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        }

        setActiveCategory(activeBtn) {
            this.categoryBtns.forEach(btn => {
                btn.classList.remove('faq-category-btn--active');
            });
            activeBtn.classList.add('faq-category-btn--active');
        }

        showNoResultsMessage(searchTerm) {
            if (searchTerm === '') return;
            
            const visibleItems = Array.from(this.faqItems).filter(item => 
                !item.classList.contains('hidden')
            );
            
            let noResultsMsg = document.querySelector('.faq-no-results');
            
            if (visibleItems.length === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'faq-no-results';
                    noResultsMsg.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--color-gray-600);">
                            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <h3>No FAQs found</h3>
                            <p>Try different keywords or browse by category</p>
                        </div>
                    `;
                    document.querySelector('.faq-list').appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
            } else {
                if (noResultsMsg) {
                    noResultsMsg.style.display = 'none';
                }
            }
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

            // Touch support
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
    // MAP INTEGRATION
    // ==========================================================================
    
    class MapIntegration {
        constructor() {
            this.loadMapBtn = document.querySelector(SELECTORS.loadMapBtn);
            this.mapContainer = document.querySelector(SELECTORS.googleMap);
            this.mapPlaceholder = document.querySelector(SELECTORS.mapPlaceholder);
            this.isLoaded = false;
            this.init();
        }

        init() {
            if (!this.loadMapBtn) return;
            this.bindEvents();
        }

        bindEvents() {
            this.loadMapBtn.addEventListener('click', () => {
                this.loadMap();
            });

            // Auto-load map when in viewport
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.isLoaded) {
                            // Auto-load after 2 seconds
                            setTimeout(() => {
                                if (!this.isLoaded) {
                                    this.loadMap();
                                }
                            }, 2000);
                        }
                    });
                }, { threshold: 0.5 });

                if (this.mapPlaceholder) {
                    observer.observe(this.mapPlaceholder);
                }
            }
        }

        loadMap() {
            if (this.isLoaded) return;
            
            this.isLoaded = true;
            this.showLoadingState();

            // Simulate map loading (replace with actual Google Maps integration)
            setTimeout(() => {
                this.showMap();
            }, 1500);
        }

        showLoadingState() {
            if (this.loadMapBtn) {
                this.loadMapBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Map...';
                this.loadMapBtn.disabled = true;
            }
        }

        // showMap() {
        //     if (this.mapPlaceholder) {
        //         this.mapPlaceholder.style.display = 'none';
        //     }
            
        //     if (this.mapContainer) {
        //         this.mapContainer.style.display = 'block';
        //         this.mapContainer.innerHTML = `
        //             <div style="
        //                 width: 100%;
        //                 height: 100%;
        //                 background: linear-gradient(135deg, #1a365d, #4299e1);
        //                 display: flex;
        //                 align-items: center;
        //                 justify-content: center;
        //                 color: white;
        //                 text-align: center;
        //                 padding: 2rem;
        //             ">
        //                 <div>
        //                     <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #f6ad55;"></i>
        //                     <h3>Vakil Properties Office</h3>
        //                     <p>Lakdikapool, Hyderabad</p>
        //                     <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 1rem;">
        //                         Interactive map would be loaded here<br>
        //                         with actual Google Maps integration
        //                     </p>
        //                     <a href="https://maps.google.com/directions" target="_blank" rel="noopener" 
        //                        style="
        //                          display: inline-flex;
        //                          align-items: center;
        //                          gap: 0.5rem;
        //                          margin-top: 1rem;
        //                          padding: 0.5rem 1rem;
        //                          background: rgba(255,255,255,0.2);
        //                          color: white;
        //                          text-decoration: none;
        //                          border-radius: 0.5rem;
        //                          transition: all 0.3s;
        //                        "
        //                        onmouseover="this.style.background='rgba(255,255,255,0.3)'"
        //                        onmouseout="this.style.background='rgba(255,255,255,0.2)'">
        //                         <i class="fas fa-directions"></i>
        //                         Get Directions
        //                     </a>
        //                 </div>
        //             </div>
        //         `;
        //     }
        // }
        showMap() {
    if (this.mapPlaceholder) {
        this.mapPlaceholder.style.display = 'none';
    }
    if (this.mapContainer) {
        this.mapContainer.style.display = 'block';
        // Use your actual office address or coordinates here
        const mapSrc = "https://www.google.com/maps?q=Flat+No.+413+%26+414,+Sovereign+Shelters+Apartments,+Red+hills,+Lakdikapool,+Hyderabad,+Telangana+500004&output=embed";
        this.mapContainer.innerHTML = `
            <iframe
                width="100%"
                height="400"
                frameborder="0"
                style="border:0"
                src="${mapSrc}"
                allowfullscreen
                aria-hidden="false"
                tabindex="0">
            </iframe>
        `;
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
            // Make contact cards keyboard accessible
            const contactCards = document.querySelectorAll('.contact-card');
            contactCards.forEach((card, index) => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                
                const title = card.querySelector('.contact-card__title')?.textContent;
                if (title) {
                    card.setAttribute('aria-label', `Contact via ${title}`);
                }
            });

            // Enhanced form navigation
            const formInputs = document.querySelectorAll('input, textarea, select, button');
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.closest('.form-group')?.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    input.closest('.form-group')?.classList.remove('focused');
                });
            });
        }

        addAriaLabels() {
            // Add labels to progress indicators
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.setAttribute('role', 'progressbar');
                progressFill.setAttribute('aria-valuenow', '0');
                progressFill.setAttribute('aria-valuemin', '0');
                progressFill.setAttribute('aria-valuemax', '100');
            }

            // Add labels to file upload
            const fileUploadArea = document.querySelector('.file-upload-area');
            if (fileUploadArea) {
                fileUploadArea.setAttribute('role', 'button');
                fileUploadArea.setAttribute('aria-label', 'Upload files or drag and drop');
            }

            // Add labels to testimonial navigation
            const testimonialDots = document.querySelectorAll('.testimonial-dot');
            testimonialDots.forEach((dot, index) => {
                dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            });
        }

        manageFocus() {
            // Focus management for form steps
            const formSteps = document.querySelectorAll('.form-step');
            formSteps.forEach(step => {
                const stepObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.attributeName === 'class') {
                            const target = mutation.target;
                            if (target.classList.contains('form-step--active')) {
                                const firstInput = target.querySelector('input, textarea, select');
                                if (firstInput) {
                                    setTimeout(() => firstInput.focus(), 300);
                                }
                            }
                        }
                    });
                });

                stepObserver.observe(step, { attributes: true });
            });
        }

        addScreenReaderSupport() {
            // Create live region for announcements
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'contact-live-region';
            document.body.appendChild(liveRegion);

            // Announce form step changes
            const progressText = document.querySelector('.progress-text');
            if (progressText) {
                const progressObserver = new MutationObserver(() => {
                    const currentProgress = progressText.textContent;
                    liveRegion.textContent = `Form ${currentProgress} complete`;
                });

                progressObserver.observe(progressText, { childList: true, subtree: true });
            }

            // Announce file uploads
            const fileList = document.querySelector('.file-list');
            if (fileList) {
                const fileObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1 && node.classList.contains('file-item')) {
                                    const fileName = node.querySelector('.file-details h5')?.textContent;
                                    if (fileName) {
                                        liveRegion.textContent = `File ${fileName} uploaded successfully`;
                                    }
                                }
                            });
                        }
                    });
                });

                fileObserver.observe(fileList, { childList: true });
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
            this.optimizeAnimations();
            this.lazyLoadImages();
            this.preloadCriticalAssets();
            this.setupIntersectionObservers();
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

            // Optimize for low-end devices
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
            
            if (isSlowConnection || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) {
                document.body.classList.add('reduced-animations');
                
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-animations .morphing-shape,
                    .reduced-animations .particle {
                        display: none !important;
                    }
                    .reduced-animations * {
                        animation-duration: 0.3s !important;
                        transition-duration: 0.3s !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }

        preloadCriticalAssets() {
            // Preload critical animations
            const criticalAnimations = [
                'morphShape', 'particleFloat', 'typewriter', 'blink'
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

        setupIntersectionObservers() {
            // Optimize expensive operations with intersection observers
            const expensiveElements = document.querySelectorAll('.morphing-shape, .particle');
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animationPlayState = 'running';
                        } else {
                            entry.target.style.animationPlayState = 'paused';
                        }
                    });
                }, { threshold: 0.1 });

                expensiveElements.forEach(element => observer.observe(element));
            }
        }
    }

    // ==========================================================================
    // MAIN APP INITIALIZATION
    // ==========================================================================
    
    class ContactApp {
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
                        duration: CONFIG.ANIMATION_DURATION,
                        easing: 'ease-out-cubic',
                        once: true,
                        offset: 50,
                        delay: 100
                    });
                }

                // Initialize all components
                this.components.typewriterEffect = new TypewriterEffect();
                this.components.particleSystem = new ParticleSystem();
                this.components.counterAnimations = new CounterAnimations();
                this.components.contactCardInteractions = new ContactCardInteractions();
                this.components.multiStepForm = new MultiStepForm();
                this.components.faqManager = new FAQManager();
                this.components.testimonialSlider = new TestimonialSlider();
                this.components.mapIntegration = new MapIntegration();
                this.components.accessibilityEnhancer = new AccessibilityEnhancer();
                this.components.performanceOptimizer = new PerformanceOptimizer();

                // Add page-specific enhancements
                this.addPageEnhancements();
                
                console.log('🚀 Contact page initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing contact page:', error);
            }
        }

        addPageEnhancements() {
            // Add smooth reveal animation for page load
            document.body.classList.add('contact-loaded');
            
            // Initialize scroll-based animations
            this.initScrollAnimations();
            
            // Add interaction tracking
            this.trackInteractions();
            
            // Initialize responsive enhancements
            this.setupResponsiveEnhancements();
        }

        initScrollAnimations() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Only observe once
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            const animatedElements = document.querySelectorAll([
                '.contact-card',
                '.location-detail',
                '.amenity-item',
                '.faq-item'
            ].join(','));

            animatedElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease-out';
                observer.observe(element);
            });

            // Add CSS for animate-in class
            const style = document.createElement('style');
            style.textContent = `
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }

        trackInteractions() {
            // Track form interactions for analytics (if needed)
            const form = document.querySelector('#contactForm');
            if (form) {
                form.addEventListener('submit', () => {
                    console.log('📊 Form submitted');
                });
            }

            // Track contact method clicks
            const contactCards = document.querySelectorAll('.contact-card');
            contactCards.forEach(card => {
                card.addEventListener('click', () => {
                    const method = card.querySelector('.contact-card__title')?.textContent;
                    console.log(`📊 Contact method clicked: ${method}`);
                });
            });
        }

        setupResponsiveEnhancements() {
            // Add responsive utilities
            const updateViewportInfo = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };

            updateViewportInfo();
            window.addEventListener('resize', debounce(updateViewportInfo, 100));

            // Handle orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(updateViewportInfo, 100);
            });
        }
    }

    // ==========================================================================
    // INITIALIZE APPLICATION
    // ==========================================================================
    
    // Create global contact app instance
    window.ContactApp = new ContactApp();

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

    // Handle connection changes
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
            console.log('📶 Connection changed:', navigator.connection.effectiveType);
        });
    }

})();