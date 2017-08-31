import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import styles from '../assets/Style'

const TIME = new Date ()
const START_TIME = (TIME.getHours() + ":" + TIME.getMinutes() + ":" + TIME.getSeconds())

export default class AwesomeProjectScreen extends Component {
  constructor() {
       super()
       this.state = {
         userid: ''

       }

     }
