var _ = require('underscore');

module.exports.createMarker = function(place, map, markers, service) {
  var infowindow = new google.maps.InfoWindow();
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
};
