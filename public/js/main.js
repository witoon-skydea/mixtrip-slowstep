// Main JS file for MixTrip

document.addEventListener('DOMContentLoaded', function() {
  console.log('MixTrip application loaded');
  
  // Placeholder for future functionality
  
  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .trip-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animated');
      }
    });
  };
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Initial check for elements in view
  animateOnScroll();
});