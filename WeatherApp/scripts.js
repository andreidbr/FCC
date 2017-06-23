const body = document.querySelector('body');
const sunny = document.querySelector('#sun');
const cloudy = document.querySelector('#cloud');
const rainy = document.querySelector('#rain');
const snowy = document.querySelector('#snow');
const units = document.querySelector('#unit');
const loc = document.querySelector('#location');
const degree = document.querySelector('#degrees');
const summ = document.querySelector('#summary');

function changeBackground(num) {
  switch (num) {
    case 1:
      body.style.backgroundImage = 'url(sun_bg.jpg)';
      break;
    case 2:
      body.style.backgroundImage = 'url(cloud_bg.jpg)';
      break;
    case 3:
      body.style.backgroundImage = 'url(rain_bg.jpg)';
      break;
    case 4:
      body.style.backgroundImage = 'url(snow_bg.jpg)';
      break;
    default:
      break;
  }
}
//Code originated from SO and modified by me: https://stackoverflow.com/questions/22704997/how-to-get-city-name-from-latitude-and-longitude-in-phone-gap
function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition,showError);
  }
  else{
    loc.innerHTML="Geolocation is not supported by this browser.";
  }
}

function showPosition(position){
  lat=position.coords.latitude;
  lon=position.coords.longitude;
  displayLocation(lat,lon);
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.darksky.net/forecast/[API_KEY]/${lat},${lon}?units=si`,
    "method": "GET",
    "dataType": "jsonp",
    "headers": {
      "cache-control": "no-cache",
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    degree.innerHTML = Math.floor(response.currently.apparentTemperature);
    summ.innerHTML = response.hourly.summary;
    const bg = response.currently.icon;
    switch (bg) {
      case "clear-day":
      case "clear-night":
        changeBackground(1);
        break;
      case "partly-cloudy-day":
      case "partly-cloudy-night":
      case "cloudy":
        changeBackground(2);
        break;
      case "rain":
        changeBackground(3);
        break;
      case "snow":
        changeBackground(4);
        break;
      default:
        break;
    }
  });
}

function showError(error){
  switch(error.code){
    case error.PERMISSION_DENIED:
      loc.innerHTML="User denied the request for Geolocation."
    break;
    case error.POSITION_UNAVAILABLE:
      loc.innerHTML="Location information is unavailable."
    break;
    case error.TIMEOUT:
      loc.innerHTML="The request to get user location timed out."
    break;
    case error.UNKNOWN_ERROR:
      loc.innerHTML="An unknown error occurred."
    break;
  }
}

function displayLocation(latitude,longitude){
  var geocoder;
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(latitude, longitude);

  geocoder.geocode(
    {'latLng': latlng}, 
    function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var add= results[0].formatted_address ;
          var  value=add.split(",");
          count=value.length;
          country=value[count-1];
          state=value[count-2];
          city=value[count-3];
          loc.innerHTML = `${city}, ${state}, ${country}`;
          }
          else  {
            loc.innerHTML = "address not found";
          }
        }
      else {
        loc.innerHTML = "Geocoder failed due to: " + status;
      }
    }
  );
}
// Code by me
function tempChange(initTemp) {
  if (units.innerHTML === "C") {
    initTemp = Math.floor((initTemp * 9/5) + 32);
    degree.innerHTML = initTemp;
    units.innerHTML = 'F';
  } else {
    initTemp = Math.floor((initTemp - 32) * 5/9);
    degree.innerHTML = initTemp;
    units.innerHTML = 'C';
  }
}

sunny.addEventListener('click', () => changeBackground(1));
cloudy.addEventListener('click', () => changeBackground(2));
rainy.addEventListener('click', () => changeBackground(3));
snowy.addEventListener('click', () => changeBackground(4));
units.addEventListener('click', () => tempChange(degree.innerHTML));
getLocation();