module.exports.clearMarkers = function(markers) {
  for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
  }
  markers = null;
  markers = [];
};
