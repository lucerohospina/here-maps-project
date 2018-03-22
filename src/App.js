import React, { Component } from 'react';
import Main from './components/Main';
import Places from './components/Places';
import Header from './components/Header';
// import logo from './logo.svg';
// import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Main/>
        <Places/>
      </div>
    );
  }
}

export default App;
