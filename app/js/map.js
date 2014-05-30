var ResultsView = require('./views/resultsView');
var R1 = require('./recurse').recurseSuperFast;
var R2 = require('./recurse').recurseFast;
var PC = require('./pathChunker');

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

      // Make the directions place request
      directionService.route(placeRequest, function(result, status) {
        var userKeyword;
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          var pathChunks = PC.pathChunker(result);

          var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
          var svc = new gmaps.ags.GeometryService(url);


          midPoint1 = Math.ceil(pathChunks.length/5);
          midPoint2 = Math.ceil(pathChunks.length/5*2);
          midPoint3 = Math.ceil(pathChunks.length/5*3);
          midPoint4 = Math.ceil(pathChunks.length/5*4);

          var r1 = new R1();
          var r2 = new R2();
    
          r1.recurseSuperFast(0, midPoint1, function(num) {
            wrapper(num);
          });

          r1.recurseSuperFast(midPoint1, midPoint2, function(num) {
            wrapper(num);
          });

          r1.recurseSuperFast(midPoint2, midPoint3, function(num) {
            wrapper(num);
          });

          r1.recurseSuperFast(midPoint3, midPoint4, function(num) {
            console.log("recurseSuperFast 3 step #: " + num);
            wrapper(num);
          });

          r1.recurseSuperFast(midPoint4, pathChunks.length, function(num) {
            wrapper(num);

          });
          r2.recurseFast(0, midPoint1, function(num) {
            console.log("recurseFast 1 step #: " + num);
            wrapper(num);
          });

          r2.recurseFast(midPoint1, midPoint2, function(num) {
            wrapper(num);
          });

          r2.recurseFast(midPoint2, midPoint3, function(num) {
            console.log("recurseFast 3 step #: " + num);
            wrapper(num);
          });

          r2.recurseFast(midPoint3, midPoint4, function(num) {
            wrapper(num);
          });

          r2.recurseFast(midPoint4, pathChunks.length, function(num) {
            wrapper(num);
          });

            
          function wrapper(count) {
            var routeBoxer = new RouteBoxer();
            
            if ((typeof pathChunks[count][pathChunks.length - 1]  == 'undefined') && (pathChunks[count].length != 35)) {
              pathChunks[count].splice(pathChunks[count].length - 1, 1);
            }


            var myLineCurrent = new google.maps.Polyline({
              map: map,
              path: pathChunks[count],
              strokeColor: '#00B506',
              strokeWeight: 0
            });
            var params = {
              geometries: [myLineCurrent],
              bufferSpatialReference: gmaps.ags.SpatialReference.WEB_MERCATOR,
              distances: [(document.getElementById("distance").value)],
              unit: 9035, //miles
              unionResults: false
            };
              var buffResult;
                svc.buffer(params, function(results, err) {
                  if (!err) {
                      //results.geometries[0][0].setMap(map);
                      buffResult = results.geometries[0][0];

                      var boxes = routeBoxer.box(pathChunks[count], distance);
                      
                      console.log("Number of boxes");
                      console.log(boxes.length);

                      for (var i = 0; i < boxes.length; i++) { 
                        var bounds = boxes[i]; 
                        var infowindow = new google.maps.InfoWindow();
                        var service = new google.maps.places.PlacesService(map);

                        var userKeyword = document.getElementById('search-term').value;

                        var keywordRequest = {
                          bounds: bounds,
                          keyword: [userKeyword]
                        };

                        service.nearbySearch(keywordRequest, callback);
                        function callback(results, status) {
                          if (status == google.maps.places.PlacesServiceStatus.OK) {                   
                            for (var i = 0; i < results.length; i++) {                    
                              var myLatlng = new google.maps.LatLng(results[i].geometry.location.k,results[i].geometry.location.A);   
                              if (google.maps.geometry.poly.containsLocation(myLatlng, buffResult)) {

                                createMarker(results[i]);
                              } else {
                                //console.log("Didn't get displayed: " + results[i].name);
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

                              console.log("RESULT!!!");
                              console.log(result);
                              var list = "<% _.each(result, function(name) { %> <li><%= name %></li> <% }); %>";
                              
                              console.log("LIST");
                              //console.log(list);
                              console.log(_.template(list, {result: [result.name, result.formatted_phone_number]}));
                              var placeData = _.template(list, {result: [result.name, result.formatted_phone_number]});
                              infowindow.setContent(placeData);
                              infowindow.open(map, marker);
                              //console.log(result);
                            })
                          });
                        }

                      } 
                  } else {
                    console.log("Buffer Error!");
                  }
              });
            
            }
          
        } else {
          alert("Directions query failed: " + status);
        }
        new ResultsView(result, searchTerm);
      });
    }