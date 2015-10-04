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

function getISSLocation ()
{
    //var ajax = require('ajax');

    var URL = 'http://api.open-notify.org/iss-now.json';

    // Make the request
    ajax({
        url: URL,
        type: 'json'
    },

    function (data) {
        // Success!
        //console.log('Successfully fetched weather data!');
        var lat = data.iss_position.latitude;
        var longt = data.iss_position.longitude;

        console.log("lat " + lat + " lon " + longt);
    },

    function (error) {
        //show error card!
        // Failure!
        //console.log('Failed fetching weather data: ' + error);
    });
  
   return data;
};


// Main UI card
var main = new UI.Card({
  title: "What's up?",
  icon: 'images/logo.png',
  subtitle: 'Take a look!',
  body: 'Press any button.'
});


var banner = new UI.Window({ fullscreen: true });
var img = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/promo.png'
});
banner.add(img);

// Main menu
var sel = [{title: 'ISS'}, {title: 'Meteor'}, {title: 'Predict the sky'}];
var whatsup = new UI.Menu({
	sections: [{ 
		title: 'What to see?',
		items: sel
	}]
});

// ISS sub-menu
var imi = [{title:"Who's up?"}, {title:'Where is it?'}, {title:'Other'}]; // ISS Menu Items
var iss = new UI.Menu ({
	sections: [{
		title: 'ISS:', 
		items: imi
	}] 
});

// Meteors sub-menu
var mmi= [{title:"Who's up?"}, {title:'Where is it?'}, {title:'Other'}]; // Meteors Menu Items
var meteor = new UI.Menu ({
	sections: [{
		title: 'Meteors:',
		items: mmi
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


/* Garbage Dump
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: '',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }, {
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }]
	}]	
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });

  var i = whatsup[event.itemIndex].value;
 i.show();
  }); 


main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


  
    var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  
*/

// Function Implementations

main.show();

main.on('click', 'up', function(e) {
  banner.show();
});

main.on('click', 'select', function(e) {
  whatsup.show();
});

main.on('click', 'down', function(e) {
  whatsup.show();
});

whatsup.on('select', function(event) {
 var num = sel[event.itemIndex].title;
	console.log("title " + num);
	
  if (num === 'ISS') {
      iss.show();
    } else if (num === 'Meteor') {
  	meteor.show();  
    } else if (num === 'Predict the sky') {
  	predict.show();
    }	
 
});

var issLoc;
// When ISS is selected from menu
iss.on('select', function(event) {
 var num = imi[event.itemIndex].title;
	console.log("title " + num);
	
if (num === "Where is it?") {
  issLoc = getISSLocation();
  console.log("ISS Log: " + issLoc);
  } /*else if (num === 'Where is it?') {
	meteor.show();  
  } else if (num === 'Other') {
	predict.show();
  } */
 
});
