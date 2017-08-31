import { StackNavigator, TabNavigator } from "react-navigation";

import LoginScreen from "./Users/Login.js";
import RegisterScreen from "./Users/Register.js";

import UserIndexScreen from "./Users/UserIndex.js";
import HighScoreScreen from "./results/HighScoreScreen.js";
import AwesomeProjectScreen from "./Game/game.js";


export const SignedOut = StackNavigator({
  SignUp: {
    screen: RegisterScreen,
    navigationOptions: {
      tabBarLabel: "Sign Up"
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      tabBarLabel: "Welcome Back!"
    }
  }
});

export const SignedIn = StackNavigator({
  Home: {
    screen: UserIndexScreen,
    navigationOptions: {
      tabBarLabel: "Home"
    }
  },
  Global: {
    screen: HighScoreScreen,
    navigationOptions: {
      tabBarLabel: "Highscores"
    }
  }
});

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      },
      AwesomeProject: {
        screen: AwesomeProjectScreen
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
