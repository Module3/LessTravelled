var ResultsView = require('./views/resultsView');

  var map = null;
  var markers = [];



    function recurseSuperFast(num, max, callback) {
      if (num >= max) {
        return false;
      }
      setTimeout(function() {
        //console.log(callback);
        callback(num);

        num += 8;

        recurseSuperFast(num, max, callback);
      }, 0);
    }

    function recurseFast(num, max, callback) {
      if (num >= max) {
          return false;
      }

      setTimeout(function() {
        //console.log(callback);
        callback(num);

        num += 2;

        recurseFast(num, max, callback);
      }, 0);
    }
  
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

    /*module.exports.clearMarkers = function() {
      if (markers.length !== 0) 
        for (var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
        }
      markers = null;
      markers = [];
    } */
    
    module.exports.route = function() {
      //clearMarkers();

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
          //directionsRenderer.setMap(map);
          //google.maps.event.addListener(submitButton, 'onclick', function() {
            //map.fitBounds(new google.maps.LatLng(47.6797, -122.3331));
          //});
          
          var coordinates = new Array();
          var output = {};
          var polygon = new Array();

          //var polyOptions = {
            //strokeColor: "red",
            //strokeWeight: 0
          //}

          var vertices = result.routes[0].overview_path;
          var masterPath = [];
          for (i = 0; i < result.routes[0].legs[0].steps.length; i++) {
            for (j = 0; j < result.routes[0].legs[0].steps[i].lat_lngs.length; j++) {
              masterPath.push(result.routes[0].legs[0].steps[i].lat_lngs[j]);
            }
          }

          var pathChunks = [];
          var chunkCounter = 0;
          var currentChunk = [];

          for (i = 1; i < masterPath.length + 1; i++) {
            currentChunk.push(masterPath[i]);
            if (i % 35 === 0) {

              pathChunks.push(currentChunk);
              currentChunk = [];
              chunkCounter += 35;
            } else if (i === masterPath.length) {
              pathChunks.push(currentChunk);
            }
          }

          var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
          var svc = new gmaps.ags.GeometryService(url);


          midPoint1 = Math.ceil(pathChunks.length/5);
          midPoint2 = Math.ceil(pathChunks.length/5*2);
          midPoint3 = Math.ceil(pathChunks.length/5*3);
          midPoint4 = Math.ceil(pathChunks.length/5*4);
    
          recurseSuperFast(0, midPoint1, function(num) {
            wrapper(num);
          });


          recurseSuperFast(midPoint1, midPoint2, function(num) {
            wrapper(num);
          });


          recurseSuperFast(midPoint2, midPoint3, function(num) {
            wrapper(num);
          });


          recurseSuperFast(midPoint3, midPoint4, function(num) {
            wrapper(num);
          });


          recurseSuperFast(midPoint4, pathChunks.length, function(num) {
            wrapper(num);

          });

          recurseFast(0, midPoint1, function(num) {
            wrapper(num);
          });

          recurseFast(midPoint1, midPoint2, function(num) {
            wrapper(num);
          });

          recurseFast(midPoint2, midPoint3, function(num) {
            wrapper(num);
          });


          recurseFast(midPoint3, midPoint4, function(num) {
            wrapper(num);
          });

          recurseFast(midPoint4, pathChunks.length, function(num) {
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
                          google.maps.event.addListener(marker, 'click', function() {
                            service.getDetails(place, function(result, status) {
                              if (status != google.maps.places.PlacesServiceStatus.OK) {
                                alert(status);
                                return;
                              }
                              var contentString = (result.name + ", " + result.formatted_phone_number);
                              infowindow.setContent(contentString);
                              //infowindow.setContent(result.formatted_phone_number);
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
            
            }
          
        } else {
          alert("Directions query failed: " + status);
        }
        new ResultsView(result, searchTerm);
      });
    }