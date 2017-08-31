import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native'

import PlayerHighScore from './PlayerHighScore';
import axios from 'react-native-axios'
import styles from '../assets/Style'

export default class HighScore extends Component {

  constructor(){
    super()
    this.state = {
      highscore: []
    }
  }
  componentWillMount(){
    axios.get('https://phatpac.herokuapp.com/scores')
    .then((response) => {
      this.setState({highscore: response.data})
    })
  }

  static navigationOptions = {
      title: "Global Highscores",
  };

  render(){
    return (
      <ScrollView contentContainerStyle={[styles.contentContainer, styles.highScoreContainer]}>
        <Text style={styles.highScoreText}>High Score</Text>
          <View style={styles.PlayersScoreContainer}>
            {this.state.highscore.map(function(user,i) {
              return (
                <PlayerHighScore
                  key={i}
                  user={user}
                  index={i}
                />
              )
            }
          )
        }
      </View>
      <Image source={require('../assets/imgs/ghost.png')} style={{width:220, height:50}}/>
    </ScrollView>
    )
  }
}
