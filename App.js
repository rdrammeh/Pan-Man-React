import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ListView,
  Button,
  AsyncStorage,
  TouchableHighlight,
  } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import styles from './assets/Style'

import axios from 'react-native-axios';
import { createRootNavigator } from './router.js';
// import axios from 'axios';


//user is hardcoded right here - once login/register works remove this line
// AsyncStorage.setItem('userId', '3');
// AsyncStorage.removeItem('userId');

isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('userId')
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export class HomeScreen extends Component {

  constructor(){
    super()
    this.state = {
      signedIn: false,
      checkedSignIn: false
    }
  }

  componentWillMount() {
    isSignedIn()
      .then(res => {
        this.setState({ signedIn: res, checkedSignIn: true }
          )})
      .catch(err => {
        alert("An error occurred")
      });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}

AppRegistry.registerComponent('AwesomeProject', () => HomeScreen);
