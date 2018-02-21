import React, { Component } from 'react';
import Game from './components/Game';


class App extends Component {
  render() {
    return (
      <div>
        <h4> React + D3 + socket.io -> Pong </h4>
	    <Game/>
      </div>
    );
  }
}

export default App;
