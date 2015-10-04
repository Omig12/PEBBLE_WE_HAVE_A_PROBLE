/**
 * This is the source code for "Pebble we have a problem"
 * which intends to call some of NASA and ISS API's
 *
 *	TEAM: 
 * 
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

// All variables \\
var issLoc;
var crew;
var num;
var mylat;
var mylon;
var myalt;

// End vars \\



/* Next */

// API functions \\
// Getting ISS Location
function getISSLocation ()
{
    var URL = 'http://api.open-notify.org/iss-now.json';

    // Make the request
    ajax({
        url: URL,
        type: 'json'
    },

         
    function (data) {
        // Success!
        console.log('Successfully fetched weather data!');
        var lat = data.iss_position.latitude;
        var longt = data.iss_position.longitude;

        console.log("lat " + lat + " lon " + longt);
        Pebble.showSimpleNotificationOnPebble("Coords: ", "Latitude: " + lat.toFixed(2) +"\n"+ "Longitude: " + longt.toFixed(2));
    },

    function (error) {
        //show error card!
        // Failure!
        console.log('Failed fetching weather data: ' + error);
    });
}

// Function to return 
function getISSCrew (){
    var URL = 'http://api.open-notify.org/astros.json';

    // Make the request
    ajax({
        url: URL,
        type: 'json'
    },

    function (data) {
        // Success!
        //connected to ISS API
        crew = [];
        num = data.number;
        for (var i =0; i < data.number; i++)
        {
            console.log("crew member " +  i + 1 + ": " + data.people[i].name);
            crew[i] = data.people[i].name;
        }
    },

    function (error) {
        //show error card!
        // Failure!
        console.log('Failed to connect to ISS API: ' + error);
    });
    for(var i = 0; i < num; i++) {
        Pebble.showSimpleNotificationOnPebble("crew: ", crew[i]);
    }
}

// Getting ISS Location
function getNextPass ()
{
    var URL = 'http://api.open-notify.org/iss-pass.json?lat='+ mylat + '&lon=' + mylon + '&alt=' + myalt + '&n=1';
    // Make the request
    ajax({
        url: URL,
        type: 'json'
    },
    function (data) {
        // Success!
        console.log('Successfully fetched next pass data!');
        function timeConverter(UNIX_timestamp){
             var a = new Date(UNIX_timestamp*1000);
             var time = a.toLocaleString();
             return time;
         }  
        var rt = timeConverter(data.response[0].risetime);
        var d = data.response[0].duration;
        console.log("rt " + rt + " d " + d);
        Pebble.showSimpleNotificationOnPebble("Next Pass: ", "Risetime: \n" + rt +"\n\n"+ "Duration: \n" + d );
    },
    function (error) {
        //show error card!
        // Failure!
        console.log('Failed fetching Next Pass data: ' + error);
    });
}

/* Wheather */

//ajax

function getWeather(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1';
    ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
  // Success!
  console.log('Successfully fetched weather data!');

  // Extract data
  var location = data.name;
  var temperature = Math.round(data.main.temp - 273.15) + 'C';

  // Always upper-case first letter of description
  var description = data.weather[0].description;
  description = description.charAt(0).toUpperCase() + description.substring(1);
},
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);
}


// 
/* JSON
function weather(){
  var req = new XMLHttpRequest();
    req.open('GET', 'http://api.openweathermap.org/data/2.1/find/city?lat='+mylat+'&lon='+ mylon+ '&cnt=1', true);
    req.onload = function(e) {
      if (req.readyState == 4 && req.status == 200) {
        if(req.status == 200) {
          var response = JSON.parse(req.responseText);
          var temperature = response.list[0].main.temp;
          var icon = response.list[0].main.icon;
          Pebble.sendAppMessage({ 'icon':icon, 'temperature':temperature + '\u00B0C'});
        } else { console.log('Error'); }
      }
    };
    req.send(null);
}
*/





/* Predict SKY*/


function skyes ()
{
    var URL = 'http://api.predictthesky.org';

    // Make the request
    ajax({
        url: URL,
        type: 'application/json'
    },

         
    function (data) {
        // Success!
        console.log('Successfully fetched fireball data!');
        function timeConverter(UNIX_timestamp){
             var a = new Date(UNIX_timestamp*1000);
             var time = a.toLocaleString();
             return time;
         }
        
        var rt = timeConverter(data.response[0].risetime);
        var d = data.response[0].duration;

        console.log("rt " + rt + " d " + d);
        Pebble.showSimpleNotificationOnPebble("Next Pass: ", "Risetime: \n" + rt +"\n\n"+ "Duration: \n" + d );
    },

    function (error) {
        //show error card!
        // Failure!
        console.log('Failed fetching fireball data: ' + error);
    });
}




