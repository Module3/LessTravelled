module.exports.pathChunker = function(result) {
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
  
  return pathChunks;
};