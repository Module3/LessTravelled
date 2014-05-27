
    var map = null;
    var boxpolys = null;
    var directions = null;
    var routeBoxer = null;
    var distance = null; // km
    var markers = [];
    
    module.exports.initialize = function() {
      console.log('map initialized');
      // Default the map view to the continental U.S.
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
        //map.panTo(new google.maps.LatLng(47.6797, -122.3331));
        
      }); 
    }

      // Clear boxes currently on the map
    var clearBoxes= function() {
      if (boxpolys != null) {
        for (var i = 0; i < boxpolys.length; i++) {
          boxpolys[i].setMap(null);
        }
      }
      boxpolys = null;
    }

    // Clear markers currently on the map
    function clearMarkers() {
      if (markers.length != 0)
        for (var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
        }
      markers = null;
      markers = [];
    }
    
    module.exports.route= function() {
      console.log('route called');
      // Clear any previous route boxes from the map
      clearBoxes();
      clearMarkers();
      
      // Convert the distance to box around the route from miles to km
      distance = parseFloat(document.getElementById("distance").value) * 1.609344;
      
      var placeRequest = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }
      
      // Make the directions request
      directionService.route(placeRequest, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          //console.log(result.routes[0].overview_path[0]);
          console.log(result);
          console.log(result.routes[0].legs);
          //console.log(result.routes[0].legs[0].steps[0].end_location);
          
          var coordinates = new Array();
          var output = {};
          var polygon = new Array();
          //(results[i].geometry.location.k,results[i].geometry.location.A)
          /*//for (i = 0; i < result.routes[0].overview_path.length; i++) {
            //var geoJSON = { 'type': 'LineString', 'coordinates' : ((result.routes[0].overview_path[i].k), (result.routes[0].overview_path[i].A)) };
            var geoJSON = { 'type': 'LineString', 'coordinates' : [(("[" + result.routes[0].overview_path[0].k) + ", " + (result.routes[0].overview_path[0].A + "]") + ", " + ("[" + result.routes[0].overview_path[1].k) + "," + (result.routes[0].overview_path[1].A + "]"))] };
            output.value = JSON.stringify(geoJSON, null, '\t');
          //}
          console.log(output.value);
          //console.log(typeof(geoJSON.coordinates));

          */

          var vertices = result.routes[0].overview_path;
          console.log("overview_path:")
          console.log(result.routes[0].overview_path);
          for (var j = 0; j < vertices.length; j++) {
            //console.log(vertices[j]);
            var lngLat = new Array(vertices[j].A, vertices[j].k);
            //var xy = vertices.getAt(j);
            //var lngLat = new Array(xy.lng(), xy.lat());
            polygon.push(lngLat);
          }
          coordinates.push(polygon);
          //output = document.getElementById('geoJSON');
          var geoJSON = { 'type': 'LineString', 'coordinates' : coordinates };
          output.value = JSON.stringify(geoJSON, null, '\t');
          //console.log(output.value);

          vertices2 = [];
          vertices2 = vertices.slice(0,40);


          vertices3 = [];
          //console.log(vertices.length);
          var secondLength = Math.ceil(vertices.length / 36);
          if (secondLength === 1) {
            secondLength = 2;
          }
          console.log("2nd length: " + secondLength)
          //vertices3.push(vertices[0]);
          for (i = 0; i < vertices.length; i++) {
            if (i % secondLength === 0) {
              vertices3.push(vertices[i]);
              //console.log(i);
            }
          }
          vertices3.push(vertices[vertices.length - 1]);
          console.log(vertices3);

          var myLine2 = new google.maps.Polyline({
              map: map,
              path: vertices3,
              strokeColor: '#ff0000'
          });

          var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
          var svc = new gmaps.ags.GeometryService(url);
          var params = {
              geometries: [myLine2],
              bufferSpatialReference: gmaps.ags.SpatialReference.WEB_MERCATOR,
              distances: [(document.getElementById("distance").value)],
              unit: 9035,
              unionResults: false
          };
          console.log("vertices array:");
          console.log(vertices.length);
          var buffResult;
          svc.buffer(params, function(results, err) {
              if (!err) {
                  results.geometries[0][0].setMap(map);
                  buffResult = results.geometries[0][0];

                  var path = result.routes[0].overview_path;
                  
                  var boxes = routeBoxer.box(path, distance);
                  drawBoxes(boxes);
                  console.log("Number of boxes");
                  console.log(boxes.length);

                  for (var i = 0; i < boxes.length; i++) { 
                    var bounds = boxes[i]; 
                    var SW = bounds.getSouthWest();
                    var NE = bounds.getNorthEast();
                    // Perform search over this bounds 
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

                      //puts each marker into the markers array
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
            //}
            //} 
          //);
          
          // Box around the overview path of the first route
          
        } else {
          alert("Directions query failed: " + status);
        }
      });
    }
    
    // Draw the array of boxes as polylines on the map
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
    
  