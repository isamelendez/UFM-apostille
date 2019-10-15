import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCbCLN6-5RlYSZATzD0lL6YfMUN7UatkU8",
    authDomain: "apostille-a1e6d.firebaseapp.com",
    databaseURL: "https://apostille-a1e6d.firebaseio.com",
    projectId: "apostille-a1e6d",
    storageBucket: "apostille-a1e6d.appspot.com",
    messagingSenderId: "355169463101",
    appId: "1:355169463101:web:f4f64d90a327eab6c1f354"
};

firebase.initializeApp(firebaseConfig);

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
serviceWorker.unregister();