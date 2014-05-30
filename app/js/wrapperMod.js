var BufferRunner = require('./bufferRunner')

module.exports.wrapper = function(count, pathChunks, map, markers) {

  if ((typeof pathChunks[count][pathChunks.length - 1]  == 'undefined') && (pathChunks[count].length != 35)) {
    pathChunks[count].splice(pathChunks[count].length - 1, 1);
  }

  var distance = parseFloat(document.getElementById("distance").value);
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

  BufferRunner.runBuffer(params, pathChunks, distance, count, markers, map)

};
