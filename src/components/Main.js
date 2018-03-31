import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.platform = new window.H.service.Platform({
      'app_id': 'OGYLftP8d2ca44VEO7PF',
      'app_code': 'xil_Gm8hAdrTOIHhwDc2rg'
    });
    this.state = {
      lat: 52.5,
      lng: 13.4
    }
    // Obtain the default map types from the platform object:
    this.defaultLayers = this.platform.createDefaultLayers();
    this.createMap = this.createMap.bind(this);
  }

  componentDidMount() {
    console.log("did Mount");
    
  }

  createMap(node) {
      this.map = new window.H.Map(
          node,
          this.platform.createDefaultLayers().normal.map,
          {
            zoom: 10,
            center: { lat: 52.5, lng: 13.4 }
          }
        );
    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude)
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(pos);
      });
    }
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       console.log(position.coords.latitude, position.coords.longitude)
  //       let lat = position.coords.latitude;
  //       let lng = position.coords.longitude;
  //     });
  // } else { 
  //     console.log('not supported');
  // }
  }

  render() {
    return(
      <div>
        <div style={{ width: '300px', height: '400px' }} ref={this.createMap}></div>
      </div>
    )
  }
}

export default Main;