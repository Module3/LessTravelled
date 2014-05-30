var ResultsView = require('./views/resultsView');
var R1 = require('./recurse').recurseSuperFast;
var R2 = require('./recurse').recurseFast;
var PC = require('./pathChunker');
var W  = require('./wrapperMod');
var _ = require('underscore');

  var map = null;
  var markers = [];

    module.exports.initialize = function() {
      var mapOptions = {
        center: new google.maps.LatLng(47.6797, -122.3331),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 10
      };
    
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      
      directionService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({ map: map });  


      var input = document.getElementById('from');
      var input2 = document.getElementById('to');
      var autocomplete = new google.maps.places.Autocomplete(input);
      var autocomplete2 = new google.maps.places.Autocomplete(input2);
      autocomplete.bindTo('bounds', map);
      autocomplete2.bindTo('bounds', map);

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        else {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
       }
      });
      google.maps.event.addListener(autocomplete2, 'place_changed', function() {
        var place = autocomplete2.getPlace();
        if (!place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        else {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
       }
      });
    }

    var clearMarkers = function() {
        for (var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
        }
      markers = null;
      markers = [];
    } 
    
    module.exports.route = function() {
      clearMarkers();

      distance = parseFloat(document.getElementById("distance").value);

      var placeRequest;
      if(document.getElementById('mode').value==="DRIVING"){
        placeRequest = {
          origin: document.getElementById("from").value,
          destination: document.getElementById("to").value,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
      } else if (document.getElementById('mode').value==="WALKING"){
        placeRequest = {
          origin: document.getElementById("from").value,
          destination: document.getElementById("to").value,
          travelMode: google.maps.DirectionsTravelMode.WALKING
        };
      } else {
        placeRequest = {
          origin: document.getElementById("from").value,
          destination: document.getElementById("to").value,
          travelMode: google.maps.DirectionsTravelMode.BICYCLING
        };
      }

      var searchTerm = document.getElementById('search-term').value;

      directionService.route(placeRequest, function(result, status) {
        var userKeyword;
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          var pathChunks = PC.pathChunker(result);

          midPoint1 = Math.ceil(pathChunks.length/5);
          midPoint2 = Math.ceil(pathChunks.length/5*2);
          midPoint3 = Math.ceil(pathChunks.length/5*3);
          midPoint4 = Math.ceil(pathChunks.length/5*4);

          var r1 = new R1();
          var r2 = new R2();
    
          r1.recurseSuperFast(0, midPoint1, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

          r1.recurseSuperFast(midPoint1, midPoint2, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

          r1.recurseSuperFast(midPoint2, midPoint3, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

          r1.recurseSuperFast(midPoint3, midPoint4, function(num) {
            console.log("recurseSuperFast 3 step #: " + num);
            W.wrapper(num, pathChunks, map, markers);
          });

          r1.recurseSuperFast(midPoint4, pathChunks.length, function(num) {
            W.wrapper(num, pathChunks, map, markers);

          });
          r2.recurseFast(0, midPoint1, function(num) {
            console.log("recurseFast 1 step #: " + num);
            W.wrapper(num, pathChunks, map, markers);
          });

          r2.recurseFast(midPoint1, midPoint2, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

          r2.recurseFast(midPoint2, midPoint3, function(num) {
            console.log("recurseFast 3 step #: " + num);
            W.wrapper(num, pathChunks, map, markers);
          });

          r2.recurseFast(midPoint3, midPoint4, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

          r2.recurseFast(midPoint4, pathChunks.length, function(num) {
            W.wrapper(num, pathChunks, map, markers);
          });

        } else {
          alert("Directions query failed: " + status);
        }
        new ResultsView(result, searchTerm);
      });
    }