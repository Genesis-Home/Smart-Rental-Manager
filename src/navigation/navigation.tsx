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
import AddProperty from "../screens/Home/AddProperty";
import Notification from "../screens/Home/Notification";
import AutomatedEmail from "../screens/Scheduled/AutomatedEmail";
import MyAds from "../screens/Settings/MyAds";
import Map from "../screens/Home/Map";
import EditProfile from "../screens/Settings/EditProfile";
import PrivacyPolicy from "../screens/Settings/PrivacyPolicy";
import TermsAndConditions from "../screens/Settings/TermsAndConditions";
import EditProperty from "../screens/EditProperty";
import { AppBottomNavigator } from "./BottomNavigation";
import { RootStackParamList } from "../types/types";
import ViewPDF from "../screens/Scheduled/ViewPDF";

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
        <Stack.Screen
          options={{ headerShown: false }}
          component={AddProperty}
          name="AddProperty"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={Notification}
          name="Notification"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={AutomatedEmail}
          name="AutomatedEmail"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={Map}
          name="Map"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={EditProfile}
          name="EditProfile"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={MyAds}
          name="MyAds"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={TermsAndConditions}
          name="TermsAndConditions"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={PrivacyPolicy}
          name="PrivacyPolicy"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={EditProperty}
          name="EditProperty"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={ViewPDF}
          name="ViewPDF"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Tabs"
          component={AppBottomNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
