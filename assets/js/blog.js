// blog.js

/**
 * VK Services Website - Blog/Resources Page JavaScript
 * Handles blog filtering, search, and category interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Blog Category Filter
    const categoryTags = document.querySelectorAll('.category-tag');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (categoryTags.length > 0) {
        categoryTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tags
                categoryTags.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tag
                tag.classList.add('active');
                
                // Get the selected category
                const selectedCategory = tag.textContent.trim();
                
                // Filter articles based on category
                if (selectedCategory === 'All') {
                    // Show all articles
                    articleCards.forEach(card => {
                        card.style.display = 'flex';
                        
                        // Add entrance animation
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, 100);
                    });
                } else {
                    // Show only articles matching the selected category
                    articleCards.forEach(card => {
                        const cardCategory = card.querySelector('.article-category').textContent.trim();
                        
                        if (cardCategory === selectedCategory) {
                            card.style.display = 'flex';
                            
                            // Add entrance animation
                            setTimeout(() => {
                                card.classList.add('animated');
                            }, 100);
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('animated');
                        }
                    });
                }
            });
        });
    }
    
    // Blog Search Functionality
    const searchInput = document.querySelector('.blog-search input');
    const searchButton = document.querySelector('.blog-search button');
    
    if (searchInput && searchButton) {
        // Search when button is clicked
        searchButton.addEventListener('click', () => {
            performSearch();
        });
        
        // Search when Enter key is pressed
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                // If search is empty, show all articles
                articleCards.forEach(card => {
                    card.style.display = 'flex';
                });
                return;
            }
            
            // Reset category filter
            const allCategoryTag = document.querySelector('.category-tag.active');
            if (allCategoryTag) {
                allCategoryTag.classList.remove('active');
            }
            categoryTags[0].classList.add('active'); // Set 'All' as active
            
            // Filter articles based on search term
            articleCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.article-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'flex';
                    card.classList.add('search-highlight');
                    
                    // Highlight the matching text (optional)
                    highlightText(card.querySelector('h3'), searchTerm);
                    highlightText(card.querySelector('p'), searchTerm);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('search-highlight');
                }
            });
        }
        
        function highlightText(element, term) {
            const originalText = element.textContent;
            const lowerText = originalText.toLowerCase();
            
            if (lowerText.includes(term)) {
                const startIndex = lowerText.indexOf(term);
                const endIndex = startIndex + term.length;
                
                const beforeTerm = originalText.substring(0, startIndex);
                const matchedTerm = originalText.substring(startIndex, endIndex);
                const afterTerm = originalText.substring(endIndex);
                
                element.innerHTML = `${beforeTerm}<span class="highlight">${matchedTerm}</span>${afterTerm}`;
            }
        }
    }
    
    // Newsletter Form Submission with Animation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple email validation
            if (email === '' || !isValidEmail(email)) {
                // Shake animation for invalid email
                emailInput.classList.add('error');
                
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 1000);
                
                return;
            }
            
            // Replace form with success message
            const newsletterContent = document.querySelector('.newsletter-content');
            const originalContent = newsletterContent.innerHTML;
            
            newsletterContent.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank You for Subscribing!</h3>
                    <p>You've successfully subscribed to our newsletter. You'll now receive updates on the latest property legal & tax insights.</p>
                </div>
            `;
            
            // Send submission data (would typically be AJAX request to server)
            console.log('Newsletter subscription:', email);
        });
        
        // Email validation function
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }
    
    // Article Card Hover Effects
    const allArticleCards = document.querySelectorAll('.article-card, .featured-article');
    
    if (allArticleCards.length > 0) {
        allArticleCards.forEach(card => {
            // Enhanced hover animation
            card.addEventListener('mouseenter', () => {
                const readMoreLink = card.querySelector('.read-more');
                if (readMoreLink) {
                    readMoreLink.classList.add('active');
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const readMoreLink = card.querySelector('.read-more');
                if (readMoreLink) {
                    readMoreLink.classList.remove('active');
                }
            });
        });
    }
    
    // Category Cards Interaction
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('active');
                
                // Animate icon
                const icon = card.querySelector('.category-icon i');
                if (icon) {
                    icon.classList.add('pulse');
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('active');
                
                // Remove icon animation
                const icon = card.querySelector('.category-icon i');
                if (icon) {
                    icon.classList.remove('pulse');
                }
            });
        });
    }
});