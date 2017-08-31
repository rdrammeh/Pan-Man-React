import { StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window')
export default StyleSheet.create({

  globalFont: {
    fontFamily: 'Pixeled',
    color:'white',
    shadowColor: '#000',
  },
  // Css for HighScoreScreen.js
  highScoreText: {
    color: 'white',
    bottom:50,
    fontSize:20,
    fontFamily:'Pixeled'
  },
  PlayersScoreContainer:{
    justifyContent: 'flex-start',
  },
  highScoreContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#182445',
  },
  // Css for Map.js
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleBar: {
    backgroundColor: '#0a0f1e',
    height: 64,
    width: width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  titleBarText: {
    fontFamily:'Pixeled',
    color: 'white',
    fontSize: 16,
    fontWeight: "700",
    textAlign: 'center',
    paddingTop: 10
  },
  map: {
    flex:1,
    width: width,
    height: height
  },
  scoreBar: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    backgroundColor: '#0a0f1e',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  scoreBarGroup: {
    flex: 1
  },
  scoreBarHeader: {
    color: '#fff',
    fontWeight: "400",
    textAlign: 'center',
    flex:1
  },
  scoreBarContent: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: '#f44242',
    textAlign: 'center'
  },
  // CSS for log in
  textInput: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#FFF',
  },
  loginContainer:{
    flex: 1,
    backgroundColor: '#182445',
    justifyContent: 'center',
  },
  loginTextInfo:{
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Pixeled'
  },
  // Homepage Css
  homeContainer:{
    flex: 1,
    backgroundColor: '#182445',
    justifyContent: 'center',
  },
  homeScreenText: {
    textAlign:"center",
    color:"white",
    fontSize:10,
    padding: 5,
    fontFamily: "Pixeled"
  },
  homeScreenNav:{
    color:"white",
    fontSize:10,
    padding: 5,
    fontFamily: "Pixeled",
    textAlign: "center",
  },
  userStats:{
    bottom:80,
    justifyContent: 'center',
  },
  textYellow:{
    color:"yellow"
  },
  //Defeat screen
  defeatContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  gameOver:{
    fontFamily: 'Pixeled',
    color:'white',
    top:50,
  },
  textInput: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#FFF',
  },
// Button style
  buttonStyle:{
    flex:1,
    width:150,
    height:100,
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:25,
    paddingBottom:30,
    backgroundColor:'rgba(0, 0, 0, 0.3)',
    borderRadius:10,
  },
  // scroll View
  contentContainer: {
    paddingVertical: 20,
    alignItems: "flex-start",
    backgroundColor:"black",
    flex:1
  },
  //X button Circle
  xCircle:{
    width: 40,
    height: 40,
    borderRadius: 100/2,
    borderColor: "red"
  }
});
