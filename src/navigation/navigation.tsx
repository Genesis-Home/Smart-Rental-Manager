import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// local imports
import { colors } from "../utilities/constants";
import Splash from "../screens/Splash/index";
import Splash1 from "../screens/Splash/Splash1";
import Signin from "../screens/Auth/signin";
import Signup from "../screens/Auth/signup";
import ForgotPassword from "../screens/Auth/forgotPassword";
import ResetPassword from "../screens/Auth/resetPassword";

import { AppBottomNavigator } from "./BottomNavigation";

type RootStackParamList = {
  Splash: undefined;
  Splash1:undefined;
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Tabs: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.white },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          component={Splash}
          name="Splash"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={Splash1}
          name="Splash1"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={Signin}
          name="Signin"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={Signup}
          name="Signup"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={ForgotPassword}
          name="ForgotPassword"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={ResetPassword}
          name="ResetPassword"
        />
        <Stack.Screen options={{ headerShown: false }} name="Tabs" component={AppBottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
