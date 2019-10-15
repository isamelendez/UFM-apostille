import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Upload from './Components/Upload';
import Login from './Components/Login';

function Home() {
  return (
    <div className="App">
        <Navbar />
        <Upload />
    </div>
  );
}


export default Home;


