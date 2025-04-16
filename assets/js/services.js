// Service.js

/**
 * VK Services Website - Services Page JavaScript
 * Handles tabs, FAQs, and other interactions specific to the services page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Service Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Get the tab id
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to current button and pane
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
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
                    document.querySelector('.services-tabs').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }
    
    // Initialize FAQ Accordions
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
    
    // Service Timeline Animation Enhancement
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }
    
    // 3D Tilt Effect for Service Cards
    const serviceDetailItems = document.querySelectorAll('.service-detail-item');
    
    if (serviceDetailItems.length > 0) {
        serviceDetailItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const card = item;
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                // Calculate mouse position relative to card center
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Calculate rotation (limited to a subtle effect)
                const rotateX = mouseY * -0.05;
                const rotateY = mouseX * 0.05;
                
                // Apply transform
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.1), 
                                        ${mouseX * 0.05}px ${mouseY * 0.05}px 20px rgba(0, 0, 0, 0.05)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'rotateX(0) rotateY(0) scale(1)';
                item.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                item.style.transition = 'all 0.5s ease';
            });
        });
    }
});