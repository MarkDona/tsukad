// Set the time (in milliseconds) after which the user will be automatically logged out
var logoutTime = 60 * 2 * 1000; // 30 minutes

// Start the logout timer
var logoutTimer = setTimeout(logout(), logoutTime);

console.log(logoutTime);

// If the user interacts with the page, reset the timer
document.addEventListener("mousemove", function() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(logout(), logoutTime);
});

document.addEventListener("keydown", function() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(logout(), logoutTime);
});

function logout() {
  firebase.auth().signOut()
    .then(() => {
      // User signed out successfully
      window.location.href = "admin-login";
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
}
