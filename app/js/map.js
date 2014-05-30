var ResultsView = require('./views/resultsView');
var RUN = require('./recurseRunner');
var PR = require('./placeReq');
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
    };

    var clearMarkers = function() {
        for (var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
        }
      markers = null;
      markers = [];
    };

    module.exports.route = function() {
      clearMarkers();
      distance = parseFloat(document.getElementById("distance").value);

      var placeRequest = PR.placeReq();
      var searchTerm = document.getElementById('search-term').value;

      directionService.route(placeRequest, function(result, status) {
        var userKeyword;
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          RUN.recurseRunner(result, map, markers);
        } else {
          alert("Directions query failed: " + status);
        }
        new ResultsView(result, searchTerm);
      });
    };