/* GEOLOCATION */

// GET Position
var locationSuccess = function (pos) {
var coordinates = pos.coords;
    console.log('MY location= lat:' + coordinates.latitude + ', long: ' + coordinates.longitude + ', alt: ' + coordinates.altitude);
    mylat = coordinates.latitude.toFixed(2);
    mylon = coordinates.longitude.toFixed(2);
    myalt = coordinates.altitude.toFixed(2);
// TODO
};

var locationError = function (err) {
console.warn('location error (' + err.code + '): ' + err.message);
};

if (navigator && navigator.geolocation) {
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
} else {
console.log('No geolocation');
}
    
// Google maps???
/*
function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
    
  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    // var img = new Image();
    // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    // output.appendChild(img);
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  navigator.geolocation.getCurrentPosition(success, error);
}
*/






var key = 5;
var value = 'Some string';

// Persist write a key with associated value
localStorage.setItem(key, value);

// Persist read a key's value. May be null!
var value = localStorage.getItem(key);

console.log('Pebble Account Token: ' + Pebble.getAccountToken());

console.log('Pebble Watch Token: ' + Pebble.getWatchToken());

// END APIS \\



















// Main UI card
var main = new UI.Card({
  title: "What's up?",
  icon: 'images/logo.png',
  subtitle: 'Take a look!',
  body: 'Press any button.'
});

// Weird Photo thing
var banner = new UI.Window({ fullscreen: true });
var img = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/promo.png'
});
banner.add(img);

// Main menu
var sel = [{title: 'ISS'}, {title: 'Weather'}, {title: 'Predict the sky'}, {title: 'My location'}];
var whatsup = new UI.Menu({
	sections: [{ 
		title: 'What to see?',
		items: sel
	}]
});

// ISS sub-menu
var imi = [{title:"Who's up there?"}, {title:'Where is it?'}, {title:'Next pass'}]; // ISS Menu Items
var iss = new UI.Menu ({
	sections: [{
		title: 'ISS:', 
		items: imi
	}] 
});

// Weather sub-menu
var wmi= [{title:'Ambient'}, {title:'Sky'}, {title:'Geographical'}]; // Wheather Menu Items
var weather = new UI.Menu ({
	sections: [{
		title: 'Wheather:',
		items: wmi
	}] 
});

// Predict sub-menu
var pmi = [{title:'ISS'}, {title:'Meteors'}, {title:'Predict the sky'}]; // Predict Menu Items
var predict = new UI.Menu({
	sections: [{
		title: 'Predict the sky:', 
		items: pmi
	}] 
});


// Crew Card
/*
// Crew Window
var crew = UI.Window({fullscreen: true});
var CrewText = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    title: for (int i =0; i < data.number) data.people[i].name
});
window.add(CrewText);
*/

// MyLoc Card
/*
var myloc = new UI.Card({ 
    
});
*/










// Function Implementations

// Display main
main.show();

// Main listeners
main.on('click', 'up', function(e) {
  banner.show();
});

main.on('click', 'select', function(e) {
  whatsup.show();
});

main.on('click', 'down', function(e) {
  whatsup.show();
});


// Main menu selection
whatsup.on('select', function(event) {
 var num = sel[event.itemIndex].title;
	console.log("title " + num);
	
if (num === 'ISS') {
    iss.show();
  } else if (num === 'Weather') {
	getWeather();  
  } else if (num === 'Predict the sky') {
	predict.show();
  } else if (num === 'My location') {
      Pebble.showSimpleNotificationOnPebble('My coords: ', 'Latitude: \n' + mylat + '\nLongitude: \n' + mylon + '\nAltitude: \n' + myalt);
  }	
 
});

// When ISS is selected from menu
iss.on('select', function(event) {
 var num = imi[event.itemIndex].title;
	console.log("title " + num);
    
    if (num === "Who's up there?") {
        getISSCrew();
      } else if (num === "Where is it?") {
        getISSLocation();
      } else if (num === 'Next pass') {
        getNextPass();
           console.log('clock', getTime());
          // if (getNextPass() === time)
      } 
    });
