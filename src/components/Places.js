import React, { Component } from 'react';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      searchWord: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  search() {
    fetch(`https://places.cit.api.here.com/places/v1/autosuggest?at=40.74917,-73.98529&q=${this.state.searchWord}&app_id=OGYLftP8d2ca44VEO7PF&app_code=xil_Gm8hAdrTOIHhwDc2rg`)
    .then(function(response) {
      return response.json();
    })
    .then((data) => {
      this.setState({ data });
    })
    .catch(function(error) {
      console.log('something went wrong');
    })
  }

onSubmit(e) {
  e.preventDefault();
  this.search();
}

onInputChange(e) {
  this.setState({ searchWord: e.target.value })
}

render() {
  const { data } = this.state;
  return(
    <div>
      <form onSubmit={this.onSubmit}>
        <input onChange={this.onInputChange} />
        <button>SEARCH</button>
      </form>
      {data && data.results && data.results.map((item, idx) => (
        <div key={idx}>{item.title}</div>
      ))}
    </div>
  )
 }
}

export default Places;