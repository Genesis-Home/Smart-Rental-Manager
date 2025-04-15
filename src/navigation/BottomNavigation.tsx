import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../utilities/constants/screenResolution";


//Tabs

import HomeUser from "../screens/Home/HomeUser";
import HomeProfessional from "../screens/Home/HomeProfessional";

import Favorites from "../screens/Favorites";
import Search from "../screens/Search";
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";

import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../utilities/constants/colors";

type RootStackParamList = {
  HomeUser: undefined;
  HomeProfessional: undefined;
  Favorites1: undefined;
  Search1: undefined;
  Settings1: undefined;
  Profile1: undefined;
};

type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="HomeUser"
        component={HomeUser}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="HomeProfessional"
        component={HomeProfessional}
      />
    </Stack.Navigator>
  );
}

function FavoritesRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Favorites1"
        component={Favorites}
      />
    </Stack.Navigator>
  );
}

function SearchRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Search1"
        component={Search}
      />
    </Stack.Navigator>
  );
}

function SettingsRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Settings1"
        component={Settings}
      />
    </Stack.Navigator>
  );
}

function ProfileRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile1"
        component={Profile}
      />
    </Stack.Navigator>
  );
}

const TabIcon = ({
  focused,
  iconName,
}: {
  focused: boolean;
  iconName: string;
}) => (
  <View style={{ alignItems: "center" }}>
    <Icon
      name={iconName}
      size={RFValue(11, screenResolution.screenWidth)}
      color={Colors.Primary_01}
    />
    {focused && (
      <LinearGradient
        colors={[Colors.Gradient1_Start, Colors.Gradient1_End]}
        style={{
          position: "absolute",
          top: 28,
          width: RFValue(16, screenResolution.screenWidth),
          height: RFValue(3, screenResolution.screenHeight),
          borderRadius: 2,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    )}
  </View>
);

export function AppBottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.white,
          position: "absolute",
          margin: 20,
          borderTopWidth: 0,
          borderRadius: 12,
          shadowColor: Colors.Neutral_01,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeRoutes}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesRoutes}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="heart" />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchRoutes}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="search" />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsRoutes}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="settings" />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileRoutes}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
