// /**
//  * VK Services Website - About Page JavaScript
//  * Handles counters, timeline animations, and partners slider
//  */

// document.addEventListener('DOMContentLoaded', function() {
//     // Animated Counters
//     const counters = document.querySelectorAll('.counter');
    
//     if (counters.length > 0) {
//         const counterObserver = new IntersectionObserver((entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const counter = entry.target;
//                     const target = parseInt(counter.getAttribute('data-target'));
//                     const duration = 2000; // 2 seconds
                    
//                     let count = 0;
//                     const updateCount = () => {
//                         const increment = target / (duration / 16); // Based on 60fps
                        
//                         if (count < target) {
//                             count += increment;
//                             counter.innerText = Math.round(count);
//                             requestAnimationFrame(updateCount);
//                         } else {
//                             counter.innerText = target;
//                         }
//                     };
                    
//                     updateCount();
//                     observer.unobserve(counter);
//                 }
//             });
//         }, { threshold: 0.5 });
        
//         counters.forEach(counter => {
//             counterObserver.observe(counter);
//         });
//     }
    
//     // Team Member Hover Effect Enhancement
//     const teamCards = document.querySelectorAll('.team-card');
    
//     if (teamCards.length > 0) {
//         teamCards.forEach(card => {
//             const teamImage = card.querySelector('.team-image');
//             const teamSocial = card.querySelector('.team-social');
            
//             card.addEventListener('mouseenter', () => {
//                 teamSocial.style.opacity = '1';
//                 teamSocial.style.transform = 'translateY(0)';
//             });
            
//             card.addEventListener('mouseleave', () => {
//                 teamSocial.style.opacity = '0';
//                 teamSocial.style.transform = 'translateY(20px)';
//             });
            
//             // 3D Tilt Effect
//             card.addEventListener('mousemove', (e) => {
//                 const cardRect = card.getBoundingClientRect();
//                 const cardX = cardRect.left + cardRect.width / 2;
//                 const cardY = cardRect.top + cardRect.height / 2;
                
//                 const mouseX = e.clientX - cardX;
//                 const mouseY = e.clientY - cardY;
                
//                 // Limit the rotation for subtle effect
//                 const rotateX = Math.min(Math.max(mouseY * -0.03, -5), 5);
//                 const rotateY = Math.min(Math.max(mouseX * 0.03, -5), 5);
                
//                 card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
//                 card.style.transition = 'transform 0.1s ease';
//             });
            
//             card.addEventListener('mouseleave', () => {
//                 card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
//                 card.style.transition = 'transform 0.5s ease';
//             });
//         });
//     }
    
//     // Partners Slider
//     const partnersSlider = document.querySelector('.partners-slider');
//     const partnerLogos = document.querySelectorAll('.partner-logo');
    
//     if (partnersSlider && partnerLogos.length > 0) {
//         let currentPosition = 0;
//         const logoWidth = partnerLogos[0].offsetWidth;
//         const totalWidth = logoWidth * partnerLogos.length;
//         const visibleWidth = partnersSlider.offsetWidth;
        
//         // Clone logos for infinite scroll effect
//         partnerLogos.forEach(logo => {
//             const clone = logo.cloneNode(true);
//             partnersSlider.appendChild(clone);
//         });
        
//         // Automatic slider movement
//         const moveSlider = () => {
//             currentPosition -= 1; // Slow movement speed
            
//             // Reset position when all original logos are scrolled
//             if (Math.abs(currentPosition) >= totalWidth) {
//                 currentPosition = 0;
//             }
            
//             partnersSlider.style.transform = `translateX(${currentPosition}px)`;
//             requestAnimationFrame(moveSlider);
//         };
        
//         // Start automatic movement
//         moveSlider();
        
//         // Pause on hover
//         partnersSlider.addEventListener('mouseenter', () => {
//             partnersSlider.style.animationPlayState = 'paused';
//         });
        
//         partnersSlider.addEventListener('mouseleave', () => {
//             partnersSlider.style.animationPlayState = 'running';
//         });
//     }
    
//     // Mission Values Animation
//     const valueItems = document.querySelectorAll('.value-item');
    
//     if (valueItems.length > 0) {
//         const valuesObserver = new IntersectionObserver((entries, observer) => {
//             entries.forEach((entry, index) => {
//                 if (entry.isIntersecting) {
//                     setTimeout(() => {
//                         entry.target.classList.add('animated');
//                     }, index * 200); // Staggered animation
                    
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.2 });
        
