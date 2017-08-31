import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Button,
  AsyncStorage,
  AppRegistry,
  TouchableHighlight,

  } from 'react-native';

import styles from '../assets/Style'
import { StackNavigator } from 'react-navigation';
import axios from 'react-native-axios';

export default class LoginScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      userID: '',
    }
    this.login = this.login.bind(this);
  }



  static navigationOptions = {
    title: 'Welcome Back',
  };

  login = () => {
    axios.post('https://phatpac.herokuapp.com/sessions', {login: {
      email: this.state.email,
      password: this.state.password}
    })
    .then((response) => {
      let user = response.data.id.toString();
      this.setState({ userID: user });
      AsyncStorage.setItem('userId', this.state.userID)
      this.props.navigation.navigate("Home")
    })
    .catch(function (error) {
      console.log(error)
    })

  };


  render() {
    return (
      <View style={styles.loginContainer}>
          <Text style={[styles.globalFont,{padding:10}]}>Email</Text>
          <TextInput autoCapitalize="none"
            style={styles.textInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <Text style={[styles.globalFont,{padding:10}]}>Password</Text>
          <TextInput autoCapitalize="none"
            style = {styles.textInput}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />

          <TouchableHighlight onPress={() => this.login() }>
            <Text style={[styles.globalFont,{textAlign:"center",color:"yellow"}]}>Login </Text>
          </TouchableHighlight>
      </View>
    );
  }
}
