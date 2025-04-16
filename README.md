 
# VK Services Pvt Ltd Website

A modern, responsive website for VK Services Pvt Ltd, a company providing property legal and tax solutions for NRIs and resident Indians.

## Features

- Responsive design optimized for all screen sizes
- Blue-themed UI with modern aesthetics
- Interactive elements with smooth animations
- Mobile-friendly navigation with hamburger menu
- Optimized for performance and SEO
- Ready for Azure deployment

## Project Structure

```
VK-Services-Website/
├── index.html                  # Main HTML file
├── assets/                     # All static assets
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   ├── js/
│   │   └── main.js             # Main JavaScript file
│   ├── images/                 # Image files
├── pages/                      # Additional pages
└── README.md                   # Project documentation
```

## Technology Stack

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (ES6+)
- Font Awesome (for icons)
- AOS - Animate On Scroll library

## Deployment Instructions for Azure

### Option 1: Azure Static Web Apps

1. Push this code to a GitHub repository
2. Log in to the Azure Portal
3. Create a new "Static Web App" resource
4. Link to your GitHub repository
5. Configure build settings:
   - Build Preset: Custom
   - App location: `/`
   - Output location: `/`
6. Complete the setup and Azure will automatically deploy the site

### Option 2: Azure App Service

1. Compress the entire website folder
2. Log in to the Azure Portal
3. Create a new "App Service" (Windows-based)
4. Choose a pricing tier (B1 or higher recommended)
5. Once created, go to the App Service dashboard
6. Navigate to "Deployment Center"
7. Choose "Manual Deployment" and upload your compressed website
8. The site will be automatically deployed

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimizations

- Optimized images
- Minified CSS and JavaScript
- Efficient CSS selectors
- Responsive images
- Lazy loading for non-critical content
- Efficient animations using AOS library

## Maintenance

To update the website:

1. Edit the HTML, CSS, or JavaScript files as needed
2. Test locally to ensure changes work as expected
3. Re-deploy to Azure using the same method used initially

## Contact

For questions or support, contact VK Services Pvt Ltd at:
- Email: info@vkservices.com
- Phone: [Contact number]