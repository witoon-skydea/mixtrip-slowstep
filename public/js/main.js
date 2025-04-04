// Main JS file for MixTrip

document.addEventListener('DOMContentLoaded', function() {
  console.log('MixTrip application loaded');
  
  // Handle alert messages
  const closeButtons = document.querySelectorAll('.alert .close-btn');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const alert = this.parentElement;
      alert.style.opacity = '0';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 300);
    });
  });
  
  // Auto-hide alerts after 5 seconds
  setTimeout(() => {
    document.querySelectorAll('.alert').forEach(alert => {
      alert.style.opacity = '0';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 300);
    });
  }, 5000);
  
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
  
  // Mobile navigation
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
  
  // Handle dropdowns
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentElement.classList.toggle('active');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    dropdownToggles.forEach(toggle => {
      if (!toggle.contains(e.target) && !e.target.classList.contains('dropdown-toggle')) {
        toggle.parentElement.classList.remove('active');
      }
    });
  });
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Initial check for elements in view
  animateOnScroll();
});