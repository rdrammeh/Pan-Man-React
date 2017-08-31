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
import styles from '../assets/Style'
import axios from 'react-native-axios';

const TIME = new Date ()
const START_TIME = ("2017-08-24 " + TIME.getHours() + ":" + TIME.getMinutes() + ":" + TIME.getSeconds())
AsyncStorage.removeItem('userId')
AsyncStorage.setItem('userId', "9")

export default class UserIndexScreen extends Component {

  constructor(){
    super()
    this.state = {
      userid: "",
      username: "",
      highscorePoints: "",
      highscoreDate: "",
      recentGames: []
    }
  }

  componentDidMount() {

    AsyncStorage.getItem("userId").then((value) => {
      this.setState({userid: value});
      console.log('https://phatpac.herokuapp.com/users/' + this.state.userid )
      axios.get('https://phatpac.herokuapp.com/users/' + this.state.userid )
        .then((response) => {
        let games = response.data.map((game) => {
          return game
        })
        games.pop();
        this.setState({
          highscorePoints: response.data[0].highscore_score,
          highscoreDate: response.data[0].highscore_date,
          username: response.data[response.data.length-1].username,
          recentGames: games
        })
        console.log(games)
      })
      .catch((errors) => {
        console.log(errors)
      });
    }).done();
  }

  static navigationOptions = {
    title: "Stats",
  };

  createGame = () => {
       axios.post('https://phatpac.herokuapp.com/games', {game: {
         user: parseInt(this.state.userid),
         start_time: TIME,
         end_time: TIME,
         score: 0,
          }
       })
       .then((response) => {
         let game = response.data.id
         AsyncStorage.setItem('gameId', JSON.stringify(game))
         this.props.navigation.navigate("AwesomeProject")
       })
       .catch(function (error) {
         console.log(error)
       })
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.homeContainer}>
        <View style={[styles.userStats,{top:1}]}>
          <Text style={[styles.globalFont,{textAlign:"center"}]}> Hello, {this.state.username}!</Text>
          <Text style={styles.homeScreenText}> Personal Best:{"\n"} { this.state.highscorePoints ? this.state.highscorePoints + " Points On " : "No games played yet"} {this.state.highscoreDate  ? this.state.highscoreDate : ""} </Text>
          <Text style={styles.homeScreenText}> Recent Games: </Text>
            {this.state.recentGames.map((game, i) => {
              return <Text key={i} style={styles.homeScreenText}>     Points: {game.score}{"\n"}     Duration: {game.duration}{"\n"}     Played On: {game.created_at}</Text>
            })}
        </View>
        <View style={{alignItems:"center", justifyContent:"center"}}>
          <TouchableHighlight onPress={() => navigate('Global')} style={[styles.buttonStyle, {padding:10,justifyContent:"center"}]}>
            <Text style={[styles.homeScreenText, styles.textYellow]}>High Scores</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.createGame} style={[styles.buttonStyle, {padding:25,justifyContent:"center"}]}>
            <Text style={[styles.homeScreenText, styles.textYellow]}>New Game</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
