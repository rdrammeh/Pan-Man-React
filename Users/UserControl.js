import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Container,
  TextInput,
  Label,
  Text,
  View,
  Button,
  } from 'react-native';

import LoginScreen from './Login.js';
import RegisterScreen from './Register.js';
import { StackNavigator, TabNavigator } from 'react-navigation';


export default class UserControlScreen extends Component {

  loginView(){
    this.setState({view: <LoginScreen /> })
  }

  constructor(){
    super()
    this.loginView = this.loginView.bind(this)

    this.state = {
      view: <RegisterScreen press={this.loginView}  />
    }

  }

  render(){

    return (
      <View>

      </View>
      )
  }
}
