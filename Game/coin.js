
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import haversine from 'haversine'

export default class Coin extends Component {
  constructor(){
    super()
    this.state = {
    claimed: false
    }
  }

  // componentDidMount(){
  //   console.log('Coin id: ' + this.props.id + ' updated')
  // }

  isNear(){
    console.log("checking")
    latProximity = Math.abs(Math.abs(this.props.coord.latitude) - Math.abs(this.props.user.latitude))
    lngProximity = Math.abs(Math.abs(this.props.coord.longitude) - Math.abs(this.props.user.longitude))

    return latProximity < 0.00045 && lngProximity < 0.00045
  }

  componentDidUpdate(nextProps) {
    if (this.isNear() && this.state.claimed === false){
      this.props.coinCollision()
      console.log("claimed")
      this.setState({claimed: true})

    }
    // console.log('Coin id: ' + this.props.id)
  }

  render() {
    let coord = this.props.coord ? this.props.coord : {longitude: 40, longitude: -73}
    let images = [require('../assets/imgs/tweet.png'), require('../assets/imgs/like.png')]
    if (this.state.claimed){
      return (
        <MapView.Marker coordinate={this.props.coord} anchor={{ x: 0.5, y: 0.5 }} flat={true} image={''}
      />
      )
    }
    return (
        <MapView.Marker
          coordinate={this.props.coord}
          anchor={{ x: 0.5, y: 0.5 }}
          flat={true}
          image={images[Math.round(Math.random())]}
      />
    )
  }
}
