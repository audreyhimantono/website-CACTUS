document.addEventListener('DOMContentLoaded', function() {
  var menuTrigger = document.querySelector('.menu-trigger');
  var mainNav = document.querySelector('.main-nav');
  
  if (menuTrigger && mainNav) {
    menuTrigger.addEventListener('click', function(event) {
      event.preventDefault(); // Prevents the link from jumping
      mainNav.classList.toggle('active'); // Toggles the active class
    });
  }
});