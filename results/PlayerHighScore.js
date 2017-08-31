import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native'

export default class PlayerHighScore extends Component {
  imageBuilder(i){
    return(
      <Image
        style={{width: 20, height: 20, marginTop:10}}
        source={images[i]}
      />
    )
  }

  render(){
    let {user, index} = this.props

    return <Text style={{color: colorText[index % colorText.length], bottom:50, fontSize:10, padding: 5,fontFamily:"Pixeled"}} >
      {index < 3 ? this.imageBuilder(index) : this.imageBuilder(index)}
      {user.user}..........{user.score}
      </Text>
      }
  }

let colorText = ["#18e5d6", "#ff6e1f", "#a5f658", "#9736ce", "#ff12ad"]
let images = [require('../assets/imgs/1.png'), require('../assets/imgs/2.png'), require('../assets/imgs/3.png')]
