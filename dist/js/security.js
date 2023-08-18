// Firebase authentication state change listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, continue with dashboard logic
      window.location.href = "admin-home";
      console.log("User is signed in:", user.email);
      // Add your dashboard logic here
    } else {
      // User is not signed in, redirect to the sign-in page
      window.location.href = "admin-login";
    }
});
