/**
 * This is the source code for "Pebble we have a problem"
 * which intends to call some of NASA and ISS API's
 *
 *	TEAM: 
 *     Los ñames
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
var type = 'png';
var Mapa = 'https://maps.googleapis.com/maps/api/staticmap?maptype='+type+'&center='+mylat+','+mylon+'&zoom=5&style=element:labels|visibility:on&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&size=144x168';
// End vars \\


/* Next */
function isLatPos(x) {if (x>0) return x + " N"; else if(x < 0) return Math.abs(x) + " S";}
function isLonPos(y) {if (y>0) return y + " E"; else if(y < 0) return Math.abs(y) + " W";}


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
        Pebble.showSimpleNotificationOnPebble("Crew: ", crew[i]);
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



/* Wheather */

var OWAPIKEY = "&APPID=";
function getAmb(){
    var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1&units=imperial'+OWAPIKEY;
    ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
  // Success!
  console.log('Successfully fetched weather data!');
  console.log('http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1&units=imperial'+OWAPIKEY);
  // Extract data
  var temperature = Math.round(data.main.temp) + ' F';
  var pressure = data.main.pressure + " hPa";
  var humidity = data.main.humidity + "%";     
        Pebble.showSimpleNotificationOnPebble("Ambient: ", "Temperature: \n" + temperature + "\n\nPressure: \n" + pressure + "\n\nHumidity: \n" + humidity);
},
  function(error) {
    // Failure!
    console.log('http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1&units=imperial'+OWAPIKEY);  
    console.log('Failed fetching weather data: ' + error);
  }
);
}

function getSky(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1'+OWAPIKEY;
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

function getGeo(){
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+mylat+'&lon='+ mylon+ '&cnt=1'+OWAPIKEY;
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



/* Predict SKY*/
var start_date = "2016-02-06";
var end_date = "2016-02-13";
var API_key= "DEMO_KEY"; 

function Predict ()
{
    // Need to find out how to get time parameter from pebble. 'Clock' is a likely candidate. And get a legit app key.
    var URL = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+start_date+'&end_date='+end_date+ '&api_key='+ API_key; 
    
    // Make the request
    ajax({
        url: URL,
        type: 'application/json'
    },

    //https://api.nasa.gov/neo/rest/v1/feed?start_date=2016-02-06&end_date=2016-02-13&api_key=DEMO_KEY     
    function (data) {
        // Success!
        console.log('Successfully fetched NEObject data!');
        
        var many = data.element_count;

        console.log("how many?" + many);
        Pebble.showSimpleNotificationOnPebble("NEO:", "How many NEOs?: \n" + many +"\n\n");
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


// GOogle maps api
/*
function getMap() {
   
    console.log(Pebble.openURL('https://maps.googleapis.com/maps/api/staticmap?maptype='+type+'&center='+mylat+','+mylon+'&zoom=5&style=element:labels|visibility:on&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&size=144x160'));
                }
  /*      
ajax(
    {
        url: 'https://maps.googleapis.com/maps/api/staticmap?maptype="+type+"&center="+mylat+","+mylon+"&zoom=5&style=element:labels|visibility:on&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&size=144x160',
        type: 'json'
    },
        function(data) {
        console.log('Quote of the day is: ' + data.contents.quote);
        console.log('mapa' + data);
    Mapa = data;
    },
        function(error, status, request) {
            console.log('mapa' + request);
            console.log('The ajax request failed: ' + error);
    }
);} */

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
  size: new Vector2(140, 164), // 144 x 168
  image: 'images/promo.png'
});
banner.add(img);

// Map image holder
var Gmap = new UI.Window({ fullscreen: true });
var imagen = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: Mapa
});
Gmap.add(imagen);

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

// My location sub-menu
var lmi = [{title:'Data'}, {title:'Map'}]; // My Location Menu Items
var myloc = new UI.Menu ({
    sections: [{
        title: 'My location:',
        items: lmi
    }]
});



console.log(Mapa);

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
main.hide();
 var num = sel[event.itemIndex].title;
	console.log("title " + num);
	
if (num === 'ISS') {
    iss.show();
  } else if (num === 'Weather') {
	weather.show();  
  } else if (num === 'Predict the sky') {
	predict.show();
  } else if (num === 'My location') {
    myloc.show();
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

// When PREDICT is selected from menu
predict.on('select', function(event) {
 var num = pmi[event.itemIndex].title;
	console.log("title " + num);
    
    if (num === 'Satellites') {
        console.log("Waiting for nasa");
        Predict();
      } else if (num === 'Meteors') {
        console.log("Waiting for nasa");
      } else if (num === 'Comets') {
        console.log("Waiting for nasa");
      } else if (num === 'Planets') {
        console.log("Waiting for nasa");
      } 
    });

// When wheater is selected from menu
myloc.on('select', function(event) {
 var num = lmi[event.itemIndex].title;
	console.log("title " + num);
    if (num === 'Data') {
        Pebble.showSimpleNotificationOnPebble('My coords: ', 'Latitude: \n' + isLatPos(mylat) + '\n\nLongitude: \n' + isLonPos(mylon) + '\n\nAltitude: \n' + myalt + " m");
      } else if (num === 'Map') {
        ///getMap();
        Gmap.show();
      } 
    });


