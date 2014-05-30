var _ = require('underscore');

module.exports.wrapper = function(count, pathChunks, map, markers) {

//function wrapper(count, pathChunks, map) {
  var routeBoxer = new RouteBoxer();
  var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
  var svc = new gmaps.ags.GeometryService(url);
  
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
                  var list = "<% _.each(result, function(name) { %> <ul><%= name %></ul> <% }); %>";
                  
                  console.log("LIST");
                  //console.log(list);
                  console.log(_.template(list, {result: [result.name, result.formatted_phone_number]}));

                 
                  var placeData = _.template(list, {result: [result.name, result.formatted_phone_number, result.formatted_address]});
                  infowindow.setContent(placeData);
                  infowindow.open(map, marker);
                  //console.log(result);
                });
              });
            }

          } 
        } else {
          console.log("Buffer Error!");
        }
    });
  
};