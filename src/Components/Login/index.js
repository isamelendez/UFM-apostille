import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Navbar from '../Navbar';
import { styles } from './styles.css'

class Login extends Component {
  
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: ''
    };
  }


  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      localStorage.setItem('emailLogged', this.state.email)
    }).catch((error) => {
        console.log(error);
      });
    
  }

  signup(e){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{console.log(u)})
    .catch((error) => {
        console.log(error);
      })
  }
  render() {
    return (
       <div className="App">
            <Navbar />
            <div class="containerForm">
              <form >
                  <div class="form-group">
                  {/* <label for="exampleInputEmail1">Email address</label> */}
                  {/* <input value={this.state.email} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" /> */}
                  <TextField value={this.state.email} onChange={this.handleChange} type="email" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
                  </div>
                  <div class="form-group">
                  {/* <label for="exampleInputPassword1">Password</label> */}
                  {/* <input value={this.state.password} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" /> */}
                  <TextField value={this.state.password} onChange={this.handleChange} type="password" name="password" id="exampleInputPassword1" placeholder="Password" />
                  </div>
                  {/* <button type="submit" onClick={this.login} class="btn btn-primary">Login</button> */}
                  <Button type="submit"color="secondary" variant="outlined" onClick={this.login} >
                    Login
                  </Button>
              </form>
            </div>
    </div>
    );
  }
}
export default Login;   