//////////////////// FIREBASE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

//////////////////// YouTube API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.
// If you run this code from a server other than http://localhost,
// you need to register your own client ID.
var OAUTH2_CLIENT_ID = "group-project-1-180608";
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Authorization was successful. Hide authorization prompts and show
    // content that should be visible after authorization succeeds.
    $('.pre-auth').hide();
    $('.post-auth').show();
    loadAPIClientInterfaces();
  } else {
    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
    // client flow. The current function is called when that flow completes.
    $('#login-link').click(function() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
    });
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
};

//////////////////// VARIABLES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



//an instance of the google provider object
var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();
var user = "";
var userDisplayName = "";
var songSearch = "";

var songInput = "";
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
var toParse = "";
var prsd = "";


//////////////////// FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// signIn() Google Account------------------------------
function signIn() {

  firebase.auth().signInWithPopup(provider).then(function(result) {
  // Creates Google Access Token. Use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  user = result.user;
  userDisplayName = user.displayName;
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
}; 
// /signIn() Google Account------------------------------


// signOut() Google Account------------------------------
function signOut() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
  });  
}; 
// /signOut() Google Account-----------------------------


// onHistorySelect(value) -------------------------------
function onHistorySelect(value) {
  $('#songSearchBox').val(value);
}; 
// /onHistorySelect(value) ------------------------------


// checkInput() -----------------------------------------
function checkInput() {
  if (!songInput.match(/[a-zA-Z]$/) && songInput != ""){
    songInput.value="";
    alert("Please enter only alphabetic characters");
  }; 
}; 
// /checkInput() ----------------------------------------


// queryMusixmatch() ------------------------------------
function queryMusixmatch() {
  // Capture input box -> Song Title
  var songInput = $("#songSearchBox").val().trim().toLowerCase();
  // Query Musixmatch by Song Title & return Artist Names, Release Dates, Song Title
  var queryURL = "https://api.musixmatch.com/ws/1.1/track.search?" +
    "format=jsonp" +
    "&callback=jsonp" +
    "&q_track=" +songInput + 
    "&page_size=20" +
    "&page=1" +
    //"&s_artist_rating=desc" + // <------Commented out rating for now
    "&s_track_release_date=asc" +
    "&apikey=22ae38424752041f521c1ee852af0c25";
        
  if (songInput.length < 1) { 
    $("#songSearchBox").text("Please enter a song title or part of a song title");
  } else {
      checkInput();      
    };     
     
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    toParse = response.substring(6, response.length - 2);
    prsd = JSON.parse(toParse);

    for (var j = 0 ; j < 20 ; j++) {
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

    /*           
    for (var i = 0; i < trackMBIDs.length; i++) {                    
      var queryURL2 = "https://ws.audioscrobbler.com/2.0/" +
                      "?method=album.getinfo&artist_mbid=" +artistMBIDs[i] +
                      "&track_mbid=" +trackMBIDs[i] +
                      "&autocorrect=1" +
                      "&api_key=e47dcd6e943da8b5a8c9f9fee2c19c35&format=json";       
      $.ajax({
        url: queryURL2,
        method: "GET"
      }).done(function(response){
          correctedTrackName.push(response.results.trackmatches.track[i].name);
        });  //end 2nd ajax call
    };  // end for i loop
    */  

  });  // end of ajax call        
};
// /queryMusixmatch() -----------------------------------


// searchYoutube() --------------------------------------

// After the API loads, call a function to enable the search box.

function search() {
  for( var k = 0 ; k < artists.length ; k++) {
    var q = artists[k] + " " + songInput;
    console.log(q);
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet'
    });

    request.execute(function(response) {
      var str = JSON.stringify(response.result);
      //$('#search-container').html('<pre>' + str + '</pre>');
      console.log(str);
    });
  };
};

// /searchYoutube() -------------------------------------


//////////////////// DOC.READY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

$(document).ready(function(){

  // Display Modal on page load -rw
  $("#loginModal").modal({show: true});

  // Add on-click event to Google Login Button
  $("#userLoginButton").on( "click", function(){ signIn(); });

  // Add on-click event for Google Log Out Link 
  $("#googleLogoutLink").on( "click", function(){ 
      signOut();
      console.log( user.displayName + " has signed out!");
      // toggleLogin();
  });      
  
  // Add on-click event to save search to firebase
  $("#songSearchButton").on( "click", function(event) {
    // won't click if nothing in form
    event.preventDefault();

    queryMusixmatch();
    search();

    var firebaseUser = firebase.auth().currentUser;
    var userId = firebaseUser.uid;

    //Update variables with user data
    songSearch = $("#songSearchBox").val().trim();
    console.log("Search this song: " + songSearch); 

    // sends data to the database, sets up JSON
    database.ref().child(userId).push({
      songSearch: songSearch      
    }); 

    console.log("Add this song: " + songSearch); 

    // clears the text box
    $("#songSearchBox").val("");

  }); //closes submit button click

  //see notes for what i tried and failed
  database.ref().on("value", function(childSnapshot) {
    childSnapshot.forEach(function(childSnapshot) {
      var test = childSnapshot.key;
      var test2 = childSnapshot.val();  
      var dropDownMenu = $('#search-dropdown-menu');
      dropDownMenu.empty(); //zero out the list
      console.log(test2);
  
      for(var foo in test2) {
        var value = test2[foo].songSearch;
        //var event = "onClick = onHistorySelect('" + value + "')";
        //console.log(event);
        var html = "<li><a href='#' class='dropDownListItem' data-name='"+ value + "'>" + value + "</a></li>";
        dropDownMenu.append(html);

        $('.dropDownListItem').click(function(e) {
          var name = e.currentTarget;
          console.log(name.getAttribute("data-name"));
          var selected = name.getAttribute("data-name");
          $( '#songSearchBox' ).val(selected);
          $( "#songSearchButton" ).trigger( "click" );
        });
        // console.log("this is snapshot"+ childSnapshot.val());
      };
    });

  }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }); // /close errorObject

}); // /close document.ready

//comment
