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

//my variables
var user;
var songSearch;

//sign in button clicked this happens
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
// won't click if nothing in form
event.preventDefault();

var firebaseUser = firebase.auth().currentUser;
var userId = firebaseUser.uid;

//Update variables with user data
songSearch = $("#songSearchBox").val().trim();
     //console.log("Search this song " + songSearch); 

// sends data to the database, sets up JSON
database.ref().child(userId).push({
 songSearch: songSearch
});
    //console.log("Add this song " + songSearch);   

// clears the text box
$("#songSearchBox").val("");

}); //closes submit button click

function onHistorySelect(value){
  $('#songSearchBox').val(value);
}

//see notes for what i tried and failed
database.ref().on("value", function(childSnapshot) {
  childSnapshot.forEach(function(childSnapshot){
  var test = childSnapshot.key;
  var test2 = childSnapshot.val();
  var dropDownMenu = $('#search-dropdown-menu');
  dropDownMenu.empty(); //zero out the list
  
  for(var foo in test2){
    var value = test2[foo].songSearch;
    //var event = "onClick = onHistorySelect('" + value + "')";
    //console.log(event);
    var html = "<li><a href='#' class='dropDownListItem' data-name='"+ value + "'>" + value + "</a></li>";
    dropDownMenu.append(html);
}
$('.dropDownListItem').click(function(e) {
    var name = e.currentTarget;
    console.log(name.getAttribute("data-name"));
    var selected = name.getAttribute("data-name");
    $( '#songSearchBox' ).val(selected);
    $( "#songSearchButton" ).trigger( "click" );
});
 // console.log("this is snapshot"+ childSnapshot.val());  
  });
  
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
   }); //close errorObject