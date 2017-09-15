//an instance of the google provider object
var provider = new firebase.auth.GoogleAuthProvider();

//hides the container-fluid page and shows login when page loads
$(document).ready(function(){
  $(".container-fluid").hide;
  $(".xxxxxxxxxx").show;
});

//sign in button clicked this happens
function signIn(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
      console.log(user.displayName);

//either showMainPage(); or just add .hide or nothing      

//if error then this () will run
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

}; //closes signIn()

//closes signin page and opens main page
function showMainPage(){
//need div id
  $("#xxxxx").hide();
  $(".container-fluid").show();
};




