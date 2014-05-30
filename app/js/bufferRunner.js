var MarkerMaker = require('./createMarker');

module.exports.runBuffer = function(params, pathChunks, distance, count, markers, map) {

  var routeBoxer = new RouteBoxer();
  var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
  var svc = new gmaps.ags.GeometryService(url);

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
              console.log("about to call create marker");
              MarkerMaker.createMarker(results[i], map, markers, service);
            } else {
              //console.log("Didn't get displayed: " + results[i].name);
              }
            }
          }
        }
      }
    } else {
      console.log("Buffer Error!");
    }
  });
};
