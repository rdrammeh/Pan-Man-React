import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'react-native-axios';

export default class Ghost extends Component {
  constructor() {
    super();
    this.state = {
      location: {latitude: 0, longitude: 0},
      target: {lat: 0, lng: 0},
      targetCount: 0,
      route: []
    };

    this.moveGhost = this.moveGhost.bind(this);
    this.changeTarget = this.changeTarget.bind(this);
    this.changeCoords = this.changeCoords.bind(this);
  };

  findLatitude = ( newLong, xa, ya, xb, yb ) => {
      var slope = (yb-ya)/(xb-xa)
      return (slope * (newLong- xa)) + ya
    }


  changeCoords = ()=> {
    let {latitude, longitude} = this.state.location ? this.state.location :{};
    let {lat, lng} = this.state.target ? this.state.target : {};
    let factor;

    longitude > lng ? factor = -1 : factor = 1;

    let newLongitude = longitude + (0.00005 * factor);
     let newLatitude = this.findLatitude( newLongitude, longitude, latitude, lng, lat)

    this.setState({location: {latitude:  newLatitude, longitude: newLongitude }})
  }

  getWayPoints = () => {
    let wayPoints = []

    for (var i = 0; i < 20; i++) {
      let n = Math.floor( (Math.random() * this.propssnappedPoints.length ) - 1 )
      wayPoints.push( this.props.snappedPoints[n].location.latitude + "," + this.props.snappedPoints[n].location.longitude)
    }
    return wayPoints
  }



  changeTarget = () => {
    let route = this.props.route ? this.props.route : [];
    let targetCount = this.props.route ? this.state.targetCount + 1 : 0;
    let target = this.props.route ? this.props.route[targetCount] : {lat: 0, lng: 0};

    this.setState({targetCount: targetCount, target: target });

  }

  moveGhost = () => {
    console.log("moving")
    let {latitude, longitude} = this.state.location ? this.state.location : {};
    let {lat, lng} = this.state.target ? this.state.target : {};
    Math.abs(longitude - lng) < 0.0001 ? this.changeTarget() : this.changeCoords()
  }

  isNear = () => {
    latProximity = Math.abs(Math.abs(this.state.location.latitude) - Math.abs(this.props.user.latitude))
    lngProximity = Math.abs(Math.abs(this.state.location.longitude) - Math.abs(this.props.user.longitude))

    return latProximity < 0.00045 && lngProximity < 0.00045
  }

  componentWillReceiveProps(nextProps) {

    this.props.gameOver ?  null : (this.isNear() ? this.props.ghostCollision() : '')
  }

  componentDidMount(){
    let {location} = this.props.origin ? this.props.origin :  {latitude: 0, longitude: 0}
    let route = this.props.route ? this.props.route : []
    let target = this.props.route[0] ? this.props.route[0] : {lat: 0, lng: 0}

    this.setState({location: location, route: route, target: target})
    pId = setInterval(this.moveGhost, 500);
    this.setState({pId})
  }

  componentWillUnmount(){
    clearInterval(this.state.pId)
      this.setState({pId: false})
  }

  render(){
    return (
      <MapView.Marker coordinate={this.state.location} anchor={{ x: 0.5, y: 0.5 }} flat={true} image={require('../assets/imgs/ghostG.png')} />
    )
  }
}
