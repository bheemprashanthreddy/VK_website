/**
 * VK Services Website - Unified JavaScript
 * Combines functionality from all page scripts for consistent behavior
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- GLOBAL ELEMENTS ---
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const backToTop = document.querySelector('.back-to-top');
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookieBtn = document.querySelector('.cookie-btn.primary');
    
    // --- HEADER SCROLL EFFECT ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('active');
        }
    });
    
    // --- MOBILE MENU TOGGLE ---
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
    
    // --- CLOSE MOBILE MENU ---
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }
    
    // Function to close mobile menu
    function closeMenuFunc() {
        if (mobileMenu) {
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
    }
    
    // Close menu when a nav link is clicked
    const mobileNavLinks = document.querySelectorAll('.mobile-menu ul li a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });
    
    // --- SMOOTH SCROLLING ---
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
    
    // --- BACK TO TOP BUTTON ---
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // --- COOKIE CONSENT ---
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
    
    // --- INITIALIZE AOS (ANIMATE ON SCROLL) ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // --- TESTIMONIALS SLIDER ---
    initTestimonialSlider();
    
    // --- FORM HANDLING ---
    initContactForm();
    initAppointmentForm();
    
    // --- COUNTERS ---
    initCounters();
    
    // --- SERVICE TABS ---
    initServiceTabs();
    
    // --- FAQ ACCORDIONS ---
    initFaqAccordions();
    
    // --- TEAM CARDS ---
    initTeamCards();
    
    // --- PARTNERS CAROUSEL ---
    initPartnersCarousel();
    
    // =================================
    // COMPONENT INITIALIZERS
    // =================================
    
    // --- TESTIMONIAL SLIDER ---
    function initTestimonialSlider() {
        const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        
        if (testimonialDots.length > 0 && testimonialSlider && testimonialSlides.length > 0) {
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
    }
    
    // --- CONTACT FORM HANDLING ---
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form
                if (validateForm(contactForm)) {
                    // Get form data
                    const formData = new FormData(contactForm);
                    const formObject = {};
                    
                    formData.forEach((value, key) => {
                        formObject[key] = value;
                    });
                    
                    // Here you would normally send the data to a server
                    // For now, we'll just show a success message
                    console.log('Form data:', formObject);
                    
                    // Show success message
                    const formContainer = contactForm.parentElement;
                    const originalContent = formContainer.innerHTML;
                    
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Thank You for Contacting Us!</h3>
                            <p>Your message has been sent successfully. One of our representatives will get back to you within 24 hours.</p>
                            <p>Reference Number: <strong>INQ-${generateReferenceNumber()}</strong></p>
                        </div>
                    `;
                    
                    // Scroll to success message
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
    
    // --- APPOINTMENT FORM HANDLING ---
    function initAppointmentForm() {
        const appointmentForm = document.getElementById('appointmentForm');
        
        if (appointmentForm) {
            // Set minimum date to today
            const dateInput = document.getElementById('preferredDate');
            if (dateInput) {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                dateInput.setAttribute('min', formattedDate);
            }
            
            // Dynamic time slots based on date selection
            if (dateInput) {
                dateInput.addEventListener('change', function() {
                    const selectedDate = new Date(this.value);
                    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
                    
                    const timeSelect = document.getElementById('preferredTime');
                    const altTimeSelect = document.getElementById('alternateTime');
                    
                    if (timeSelect) {
                        // Clear existing options except first one
                        while (timeSelect.options.length > 1) {
                            timeSelect.remove(1);
                        }
                        
                        if (altTimeSelect) {
                            while (altTimeSelect.options.length > 1) {
                                altTimeSelect.remove(1);
                            }
                        }
                        
                        // Generate time slots based on day of week
                        let timeSlots = [];
                        
                        if (dayOfWeek === 0) { // Sunday
                            // No available slots on Sunday
                            timeSlots = [];
                            
                            // Add a message option
                            const option = document.createElement('option');
                            option.value = '';
                            option.text = 'Closed on Sundays';
                            timeSelect.add(option);
                        } else if (dayOfWeek === 6) { // Saturday
                            // Limited slots on Saturday
                            timeSlots = ['9:00', '10:00', '11:00', '12:00'];
                        } else { // Weekdays
                            timeSlots = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
                        }
                        
                        // Add time slots to selects
                        timeSlots.forEach(time => {
                            const option1 = document.createElement('option');
                            option1.value = time;
                            option1.text = formatTimeSlot(time);
                            timeSelect.add(option1);
                            
                            if (altTimeSelect) {
                                const option2 = document.createElement('option');
                                option2.value = time;
                                option2.text = formatTimeSlot(time);
                                altTimeSelect.add(option2);
                            }
                        });
                    }
                });
            }
            
            // Handle consultation type change
            const consultationType = document.getElementById('consultationType');
            if (consultationType) {
                consultationType.addEventListener('change', function() {
                    const selectedType = this.value;
                    const notesField = document.getElementById('consultationNotes');
                    
                    if (notesField) {
                        if (selectedType === 'video-call') {
                            notesField.placeholder = 'Please mention your preferred video conferencing platform (Zoom, Google Meet, Microsoft Teams)';
                        } else if (selectedType === 'phone-call') {
                            notesField.placeholder = 'Please provide the best time to reach you and any specific requirements';
                        } else {
                            notesField.placeholder = 'Please provide any specific details about your query or requirements';
                        }
                    }
                });
            }
            
            // Form submission
            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form
                if (validateForm(appointmentForm)) {
                    // Get form data
                    const formData = new FormData(appointmentForm);
                    const formObject = {};
                    
                    formData.forEach((value, key) => {
                        formObject[key] = value;
                    });
                    
                    // Here you would normally send the data to a server
                    console.log('Appointment form data:', formObject);
                    
                    // Show success message
                    const formContainer = appointmentForm.parentElement;
                    const originalContent = formContainer.innerHTML;
                    
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Consultation Scheduled!</h3>
                            <p>Your consultation request has been received successfully. We will confirm your appointment shortly via email and phone.</p>
                            <p>Reference Number: <strong>APT-${generateReferenceNumber()}</strong></p>
                            <div class="appointment-details">
                                <h4>Appointment Details</h4>
                                <ul>
                                    <li><strong>Date:</strong> ${formatDate(formObject.preferredDate)}</li>
                                    <li><strong>Time:</strong> ${formatTime(formObject.preferredTime)}</li>
                                    <li><strong>Type:</strong> ${formatConsultationType(formObject.consultationType)}</li>
                                    <li><strong>Service:</strong> ${formatServiceType(formObject.serviceType)}</li>
                                </ul>
                            </div>
                            <p class="note">You will receive a confirmation email with these details and any preparation instructions.</p>
                        </div>
                    `;
                    
                    // Scroll to success message
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
    
    // --- COUNTER ANIMATION ---
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000; // 2 seconds
                        
                        let count = 0;
                        const updateCount = () => {
                            const increment = target / (duration / 16); // Based on 60fps
                            
                            if (count < target) {
                                count += increment;
                                counter.innerText = Math.round(count);
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
    }
    
    // --- SERVICES TABS ---
    function initServiceTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        if (tabButtons.length > 0 && tabPanes.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Get the tab id
                    const tabId = button.getAttribute('data-tab');
                    
                    // Remove active class from all buttons and panes
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    
                    // Add active class to current button and pane
                    button.classList.add('active');
                    const targetPane = document.getElementById(tabId);
                    if (targetPane) {
                        targetPane.classList.add('active');
                    }
                });
            });
            
            // Check if URL has hash for direct tab access
            if (window.location.hash) {
                const hash = window.location.hash.substring(1); // Remove the '#' character
                const targetButton = document.querySelector(`.tab-button[data-tab="${hash}"]`);
                if (targetButton) {
                    targetButton.click();
                    
                    // Scroll to the tabs section with a slight delay
                    setTimeout(() => {
                        const tabsSection = document.querySelector('.services-tabs');
                        if (tabsSection) {
                            tabsSection.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 100);
                }
            } else if (tabButtons.length > 0) {
                // Activate first tab by default
                tabButtons[0].click();
            }
        }
    }
    
    // --- FAQ ACCORDIONS ---
    function initFaqAccordions() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length > 0) {
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const toggle = item.querySelector('.faq-toggle i');
                
                if (question && answer) {
                    question.addEventListener('click', () => {
                        // Toggle active class
                        item.classList.toggle('active');
                        
                        // Toggle icon if it exists
                        if (toggle) {
                            if (toggle.classList.contains('fa-plus')) {
                                toggle.classList.remove('fa-plus');
                                toggle.classList.add('fa-minus');
                            } else {
                                toggle.classList.remove('fa-minus');
                                toggle.classList.add('fa-plus');
                            }
                        }
                    });
                }
            });
            
            // Open first FAQ by default if none are open
            const anyActive = Array.from(faqItems).some(item => item.classList.contains('active'));
            if (!anyActive && faqItems.length > 0) {
                faqItems[0].classList.add('active');
                const toggle = faqItems[0].querySelector('.faq-toggle i');
                if (toggle && toggle.classList.contains('fa-plus')) {
                    toggle.classList.remove('fa-plus');
                    toggle.classList.add('fa-minus');
                }
            }
        }
    }
    
    // --- TEAM CARDS HOVER EFFECTS ---
    function initTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        
        if (teamCards.length > 0) {
            teamCards.forEach(card => {
                // Enhanced 3D tilt effect for desktop
                if (window.matchMedia('(min-width: 992px)').matches) {
                    card.addEventListener('mousemove', (e) => {
                        const cardRect = card.getBoundingClientRect();
                        const cardCenterX = cardRect.left + cardRect.width / 2;
                        const cardCenterY = cardRect.top + cardRect.height / 2;
                        
                        // Calculate mouse position relative to card center
                        const mouseX = e.clientX - cardCenterX;
                        const mouseY = e.clientY - cardCenterY;
                        
                        // Calculate rotation (limited to a subtle effect)
                        const rotateX = Math.min(Math.max(mouseY * -0.03, -5), 5);
                        const rotateY = Math.min(Math.max(mouseX * 0.03, -5), 5);
                        
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                        card.style.transition = 'transform 0.1s ease';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = '';
                        card.style.transition = 'transform 0.5s ease';
                    });
                }
            });
        }
    }
    
    // --- PARTNERS CAROUSEL ---
    function initPartnersCarousel() {
        const slider = document.querySelector('.partners-slider');
        const prevButton = document.querySelector('.carousel-arrow.left');
        const nextButton = document.querySelector('.carousel-arrow.right');
        
        if (slider && (prevButton || nextButton)) {
            let scrollAmount = 0;
            const slideWidth = 180; // Adjust based on partner logo width + margin
            
            // Next button click
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    scrollAmount += slideWidth;
                    if (scrollAmount > slider.scrollWidth - slider.offsetWidth) {
                        scrollAmount = 0;
                    }
                    slider.style.transform = `translateX(-${scrollAmount}px)`;
                });
            }
            
            // Previous button click
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    scrollAmount -= slideWidth;
                    if (scrollAmount < 0) {
                        scrollAmount = 0;
                    }
                    slider.style.transform = `translateX(-${scrollAmount}px)`;
                });
            }
            
            // Automatic scrolling
            let autoScroll;
            const startAutoScroll = () => {
                autoScroll = setInterval(() => {
                    scrollAmount += 1;
                    if (scrollAmount > slider.scrollWidth - slider.offsetWidth) {
                        scrollAmount = 0;
                    }
                    slider.style.transform = `translateX(-${scrollAmount}px)`;
                }, 30);
            };
            
            // Pause on hover
            slider.addEventListener('mouseenter', () => {
                clearInterval(autoScroll);
            });
            
            slider.addEventListener('mouseleave', () => {
                startAutoScroll();
            });
            
            startAutoScroll();
        }
    }
    
    // =================================
    // UTILITY FUNCTIONS
    // =================================
    
    // Form validation
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Remove existing error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        const errorInputs = form.querySelectorAll('.error-input');
        errorInputs.forEach(input => input.classList.remove('error-input'));
        
        // Check required fields
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                showError(field, 'This checkbox is required');
            } else if (field.value.trim() === '') {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid phone number');
            }
        });
        
        return isValid;
    }
    
    // Show error message
    function showError(field, message) {
        const parent = field.parentElement;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        parent.appendChild(errorMessage);
        field.classList.add('error-input');
        
        // Remove error on field focus
        field.addEventListener('focus', function() {
            this.classList.remove('error-input');
            const error = parent.querySelector('.error-message');
            if (error) {
                error.remove();
            }
        });
    }
    
    // Validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Validate phone number
    function isValidPhone(phone) {
        // Basic validation - can be made more specific for your requirements
        return phone.length >= 10;
    }
    
    // Generate unique reference number
    function generateReferenceNumber() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}-${random}`;
    }
    
    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Format time for display
    function formatTime(timeString) {
        if (!timeString) return 'N/A';
        
        const hour = parseInt(timeString.split(':')[0]);
        const minute = timeString.split(':')[1] || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        
        return `${hour12}:${minute} ${ampm}`;
    }
    
    // Format time slot for display
    function formatTimeSlot(timeString) {
        if (!timeString) return '';
        
        const hour = parseInt(timeString.split(':')[0]);
        const minute = timeString.split(':')[1] || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        
        return `${hour12}:${minute} ${ampm}`;
    }
    
    // Format consultation type for display
    function formatConsultationType(type) {
        switch(type) {
            case 'in-person':
                return 'In-Person Meeting';
            case 'video-call':
                return 'Video Call';
            case 'phone-call':
                return 'Phone Call';
            default:
                return type || 'N/A';
        }
    }
    
    // Format service type for display
    function formatServiceType(type) {
        switch(type) {
            case 'property-legal':
                return 'Property Legal Services';
            case 'tax-compliance':
                return 'Tax & Compliance Services';
            case 'property-management':
                return 'Property Management';
            case 'nri-documentation':
                return 'NRI Documentation';
            case 'not-sure':
                return 'General Inquiry';
            default:
                return type || 'N/A';
        }
    }
});