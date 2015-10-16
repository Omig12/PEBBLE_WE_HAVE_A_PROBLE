/*
 * This is the source code for "Pebble we have a problem"/What's UP?
 *
 *	TEAM: 
 * 	Israel Dilan Pantojas
 * 	Alejandro Salvador Vega Nogales
 * 	
 * 
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

// All variables \\
var crew;
var num;
var mylat;
var mylon;
var myalt;

// End vars \\



/* Next */

function isLatPos(x) {if (x>0) return x + " N"; else if(x < 0) return Math.abs(x) + " S";} //adds cardinal point to the latitude value and gets its absolute value if necessary 

function isLonPos(y) {if (y>0) return y + " E"; else if(y < 0) return Math.abs(y) + " W";}//adds cardinal point to the longitude value and gets its absolute value if necessary
                      
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
        console.log('Successfully Iss location data!');
        var lat = data.iss_position.latitude;
        var longt = data.iss_position.longitude;

        console.log("lat " + lat + " lon " + longt);
        Pebble.showSimpleNotificationOnPebble("Coords: ", "Latitude: \n" + isLatPos(lat.toFixed(2)) +"\n\nLongitude: \n" + isLonPos(longt.toFixed(2)));
    },

    function (error) {
        //show error card!
        // Failure!
        console.log('Failed fetching ISS location data: ' + error);
    });
}

// return the current crew aboard the ISS
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
        Pebble.showSimpleNotificationOnPebble("Crew: ", crew[i]);
    }
}

// Gets the time of the next ISS pass over the user's location
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
        var d = data.response[0].duration + " s";
        console.log("rt " + rt + " d " + d);
        Pebble.showSimpleNotificationOnPebble("Next Pass: ", "ISS risetime: \n" + rt +"\n\nDuration: \n" + d );
    },
    function (error) {
        //show error card!
        // Failure!
        console.log('Failed fetching Next Pass data: ' + error);
    });
}

//end ISS API functions

// <<<< Begin openweathermap API functions>>>>> 

//provides ambient weather info to the user
function getAmb(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1';
    ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
  // Success!
  console.log('Successfully fetched weather data!');
  // Extract data
  var temperature = Math.round(data.main.temp * 9/5 - 459.67) + ' F';
  var pressure = data.main.pressure + " hPa";
  var humidity = data.main.humidity + "%";     
        Pebble.showSimpleNotificationOnPebble("Ambient: ", "Temperature: \n" + temperature + "\n\nPressure: \n" + pressure + "\n\nHumidity: \n" + humidity);
},
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);
}

//provides weather info about the sky to the user 
function getSky(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1';
    ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
  // Success!
  console.log('Successfully fetched weather data!');

  // Extract data
  var sky = data.clouds.all + "% cloudy";
  var description = data.weather[0].description;
  var windspeed = data.wind.speed + ' m/s';
  
        Pebble.showSimpleNotificationOnPebble("Sky conditions: ", "Description: \n"+description+"\n\nSky: \n"+sky+"\n\nWind speed: \n"+windspeed);
},
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);
}


//provides info about the user's current location
function getGeo(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1';
    ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
  // Success!
  console.log('Successfully fetched weather data!');

  // Extract data
  var city = data.name;
  var country = data.sys.country;
        function timeConverter(UNIX_timestamp){
             var a = new Date(UNIX_timestamp*1000);
             var time = a.toLocaleTimeString();
             return time;
         }  
  var sunrise = timeConverter(data.sys.sunrise);
  var sunset = timeConverter(data.sys.sunset);
        Pebble.showSimpleNotificationOnPebble("Geolocation: ", "City: \n" + city + "\n\nCountry: \n" + country + "\n\nSunrise time: \n"+sunrise+ "\n\nSunset time: \n"+sunset);
},
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);
}

//end openweathermap API functions

// <<<<<Begin Predict the Sky NASA API functions (still a WPI from NASA so we hope to implement as soon as they are finished) >>>>>


function Predict ()
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

//end Predict the Sky NASA API functions


// <<<<Begin Mozilla Geolocater API functions>>>>

// GET geographic coordinates
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
    
//end Mozilla Geolocater API functions


/*

I assume this is testing code you were using for the hackathon Dilan. eliminate it?


// Local storage

var key = 5;
var value = 'Some string';

// Persist write a key with associated value
localStorage.setItem(key, value);

// Persist read a key's value. May be null!
var value = localStorage.getItem(key);

console.log('Pebble Account Token: ' + Pebble.getAccountToken());

console.log('Pebble Watch Token: ' + Pebble.getWatchToken());

// END APIS \\

*/

//<<< UI functions: >>>>



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
var pmi = [{title:'Satellites'}, {title:'Meteors'}, {title:'Comets'}, {title:'Planets'}]; // Predict Menu Items
var predict = new UI.Menu({
	sections: [{
		title: 'Predict the sky:', 
		items: pmi
	}] 
});





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
	weather.show();  
  } else if (num === 'Predict the sky') {
	predict.show();
  } else if (num === 'My location') {
      Pebble.showSimpleNotificationOnPebble('My coords: ', 'Latitude: \n' + isLatPos(mylat) + '\n\nLongitude: \n' + isLonPos(mylon) + '\n\nAltitude: \n' + myalt + " m");
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
      } 
    });

// When wheater is selected from menu
weather.on('select', function(event) {
 var num = wmi[event.itemIndex].title;
	console.log("title " + num);
    
    if (num === 'Ambient') {
        getAmb();
      } else if (num === 'Sky') {
        getSky();
      } else if (num === 'Geographical') {
        getGeo();
      } 
    });

