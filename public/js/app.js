window.addEventListener('load', function() {
  function getHereMap(map) {
    map.setCenter({lat: 52.5159,
      lng: 13.3777});
    map.setZoom(14);
  }
  
  // Step 1: initialize communication with the platform
  var platform = new H.service.Platform({
    app_id: 'DemoAppId01082013GAL',
    app_code: 'AJKnXv84fjrb0KIHawS0Tg',
    useCIT: true,
    useHTTPS: true
  });

  // getting route
  var router = platform.getRoutingService(),
    parameters = {
      waypoint0: '52.5160,13.3779',
      waypoint1: '52.5206,13.3862',
      mode: 'fastest;car;traffic:enabled',
      departure: 'now'};

  router.calculateRoute(parameters,
    function(result) {
      console.log(JSON.stringify(result));
    }, function(error) {
      console.log(error);
    });
  
  // getting actual location with html5 geolocation feature
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords.latitude, position.coords.longitude);
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      var marker = new H.map.Marker({lat: position.coords.latitude,
        lng: position.coords.longitude});
      map.addObject(marker);
    });
  } 

  var defaultLayers = platform.createDefaultLayers();
  
  // Step 2: initialize a map  - not specificing a location will give a whole world view.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map);
  
  // Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  getHereMap(map);

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
});


