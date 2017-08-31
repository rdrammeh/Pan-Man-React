/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import haversine from 'haversine'
import pick from 'lodash/pick'
const {width, height} = Dimensions.get('window')
import axios from 'react-native-axios'
import Coin from './coin'
import Ghost from './ghost'
import styles from '../assets/Style'
import { StackNavigator, TabNavigator } from 'react-navigation';

const SCREEN_HEIGTH = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATTITUDE_DELTA = 0.01
const LONGITUDE_DELTA = 0.01

const TIME = new Date ()
const TIME_NOW = ("2017-08-24 " + TIME.getHours() + ":" + TIME.getMinutes() + ":" + TIME.getSeconds())

export default class AwesomeProjectScreen extends Component {
  constructor() {
       super()
       this.state = {
         routeCoordinates: [],
         distanceTravelled: 0,
         prevLatLng: {},
         coinsCounter: 0,
         coords: [],
         gameOver: false,
         snappedPoints: [],
         origins: [],
         routes: [],
         userid: '',
         initialRegion: {
           latitude: 40.706571,
           longitude: -74.009048,
           latitudeDelta: LATTITUDE_DELTA,
           longitudeDelta: LONGITUDE_DELTA
         },
         score: 0

       }
       this.coinCollision = this.coinCollision.bind(this)
       this.playAgain = this.playAgain.bind(this)
       this.closeGame = this.closeGame.bind(this)
     }
  getMin = (mid, delta) => {
    return( ( (mid * 2) - delta ) / 2 );
  }

  getMax = ( min, delta ) => {
    return  min + delta;
  }

  coinCollision = (id) => {

    let { coinsCounter} = this.state
    coinsCounter ++
    score = (coinsCounter + 1) * this.state.distanceTravelled * 100
    this.setState({ coinsCounter, score: score })


  }

  ghostCollision = () => {
    AsyncStorage.getItem("gameId").then((value) => {
       AsyncStorage.getItem("userId").then( (user_id) => {
         axios.put('https://phatpac.herokuapp.com/games/' + value ,{
           game:{
             user: user_id,
             score: this.state.score
           }
         })
        .then((response) => {
           AsyncStorage.removeItem("gameId")
        })
        .catch(function (error) {
           console.log(error)
        })
      })
    })
    this.setState({gameOver: true})
  }

  componentDidMount() {
     let _this = this
     this.watchID = navigator.geolocation.watchPosition((position) => {
       const { routeCoordinates, distanceTravelled } = this.state
       const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }
       const positionLatLngs = pick(position.coords, ['latitude', 'longitude'])
       _this.setState({
         routeCoordinates: routeCoordinates.concat(positionLatLngs),
         distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
         prevLatLng: newLatLngs,
         user: { latitude: position.coords.latitude, longitude: position.coords.longitude }
       })
     });

