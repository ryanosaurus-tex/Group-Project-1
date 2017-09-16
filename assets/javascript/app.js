// FIREBASE LOGIN --------------------------------------------------

// Initialize Firebase
var config = {
   apiKey: "AIzaSyDVPMUfhl1_TeTokggok5Xa0Z2YeakYclg",
   authDomain: "gprojectmusicapp.firebaseapp.com",
   databaseURL: "https://gprojectmusicapp.firebaseio.com",
   projectId: "gprojectmusicapp",
   storageBucket: "gprojectmusicapp.appspot.com",
   messagingSenderId: "756183510423"
 };

firebase.initializeApp(config);

//an instance of the google provider object
var provider = new firebase.auth.GoogleAuthProvider();

//sign in button clicked this happens
function signIn(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
      console.log(user.displayName);

  // Add user.displayName to DOM -rw
  $("#userName").text(user.displayName);     

  //if error then this () will run
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;    
  });
}; //closes signIn()

// Google user sign-out function

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
};

$(document).ready(function(){

  // Display Modal on page load -rw
  $("#loginModal").modal({show: true});

  // Add on-click event to Google Login Button
  $("#userLoginButton").on("click", function(){
    signIn();    
  });

  // Add on-click event for Google Log Out Link 

  $("#googleLogoutLink").on("click", function(){
    GoogleAuth.signOut();
  });

}); //close document.ready