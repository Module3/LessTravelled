var ResultsView = require('./views/resultsView');
var RUN = require('./recurseRunner');
var PR = require('./placeReq');
var AC = require('./autocomplete');
var CM = require('./clearMarkers');
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
  AC.autoComplete(map);
};

module.exports.route = function() {
  CM.clearMarkers(markers);
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
