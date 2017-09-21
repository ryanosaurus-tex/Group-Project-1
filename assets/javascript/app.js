////////////// FIREBASE \\\\\\\\\\\\

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
    $("#userName").text("Log In");

  });

  // Add on-click event to save search to firebase
  $("#songSearchButton").on("click", function() {
    // won't click if nothing in form
    event.preventDefault();

    var firebaseUser = firebase.auth().currentUser;
    var userId = firebaseUser.uid;

    //Update variables with user data
    songSearch = $("#songSearchBox").val().trim();
    console.log("Search this song " + songSearch); 

    // sends data to the database, sets up JSON
    database.ref().child(userId).push({
      songSearch: songSearch      
    }); 

    console.log("Add this song " + songSearch); 

    // clears the text box
    $("#songSearchBox").val("");

  }); //closes submit button click

  function onHistorySelect(value) {
    $('#songSearchBox').val(value);
  };

//see notes for what i tried and failed
database.ref().on("value", function(childSnapshot) {
  childSnapshot.forEach(function(childSnapshot){
  var test = childSnapshot.key;
  var test2 = childSnapshot.val();
  var dropDownMenu = $('#search-dropdown-menu');
  dropDownMenu.empty(); //zero out the list
  
  for(var foo in test2) {
    var value = test2[foo].songSearch;
    //var event = "onClick = onHistorySelect('" + value + "')";
    //console.log(event);
    var html = "<li><a href='#' class='dropDownListItem' data-name='"+ value + "'>" + value + "</a></li>";
    dropDownMenu.append(html);
};

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


// KIM MATHIS-----------------------------------

      // This .on("click") function will validate the input and make the Ajax call
      $("#songSearchButton").on("click", function(event) {        
        event.preventDefault();    
        var songInput = $("#songSearchBox").val().trim().toLowerCase();
               
        if (songInput.length < 1) { 
            $("#songSearchBox").text("Please enter a song title or part of a song title");
           } else {
            checkInput();      
           };

      var albums = [];
      var albumIDs = [];
      var albumMBIDs = [];
      var artists = [];
      var artistMBIDs = [];
      var lyricsIDs = [];
      var relDates = [];
      var trackMBIDs = [];
      var trackName= [];
      var correctedTrackName= [];
    

        // YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE

        // =================================================================
    var toParse = "";
    var prsd = "";     

     var queryURL = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=jsonp&q_track=" +  songInput + "&page_size=20&page=1&s_artist_rating=desc&s_track_release_date=asc&apikey=22ae38424752041f521c1ee852af0c25";

      $.ajax({
              url: queryURL,
              method: "GET"
            }).done(function(response){

           toParse = response.substring(6, response.length - 2);
             prsd = JSON.parse(toParse);
          for (var j = 0; j< 20; j++) {                                 
                 albumIDs.push(prsd.message.body.track_list[j].track.album_id);
               albums.push(prsd.message.body.track_list[j].track.album_name);
               artistMBIDs.push(prsd.message.body.track_list[j].track.artist_mbid);
               trackMBIDs.push(prsd.message.body.track_list[j].track.track_mbid);
               trackName.push(prsd.message.body.track_list[j].track.track_name);
               lyricsIDs.push(prsd.message.body.track_list[j].track.lyrics_id);                                          
               var convDate = prsd.message.body.track_list[j].track.first_release_date;    
               convDate = convDate.slice(0,10);                   
               relDates.push(moment(convDate).format("L"));
               
           };   //  end j for loop           
          });  // end of ajax call
          
  // if we need to get the corrected track title, put the below into the "done" function of the ajax all above;  the ajax call below hasn't been tested but I will test
   // it tomorrow (Wednesday) 
  /*     for (var i = 0; i < trackMBIDs.length; i++) {                    
          var queryURL2 = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist_mbid=" + artistMBIDs[i] + "&track_mbid=" + trackMBIDs[i] +"&autocorrect=1&api_key=e47dcd6e943da8b5a8c9f9fee2c19c35&format=json";       
           $.ajax({
              url: queryURL2,
              method: "GET"
            }).done(function(response){
               correctedTrackName.push(response.results.trackmatches.track[i].name);   
             });  //end 2nd ajax call
       };  // end for i loop  */
       
       
       function checkInput(){
        if (!songInput.match(/[a-zA-Z]$/) && songInput != "") {
          songInput.value="";
          alert("Please enter only alphabetic characters");
        } 
      };     
      
            });  // end on-click    

}); //close document.ready