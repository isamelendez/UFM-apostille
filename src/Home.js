import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';  
import Upload from './Components/Upload';
import Login from './Components/Login';
import Pending from './Components/Pending';
import * as firebase from 'firebase';
class Home extends Component  {

  constructor(props){
    super(props);
    this.state = {
    user: {}
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() { firebase.auth().onAuthStateChanged((user) => {
    // console.log(user);
    if (user) {
      this.setState({ user });
      // localStorage.setItem('user', user.uid);
    } else {
      this.setState({ user:null});
      // localStorage.removeItem('user');
    }


    });
  }

  render() {
    return (
      <div className="App">
          {this.state.user ? (localStorage.getItem('emailLogged').indexOf('decanatura') >=0) ? <Pending /> : <Upload /> : (<Login />)}
      </div>
    )
  }
}


export default Home;


