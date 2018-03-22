import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.platform = new window.H.service.Platform({
      'app_id': 'OGYLftP8d2ca44VEO7PF',
      'app_code': 'xil_Gm8hAdrTOIHhwDc2rg'
    });
    // Obtain the default map types from the platform object:
    this.defaultLayers = this.platform.createDefaultLayers();
    this.createMap = this.createMap.bind(this);
  }

  createMap(node) {
    if (node instanceof HTMLElement) {
      new window.H.Map(
        node,
        this.defaultLayers.normal.map,
        {
          zoom: 10,
          center: { lat: 52.5, lng: 13.4 }
        }
      );
    } 
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