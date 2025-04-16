/**
 * VK Services Website - Contact Page JavaScript
 * Handles contact form validation, submission, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
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
                console.log('Contact form data:', formObject);
                
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
    
    // Appointment Booking Form Handling
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
                
                // Clear existing options except first one
                while (timeSelect.options.length > 1) {
                    timeSelect.remove(1);
                }
                
                while (altTimeSelect.options.length > 1) {
                    altTimeSelect.remove(1);
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
                    option1.text = time.includes(':') ? 
                        `${time.split(':')[0]}:${time.split(':')[1]} ${parseInt(time) < 12 ? 'AM' : 'PM'}` : 
                        `${time} ${parseInt(time) < 12 ? 'AM' : 'PM'}`;
                    
                    const option2 = document.createElement('option');
                    option2.value = time;
                    option2.text = time.includes(':') ? 
                        `${time.split(':')[0]}:${time.split(':')[1]} ${parseInt(time) < 12 ? 'AM' : 'PM'}` : 
                        `${time} ${parseInt(time) < 12 ? 'AM' : 'PM'}`;
                    
                    timeSelect.add(option1);
                    altTimeSelect.add(option2);
                });
            });
        }
        
        // Handle consultation type change
        const consultationType = document.getElementById('consultationType');
        if (consultationType) {
            consultationType.addEventListener('change', function() {
                const selectedType = this.value;
                const notesField = document.getElementById('consultationNotes');
                
                if (selectedType === 'video-call') {
                    notesField.placeholder = 'Please mention your preferred video conferencing platform (Zoom, Google Meet, Microsoft Teams)';
                } else if (selectedType === 'phone-call') {
                    notesField.placeholder = 'Please provide the best time to reach you and any specific requirements';
                } else {
                    notesField.placeholder = 'Please provide any specific details about your query or requirements';
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
                // For now, we'll just show a success message
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
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle i');
            
            // Set initial height to 0
            answer.style.maxHeight = '0px';
            
            question.addEventListener('click', () => {
                // Toggle active class
                item.classList.toggle('active');
                
                // Toggle icon
                if (toggle.classList.contains('fa-plus')) {
                    toggle.classList.remove('fa-plus');
                    toggle.classList.add('fa-minus');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    toggle.classList.remove('fa-minus');
                    toggle.classList.add('fa-plus');
                    answer.style.maxHeight = '0px';
                }
            });
        });
        
        // Open the first FAQ by default
        if (faqItems[0]) {
            faqItems[0].querySelector('.faq-question').click();
        }
    }
    
    // Info Card Hover Effects
    const infoCards = document.querySelectorAll('.info-card');
    
    if (infoCards.length > 0) {
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.info-icon i');
                icon.classList.add('pulse');
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.info-icon i');
                icon.classList.remove('pulse');
            });
        });
    }
    
    // Location Card Hover Effects
    const locationCards = document.querySelectorAll('.location-card');
    
    if (locationCards.length > 0) {
        locationCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('active');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll to form when "Book Now" is clicked
    const bookNowLinks = document.querySelectorAll('a[href="#appointment-form"]');
    
    if (bookNowLinks.length > 0) {
        bookNowLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus on first input after scrolling
                    setTimeout(() => {
                        const firstInput = targetElement.querySelector('input');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 800);
                }
            });
        });
    }
    
    // Helper Functions
    
    // Form validation
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Remove existing error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Check required fields
        requiredFields.forEach(field => {
            if (field.value.trim() === '') {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid phone number');
            } else if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                showError(field, 'You must agree to continue');
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
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Format time for display
    function formatTime(timeString) {
        if (!timeString) return 'N/A';
        
        const hour = parseInt(timeString.split(':')[0]);
        const minute = timeString.split(':')[1] || '00';
        
        return `${hour}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
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
                return type;
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
                return type;
        }
    }
});