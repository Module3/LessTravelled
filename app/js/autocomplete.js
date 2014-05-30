module.exports.autoComplete = function(map) {
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
