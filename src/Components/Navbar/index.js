import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import logo from './logoufm.png';


class Navbar extends Component {

  constructor(props){
    super(props);
    this.state = {
      rows: []
    }
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
                <Tab label="Auditar" />
              </ Link>
              <Link to={'./upload'}>
                <Tab label="Upload" />
              </Link>
              <Link to={'./pending'}>
                <Tab label="Pending" />
              </Link>
            </Tabs>
        </Paper>
      )
  }
}

export default  Navbar