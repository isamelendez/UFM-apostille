import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Upload from './Components/Upload';
import Navbar from './Components/Navbar';

class App extends Component {
  render() {
    const App = () => (
      <div id="main">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/upload' component={Upload}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
