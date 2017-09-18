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
var database = firebase.database();

//variables
var user;
var songSearch;

//sign in button 
function signIn(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
// This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
// The signed-in user info.
  user = result.user;
      //console.log("Name is " + user.displayName); 

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
}; //closes (signOut)

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
    $("#userName").text("Log In");

  });
}); //close document.ready

// Capture submit button click
$("#songSearchButton").on("click", function() {
  event.preventDefault();

  var firebaseUser = firebase.auth().currentUser;
  var user_id = firebaseUser.uid;

//Update variables with user data
songSearch = $("#songSearchBox").val().trim();
     //console.log("Search this song " + songSearch); 

//sends data to firebase
      database.ref().child("Users").child(user_id).child("song_searched").push({ 
//setting up the JSON for database
       text: songSearch  
  });
    //console.log("Add this song " + songSearch);  

//clears the search text box
  $("#songSearchBox").val("");

}); //closes submit button click

 database.ref().on("value", function(snapshot) {
      //console.log(snapshot.val()); 
     }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }); //close errorObject

//still need to write code for the appending to search history, kk