//         valueItems.forEach(item => {
//             valuesObserver.observe(item);
//         });
//     }
    
//     // Testimonial Card 3D Effect
//     const testimonialCards = document.querySelectorAll('.testimonial-card');
    
//     if (testimonialCards.length > 0) {
//         testimonialCards.forEach(card => {
//             card.addEventListener('mousemove', (e) => {
//                 const rect = card.getBoundingClientRect();
//                 const x = e.clientX - rect.left;
//                 const y = e.clientY - rect.top;
                
//                 const centerX = rect.width / 2;
//                 const centerY = rect.height / 2;
                
//                 const deltaX = (x - centerX) / 25;
//                 const deltaY = (y - centerY) / 25;
                
//                 card.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
//                 card.style.transition = 'transform 0.1s ease';
                
//                 // Dynamic shadow
//                 card.style.boxShadow = `${-deltaX}px ${-deltaY}px 30px rgba(0, 0, 0, 0.1)`;
//             });
            
//             card.addEventListener('mouseleave', () => {
//                 card.style.transform = 'rotateY(0deg) rotateX(0deg)';
//                 card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
//                 card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
//             });
//         });
//     }
// });
// Complete about.js
document.addEventListener('DOMContentLoaded', function() {
    // Partners Carousel Functionality
    const initPartnersCarousel = () => {
      const slider = document.querySelector('.partners-slider');
      const prevButton = document.querySelector('.carousel-arrow.left');
      const nextButton = document.querySelector('.carousel-arrow.right');
      const logos = document.querySelectorAll('.partner-logo');
      let isDragging = false;
      let startPos = 0;
      let currentTranslate = 0;
      let prevTranslate = 0;
      let animationID = 0;
      let currentIndex = 0;
  
      // Touch event handlers
      slider.addEventListener('touchstart', touchStart);
      slider.addEventListener('touchend', touchEnd);
      slider.addEventListener('touchmove', touchMove);
  
      // Mouse event handlers
      slider.addEventListener('mousedown', touchStart);
      slider.addEventListener('mouseup', touchEnd);
      slider.addEventListener('mouseleave', touchEnd);
      slider.addEventListener('mousemove', touchMove);
  
      // Button click handlers
      prevButton.addEventListener('click', () => navigate(-1));
      nextButton.addEventListener('click', () => navigate(1));
  
      // Autoplay
      let autoplay = setInterval(() => navigate(1), 3000);
      slider.addEventListener('mouseenter', () => clearInterval(autoplay));
      slider.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => navigate(1), 3000);
      });
  
      function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
      }
  
      function touchStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        animationID = requestAnimationFrame(animation);
        slider.style.cursor = 'grabbing';
      }
  
      function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -100) navigate(1);
        if (movedBy > 100) navigate(-1);
        
        slider.style.cursor = 'grab';
      }
  
      function touchMove(e) {
        if (isDragging) {
          const currentPosition = getPositionX(e);
          currentTranslate = prevTranslate + currentPosition - startPos;
        }
      }
  
      function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
      }
  
      function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
      }
  
      function navigate(direction) {
        const sliderWidth = slider.offsetWidth;
        const logoWidth = logos[0].offsetWidth + 30; // Include margin
        const maxIndex = Math.floor(slider.scrollWidth / logoWidth) - 1;
  
        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
        currentTranslate = -currentIndex * logoWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
      }
  
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      });
    };
  
    // Initialize all components
    initPartnersCarousel();
    
    // Existing counter functionality
    const initCounters = () => {
      const counters = document.querySelectorAll('.counter');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
  
      counters.forEach(counter => observer.observe(counter));
  
      function animateCounter(element) {
        const target = +element.getAttribute('data-target');
        const duration = 2000;
        const startTime = Date.now();
        
        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          element.textContent = Math.floor(progress * target);
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };
        
        requestAnimationFrame(updateCounter);
      }
    };
  
    // Initialize counters
    initCounters();
  
    // Team card hover effects
    const initTeamCards = () => {
      document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          card.style.transform = `
            perspective(1000px)
            rotateX(${(centerY - y) / 15}deg)
            rotateY(${(x - centerX) / 15}deg)
          `;
        });
  
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
      });
    };
  
    initTeamCards();
  });
  