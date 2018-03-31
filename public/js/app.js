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

    const $form = $('#xhr-search-form');
    const $searchField = $('#search-keyword');
    const $responseContainer = $('#response-container');
    let searchForText;
    
    $form.submit(function(event) {
      event.preventDefault();
      $responseContainer.html('');
      searchForText = $searchField.val();
      getNews();
    });
  
    function getNews() {
      $.ajax({
        url: `https://places.cit.api.here.com/places/v1/autosuggest?at=40.74917,-73.98529&q=${searchForText}&app_id=OGYLftP8d2ca44VEO7PF&app_code=xil_Gm8hAdrTOIHhwDc2rg`
      }).done(addNews)
        .fail(handleError);
    };
  
    function addNews(data) {
      console.log(data);
      let output = '';
      // for (i = 0; i < data.response.docs.length; i++) {
      //   console.log(data.response.docs[i]);
      //   let title = data.response.docs[i].headline.main;
      //   console.log(title);
      //   let link = data.response.docs[i].web_url;
      //   let snippet = data.response.docs[i].snippet;
      //   output += `
      //     <div class="card my-3">
      //     <div class="card-body">
      //       <h5 class="card-title">${title}</h5>
      //       <p class="card-text">${snippet}</p>
      //       <a href="${link}" class="card-link">Noticia Completa</a>
      //     </div>
      //   </div>
      //     `;
      //   $responseContainer.html(output);
      // }
    };
  
    function handleError() {
      console.log('se ha presentado un error');
      let $paragraph = ('<p>Lo sentimos, ha ocurrido un error</p>');
      $responseContainer.append($paragraph);
    }
  
