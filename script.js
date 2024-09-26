document.addEventListener('DOMContentLoaded', function() {
    const exitLink = document.getElementById('exit-link');
    const homeLink = document.getElementById('home-link');
  
    if (exitLink) {
      exitLink.addEventListener('click', function(event) {
        alert('You are leaving the Homepage.');
      });
    }
  
    if (homeLink) {
      homeLink.addEventListener('click', function(event) {
        alert('You are returning to the Homepage.');
      });
    }
  });  