     navigator.geolocation.getCurrentPosition( (position) => {
         let coords = []
         _this = this
         for (var i = 0; i < 30 ; i++) {
           coords.push( ( (Math.random() * LATTITUDE_DELTA) +
            this.getMin( position.coords.latitude, LATTITUDE_DELTA ) )   +
            "," +
            ( (Math.random() * LONGITUDE_DELTA)  +
            this.getMin( position.coords.longitude, LONGITUDE_DELTA ) ) );
         }

         this.setState({coords: coords,
           initialRegion: {
             latitude: parseFloat(position.coords.latitude),
             longitude: parseFloat(position.coords.longitude),
             latitudeDelta: LATTITUDE_DELTA,
             longitudeDelta: LONGITUDE_DELTA
         }})
         this._map.animateToCoordinate({
           latitude: parseFloat(position.coords.latitude),
           longitude: parseFloat(position.coords.longitude)} ,1)

         axios.get('https://roads.googleapis.com/v1/nearestRoads?points=' + this.state.coords.join("|") + '&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
         .then( (response) => {

           var origins = response.data.snappedPoints.slice(0,3)
           this.setState({snappedPoints: response.data.snappedPoints, origins: origins })
           console.log("snappedPoints", this.state.snappedPoints)

           let promises = this.state.origins.map((origin)=> {

             let index = Math.floor( (Math.random() * this.state.snappedPoints.length ))
             let { latitude, longitude } = this.state.snappedPoints[index].location
             let wayPoints = []

             for (var i = 0; i < 15; i++) {
               let n = Math.floor( (Math.random() * this.state.snappedPoints.length ))
                wayPoints.push( this.state.snappedPoints[n].location.latitude + "," + this.state.snappedPoints[n].location.longitude)
              }

              return  (axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.location.latitude + ',' + origin.location.longitude + '&destination=' + latitude + ',' + longitude + '&waypoints=' + wayPoints.join("|") + '&mode=walking&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8' ))
            })

            let routes = []

             Promise.all(promises)
             .then((responses) => {
               responses.map((response)=>{
                 let targets = [];
                 response.data.routes[0].legs.forEach( function ( leg ) {
                   leg.steps.forEach( function ( step ){
                      targets.push( step.end_location )
                     })
                   });
                 routes.push(targets)
                 this.setState({routes: routes})
                })
                console.log("routes",this.state.routes)
             })
          })

      },(error) => alert(error.message),{
           enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
    })
   }

  componentWillUnmount() {
     navigator.geolocation.clearWatch(this.watchID);
    }

  calcDistance = (newLatLng) => {
       const { prevLatLng } = this.state
       return (haversine(prevLatLng, newLatLng) || 0)
     }

  closeGame = () => {
   AsyncStorage.getItem("gameId").then((value) => {
      AsyncStorage.getItem("userId").then( (user_id) => {
        axios.delete('https://phatpac.herokuapp.com/games/' + value.toString() ,{
            game:{
              user: user_id
          }
        })
        .then((response) => {
        })
        .catch(function (error) {
          console.log(error)
        })
      })
    })
    AsyncStorage.removeItem("gameId")
    this.props.navigation.navigate("Home")
  }

  playAgain = () => {
    // debugger
      AsyncStorage.getItem("userId").then( (user_id) => {
       axios.post('https://phatpac.herokuapp.com/games', {game: {
         user: parseInt(user_id),
         score: 0
        }
       })
       .then((response) => {
         let game = response.data.id
         AsyncStorage.setItem('gameId', JSON.stringify(game)).then(() => {
           console.log(this)
           this.props.navigation.navigate('AwesomeProject')
         })
       })
       .catch(function (error) {
         console.log(error)
       })
     })
  };

  render() {
        let initialRegion = this.state.initialRegion.latitude === 0 ? {
          latitude: 40.706571,
          longitude: -74.009048,
          latitudeDelta: LATTITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        } : this.state.initialRegion

       if  (this.state.gameOver) {
         return (
          <View style={styles.defeatContainer}>
            <View style={{top:150}}>
              <Text style={[styles.globalFont, {bottom:35}]}>Game Over!</Text>
              <Text style={styles.globalFont}> Points : { this.state.score} </Text>
              <Text style={styles.globalFont}> Distance ran : { this.state.distanceTravelled.toFixed(2) }km </Text>
            </View>
            <Image source={require('../assets/imgs/defeat.gif')} style={{width:300, height:180,top:250}} />

            <View style={{flex: 1, flexDirection: 'row',alignItems:"center",top:50}}>
              <Image source={require('../assets/imgs/insta.png')} style={{width:60, height:60}}/>
              <Text style={styles.globalFont}>Pan</Text>
              <Image source={require('../assets/imgs/snapchat.png')} style={{width:50, height:50}}/>
              <Text style={styles.globalFont}>Pan</Text>
            </View>

            <View style={{bottom:60}}>
              <TouchableHighlight onPress={() => this.props.navigation.navigate('Home')}>
                <Text style={styles.globalFont}>Home</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.playAgain}>
                <Text style={styles.globalFont}>Play Again?</Text>
              </TouchableHighlight>
          </View>
        </View>
        )
            } else {
          return (
           <View style={styles.container}>
             <MapView
              showsMyLocation={true}
              showsBuildings={false}
              showsIndoors={false}
              fillColor={'#fefff5'}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              followsUserLocation={true}
              style={styles.map}
              showsUserLocation={true}
              initialRegion={initialRegion}
              ref={(map)=> this._map = map}
              minZoomLevel={0}
              rotateEnabled={false}
              pitchEnabled={false}
              // loadingEnabled={true}
              // scrollEnabled={true}
              // onRegionChange={this.onRegionChange}
              // onRegionChangeComplete={this.onRegionChangeComplete}
             >

               {this.state.snappedPoints.map((coord, i) => {
                 return(
                    <Coin key={i} id={i} user={this.state.user} coord={coord.location} coinCollision={this.coinCollision} />
                  )}
                )}

              {this.state.origins.length === this.state.routes.length ?
                  this.state.routes.map((route, i ) => {
                    return(
                      <Ghost key={i} route={route} gameOver={this.state.gameOver} ghostCollision={this.ghostCollision} origin={this.state.origins[i]} id={i} user={this.state.user} coins={this.state.snappedPoints} />
                  )}
                ) : null }

             </MapView>

             <View style={styles.titleBar}><Text style={styles.titleBarText}>PanMan</Text>
               <View style={[styles.xCircle, {bottom:45, left:350}]}>
                <TouchableHighlight onPress={this.closeGame}>
                  <Text style={[styles.globalFont, {bottom:8,left:10,color:"red",fontSize:20}]} >x</Text>
                </TouchableHighlight>
              </View>
              </View>
                <View style={styles.scoreBar}>
               <View style={styles.scoreBarGroup}>
                 <Text style={[styles.scoreBarHeader, styles.globalFont, {fontSize:10}]}>Followers: {Math.floor(this.state.distanceTravelled* 10)}</Text>
                 <Text style={[styles.scoreBarContent,styles.globalFont, {fontSize:10}]}>Likes: {this.state.coinsCounter}</Text>
                 {/* {this.state.gameOver ? this.playAgainButton() :  <Text> GAME ON </Text> } */}
               </View>
             </View>
           </View>
         )
       }
     }
   }

   mapStyle = [
    {
     "elementType": "geometry",
     "stylers": [
       {
         "color": "#1d2c4d"
       }
     ]
    },
    {
     "elementType": "labels",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#8ec3b9"
       }
     ]
    },
    {
     "elementType": "labels.text.stroke",
     "stylers": [
       {
         "color": "#1a3646"
       }
     ]
    },
    {
    "featureType": "administrative",
     "elementType": "geometry",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "administrative.country",
     "elementType": "geometry.stroke",
     "stylers": [
       {
         "color": "#4b6878"
       }
     ]
    },
    {
     "featureType": "administrative.land_parcel",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "administrative.land_parcel",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#64779e"
       }
     ]
    },
    {
     "featureType": "administrative.neighborhood",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "administrative.province",
     "elementType": "geometry.stroke",
     "stylers": [
       {
         "color": "#4b6878"
       }
     ]
    },
    {
     "featureType": "landscape.man_made",
     "elementType": "geometry.stroke",
     "stylers": [
       {
         "color": "#334e87"
       }
     ]
    },
    {
     "featureType": "landscape.natural",
     "elementType": "geometry",
     "stylers": [
       {
         "color": "#023e58"
       }
     ]
    },
    {
     "featureType": "poi",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "poi",
     "elementType": "geometry",
     "stylers": [
       {
         "color": "#283d6a"
       }
     ]
    },
    {
     "featureType": "poi",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#6f9ba5"
       }
     ]
    },
    {
     "featureType": "poi",
     "elementType": "labels.text.stroke",
     "stylers": [
       {
         "color": "#1d2c4d"
       }
     ]
    },
    {
     "featureType": "poi.park",
     "elementType": "geometry.fill",
     "stylers": [
       {
         "color": "#023e58"
       }
     ]
    },
    {
     "featureType": "poi.park",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#3C7680"
       }
     ]
    },
    {
     "featureType": "road",
     "elementType": "geometry",
     "stylers": [
       {
         "color": "#304a7d"
       }
     ]
    },
    {
     "featureType": "road",
     "elementType": "labels.icon",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "road",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#98a5be"
       }
     ]
    },
    {
     "featureType": "road",
     "elementType": "labels.text.stroke",
     "stylers": [
       {
         "color": "#1d2c4d"
       }
     ]
    },
    {
     "featureType": "road.arterial",
     "elementType": "geometry.fill",
     "stylers": [
       {
         "color": "#000101"
       }
     ]
    },
    {
     "featureType": "road.highway",
     "elementType": "geometry",
     "stylers": [
       {
         "color": "#2c6675"
       }
     ]
    },
    {
     "featureType": "road.highway",
     "elementType": "geometry.fill",
     "stylers": [
       {
         "color": "#020200"
       }
     ]
    },
    {
     "featureType": "road.highway",
     "elementType": "geometry.stroke",
     "stylers": [
       {
         "color": "#020200"
       }
     ]
    },
    {
     "featureType": "road.highway",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#b0d5ce"
       }
     ]
    },
    {
     "featureType": "road.highway",
     "elementType": "labels.text.stroke",
     "stylers": [
       {
         "color": "#023e58"
       }
     ]
    },
    {
     "featureType": "road.local",
     "elementType": "geometry.fill",
     "stylers": [
       {
         "color": "#000101"
       }
     ]
    },
    {
     "featureType": "transit",
     "stylers": [
       {
         "visibility": "off"
       }
     ]
    },
    {
     "featureType": "transit",
     "elementType": "labels.text.fill",
     "stylers": [
       {
         "color": "#98a5be"
       }
     ]
    },
    {
     "featureType": "transit",
     "elementType": "labels.text.stroke",
     "stylers": [
       {
         "color": "#1d2c4d"
       }
     ]
    },
    {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a "
      }
    ]
   },
    {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762 "
      }
    ]
   },
    {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626 "
      }
    ]
   },
    {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70 "
      }
    ]
  },
]
