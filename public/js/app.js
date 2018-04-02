window.addEventListener('load', function() {
  // declarando variables
  var directionsBtn = document.getElementById('finder-btn');
  var startInput = document.getElementById('start-input');
  var finishingInput = document.getElementById('finishing-input');
  
  // Step 1: initialize communication with the platform
  var platform = new H.service.Platform({
    app_id: 'OGYLftP8d2ca44VEO7PF',
    app_code: 'xil_Gm8hAdrTOIHhwDc2rg',
    useCIT: true,
    useHTTPS: true
  });

  // getting route
  // var router = platform.getRoutingService(),
  //   parameters = {
  //     representation: 'display',
  //     routeattributes : 'waypoints,summary,shape,legs',
  //     maneuverattributes: 'direction,action',
  //     waypoint0: '52.5160,13.3779',
  //     waypoint1: '52.5206,13.3862',
  //     mode: 'fastest;car;traffic:enabled',
  //     departure: 'now'};

  // router.calculateRoute(parameters,
  //   function(result) {
  //     console.log(result.response.route[0]);
  //   }, function(error) {
  //     console.log(error);
  //   });
  
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
  

  function getHereMap(map) {
    map.setCenter({lat: 52.5159,
      lng: 13.3777});
    map.setZoom(14);
  }
  // Now use the map as required...
  getHereMap(map);
  directionsBtn.addEventListener('click', function(){getRoute(platform)});

  function getRoute(platform) {
    var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes : 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: '52.5160,13.3779', // Brandenburg Gate
      waypoint1: '52.5206,13.3862'  // Friedrichstraße Railway Station
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
} 
  
/**
  * This function will be called once the Routing REST API provides a response
  * @param  {Object} result          A JSONP object representing the calculated route
  *
  * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
  */
 function onSuccess(result) {
   var route = result.response.route[0];
  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representitive styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
   addRouteShapeToMap(route);
   addManueversToMap(route);
 
   // addWaypointsToPanel(route.waypoint);
   // addManueversToPanel(route);
   // addSummaryToPanel(route.summary);
   // ... etc.
 }

  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param  {Object} error  The error message received.
   */
  function onError(error) {
    alert('Ooops!');
  }

  // Hold a reference to any infobubble opened
  var bubble;
  
  /**
   * Opens/Closes a infobubble
   * @param  {H.geo.Point} position     The location on the map.
   * @param  {String} text              The contents of the infobubble.
   */
  function openBubble(position, text){
   if(!bubble){
      bubble =  new H.ui.InfoBubble(
        position,
        // The FO property holds the province name.
        {content: text});
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }

  /**
   * Creates a H.map.Polyline from the shape of the route and adds it to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;
  
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });
  
    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
  }

  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addManueversToMap(route){
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      group = new  H.map.Group(),
      i,
      j;
  
    // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        var marker =  new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude} ,
          {icon: dotIcon});
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }
  
    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getPosition());
      openBubble(
         evt.target.getPosition(), evt.target.instruction);
    }, false);
  
    // Add the maneuvers group to the map
    map.addObject(group);
  }

  // 

  // fetching data from Places feature
  const form = document.getElementById('search-form');
  const searchField = document.getElementById('search-keyword');
  const responseContainer = document.getElementById('response-container');
  let searchForText;

  // form.addEventListener('submit', function(event) {
  //   event.preventDefault();
  //   responseContainer.innerHTML = '';
  //   searchForText = searchField.value;
  //   console.log(searchForText);

  //   let url = `https://places.cit.api.here.com/places/v1/autosuggest?at=40.74917,-73.98529&q=${searchForText}&app_id=OGYLftP8d2ca44VEO7PF&app_code=xil_Gm8hAdrTOIHhwDc2rg`;

  //   fetch(url)
  //     .then(function(response) {
  //       return response.json();
  //     })
  //     .then(function(data) {
  //       console.log(data);
  //     })
  //     .catch(function(error) {
  //       console.log('something went wrong');
  //     });
  // });
});


