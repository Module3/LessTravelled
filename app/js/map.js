
var map = null;
var boxpolys = null;
var routeBoxer = null;
var distance = null; // km
var markers = [];

var ResultsView = require('./views/resultsView');

module.exports.initialize = function() {
  console.log('map initialized');
  var mapOptions = {
    center: new google.maps.LatLng(47.6797, -122.3331),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 10
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  routeBoxer = new RouteBoxer();
  directionService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });  

  google.maps.event.addDomListener(window, 'resize', function() {
    var relocate = new google.maps.LatLng(47.6797, -122.3331);
    map.panTo(relocate);
    map.setCenter(relocate);   
  }); 
}

var clearBoxes= function() {
  if (boxpolys != null) {
    for (var i = 0; i < boxpolys.length; i++) {
      boxpolys[i].setMap(null);
    }
  }
  boxpolys = null;
}

function clearMarkers() {
  if (markers.length != 0)
    for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
  markers = null;
  markers = [];
}

module.exports.route= function() {
  clearBoxes();
  clearMarkers();

  distance = parseFloat(document.getElementById("distance").value);
  
  if(document.getElementById('mode').value==="DRIVING"){
    var placeRequest = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }
  } else if (document.getElementById('mode').value==="WALKING"){
    var placeRequest = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    }
  } else {
    var placeRequest = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.DirectionsTravelMode.BICYCLING
    }
  }

  var searchTerm = document.getElementById('search-term').value;

  directionService.route(placeRequest, function(result, status) {
    var userKeyword;
    if (status == google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      
      var coordinates = new Array();
      var polygon = new Array();

      var vertices = result.routes[0].overview_path;

      for (var j = 0; j < vertices.length; j++) {
        var lngLat = new Array(vertices[j].A, vertices[j].k);
        polygon.push(lngLat);
      }
      coordinates.push(polygon);
      vertices3 = [];
      var secondLength = Math.ceil(vertices.length / 36);
      if (secondLength === 1) {
        secondLength = 2;
      }

      for (i = 0; i < vertices.length; i++) {
        if (i % secondLength === 0) {
          vertices3.push(vertices[i]);
        }
      }
      vertices3.push(vertices[vertices.length - 1]);

      var myLine = new google.maps.Polyline({
          map: map,
          path: vertices3,
          strokeColor: '#ff0000'
      });

      var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
      var svc = new gmaps.ags.GeometryService(url);
      var params = {
          geometries: [myLine],
          bufferSpatialReference: gmaps.ags.SpatialReference.WEB_MERCATOR,
          distances: [(document.getElementById("distance").value)],
          unit: 9035,
          unionResults: false
      };

      var buffResult;
      svc.buffer(params, function(results, err) {
          if (!err) {
            results.geometries[0][0].setMap(map);
            buffResult = results.geometries[0][0];

            var path = result.routes[0].overview_path; 
            var boxes = routeBoxer.box(path, distance);

            for (var i = 0; i < boxes.length; i++) { 
              var bounds = boxes[i]; 
              var infowindow = new google.maps.InfoWindow();
              var service = new google.maps.places.PlacesService(map);

              var userKeyword= document.getElementById('search-term').value;
              var keywordRequest = {
                bounds: bounds,
                keyword: [userKeyword]
              };
              service.radarSearch(keywordRequest, callback);
              //service.nearbySearch(request, callback);
              function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {                    
                    var myLatlng = new google.maps.LatLng(results[i].geometry.location.k,results[i].geometry.location.A);   
                    if (google.maps.geometry.poly.containsLocation(myLatlng, buffResult)) {
                      createMarker(results[i]);
                    } else {
                      console.log("Didn't get displayed: " + results[i].name);
                    }
                  }
                }
              }
              function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                  service.getDetails(place, function(result, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                      alert(status);
                      return;
                    }
                    infowindow.setContent(result.name);
                    infowindow.open(map, marker);
                    console.log(result);
                  })
                });
              }
            } 
          } else {
            console.log("Buffer Error!");
          }
      });   
    } else {
      alert("Directions query failed: " + status);
    }
    console.log('map.js userKeyword= ' + userKeyword);
    new ResultsView(result, searchTerm);
  });
}

var drawBoxes= function(boxes) {
  boxpolys = new Array(boxes.length);
  for (var i = 0; i < boxes.length; i++) {
    boxpolys[i] = new google.maps.Rectangle({
      bounds: boxes[i],
      fillOpacity: 0,
      strokeOpacity: 1.0,
      strokeColor: '#000000',
      strokeWeight: 1,
      map: map
    });
  }
}
  
