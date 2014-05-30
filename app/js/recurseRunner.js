var R1 = require('./recurse').recurseSuperFast;
var R2 = require('./recurse').recurseFast;
var W  = require('./wrapperMod');

module.exports.recurseRunner = function(pathChunks, map, markers) {

  midPoint1 = Math.ceil(pathChunks.length/5);
  midPoint2 = Math.ceil(pathChunks.length/5*2);
  midPoint3 = Math.ceil(pathChunks.length/5*3);
  midPoint4 = Math.ceil(pathChunks.length/5*4);

  var r1 = new R1();
  var r2 = new R2();

  r1.recurseSuperFast(0, midPoint1, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });

  r1.recurseSuperFast(midPoint1, midPoint2, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });

  r1.recurseSuperFast(midPoint2, midPoint3, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });

  r1.recurseSuperFast(midPoint3, midPoint4, function(num) {
    console.log("recurseSuperFast 3 step #: " + num);
    W.wrapper(num, pathChunks, map, markers);
  });

  r1.recurseSuperFast(midPoint4, pathChunks.length, function(num) {
    W.wrapper(num, pathChunks, map, markers);

  });
  r2.recurseFast(0, midPoint1, function(num) {
    console.log("recurseFast 1 step #: " + num);
    W.wrapper(num, pathChunks, map, markers);
  });

  r2.recurseFast(midPoint1, midPoint2, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });

  r2.recurseFast(midPoint2, midPoint3, function(num) {
    console.log("recurseFast 3 step #: " + num);
    W.wrapper(num, pathChunks, map, markers);
  });

  r2.recurseFast(midPoint3, midPoint4, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });

  r2.recurseFast(midPoint4, pathChunks.length, function(num) {
    W.wrapper(num, pathChunks, map, markers);
  });
};
