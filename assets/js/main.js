//  main.js

/**
 * VK Services Website - Main JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Variables
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const backToTop = document.querySelector('.back-to-top');
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookieBtn = document.querySelector('.cookie-btn.primary');
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const contactForm = document.getElementById('contactForm');

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('active');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            document.body.appendChild(overlay);
            
            // Show overlay
            setTimeout(() => {
                overlay.style.display = 'block';
            }, 10);
            
            // Close menu when clicking on overlay
            overlay.addEventListener('click', closeMenuFunc);
        });
    }

    // Close mobile menu
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }

    // Function to close mobile menu
    function closeMenuFunc() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove overlay
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.style.display = 'none';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    // Close menu when a nav link is clicked
    const mobileNavLinks = document.querySelectorAll('.mobile-menu ul li a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip links with href="#" (usually used for JS actions)
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the target's position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const headerOffset = 80; // Height of fixed header
                const finalPosition = targetPosition - headerOffset;
                
                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Testimonial slider
    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Update slide position
                testimonialSlider.style.transform = `translateX(-${index * 100}%)`;
                
                // Update dots
                testimonialDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });

        // Auto slide functionality
        let currentSlide = 0;
        const autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            
            // Update slide position
            testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialDots[currentSlide].classList.add('active');
        }, 5000);

        // Stop auto slide when user interacts with dots
        testimonialDots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(autoSlide);
            });
        });
    }

    // Cookie consent
    if (cookieConsent) {
        // Check if consent was already given
        const cookieConsentGiven = localStorage.getItem('cookieConsent');
        
        if (!cookieConsentGiven) {
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 2000);
        }
        
        // Handle cookie acceptance
        if (acceptCookieBtn) {
            acceptCookieBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                cookieConsent.style.display = 'none';
            });
        }
    }

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Name validation
            if (name.value.trim() === '') {
                showError(name, 'Please enter your name');
                isValid = false;
            } else {
                removeError(name);
            }
            
            // Email validation
            if (email.value.trim() === '') {
                showError(email, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(email);
            }
            
            // Phone validation
            if (phone.value.trim() === '') {
                showError(phone, 'Please enter your phone number');
                isValid = false;
            } else {
                removeError(phone);
            }
            
            // Message validation
            if (message.value.trim() === '') {
                showError(message, 'Please enter your message');
                isValid = false;
            } else {
                removeError(message);
            }
            
            // If form is valid, submit it
            if (isValid) {
                const formData = new FormData(contactForm);
                const formObject = {};
                
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });
                
                // Here you would normally send the data to a server
                // For now, we'll just log it and show a success message
                console.log('Form data:', formObject);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for your message! We will get back to you soon.</p>
                `;
                
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Function to show error message
        function showError(input, message) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
            
            errorMessage.className = 'error-message';
            errorMessage.innerText = message;
            
            if (!formGroup.querySelector('.error-message')) {
                formGroup.appendChild(errorMessage);
            }
            
            formGroup.classList.add('error');
            input.classList.add('error-input');
        }
        
        // Function to remove error message
        function removeError(input) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (errorMessage) {
                formGroup.removeChild(errorMessage);
            }
            
            formGroup.classList.remove('error');
            input.classList.remove('error-input');
        }
        
        // Function to validate email
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }

    // Initialize counters for stats if they exist
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = Math.ceil(target / (duration / 16)); // 60fps
                    
                    let count = 0;
                    const updateCount = () => {
                        count += step;
                        if (count < target) {
                            counter.innerText = count;
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});