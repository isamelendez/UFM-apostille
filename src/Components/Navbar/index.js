import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


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
                <Tab label="Auditar" />
                <Tab label="Upload" />
                <Tab label="Pending" />
            </Tabs>
        </Paper>
      )
  }
}

export default  Navbar