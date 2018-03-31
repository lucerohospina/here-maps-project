// Obtain map from Interactive Map feature
var platform = new H.service.Platform({
  'app_id': 'OGYLftP8d2ca44VEO7PF',
  'app_code': 'xil_Gm8hAdrTOIHhwDc2rg'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('map'),
  defaultLayers.normal.map,
  {
    zoom: 12,
    center: { lat: 52.5, lng: 13.4 }
  });

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude)
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(pos);
  });
}

// fetching data from Places feature
const form = document.getElementById('search-form');
const searchField = document.getElementById('search-keyword');
const responseContainer = document.getElementById('response-container');
let searchForText;

form.addEventListener('submit', function(event) {
  event.preventDefault();
  responseContainer.innerHTML = '';
  searchForText = searchField.value;
  console.log(searchForText);

  let url = `https://places.cit.api.here.com/places/v1/autosuggest?at=40.74917,-73.98529&q=${searchForText}&app_id=OGYLftP8d2ca44VEO7PF&app_code=xil_Gm8hAdrTOIHhwDc2rg`;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.log('something went wrong');
    });
});
