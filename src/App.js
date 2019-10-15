import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Upload from './Components/Upload';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Pending from './Components/Pending';
import * as firebase from 'firebase';

class App extends Component {

  render() {
    const App = () => (
      <div id="main">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/upload' component={Upload}/>
          <Route path='/login' component={Login}/>
          <Route path='/pending' component={Pending}/>
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
