import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import logo from './logoufm.png';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom'

class Navbar extends Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      rows: [],
      user: ''
    }
  }

  componentDidMount() {
    this.authListener();
  }

  logout() {
    firebase.auth().signOut();
    this.renderRedirect()
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

  renderRedirect = () => {
    console.log("redirect")
    return <Redirect to='/' />
  }

  render() {

    return(
        <Paper className="root">
            <Tabs
                indicatorColor="secondary"
                textColor="secondary"
                centered
            >
              <img className="logo" src={logo} />
              <Link to={'./audit'}>
                <Tab label="Auditar certificado" />
              </ Link>
              <Link to={this.state.user ? (localStorage.getItem('emailLogged').indexOf('decanatura') >=0) ? './pending' : './upload' : './'}>
                <Tab label="Certificados UFM" />
              </Link>
              {this.state.user ? <Tab label="logout" onClick={this.logout} /> : null}

            </Tabs>
        </Paper>
      )
  }
}

export default  Navbar