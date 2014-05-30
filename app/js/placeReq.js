module.exports.placeReq = function () {
  var placeQuest;

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

  return placeRequest;
}
