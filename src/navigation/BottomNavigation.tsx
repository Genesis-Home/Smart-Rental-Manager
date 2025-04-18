import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../utilities/constants/screenResolution";

// Tabs
import Home from "../screens/Home/Home";
import Scheduled from "../screens/Scheduled";
import ExportData from "../screens/ExportData";
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";
import ApartmentDetails from "../screens/Home/ApartmentDetails";

import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../utilities/constants/colors";
import { colors } from "../utilities/constants";

type RootStackParamList = {
  Home1: undefined;
  Scheduled1: undefined;
  ExportData1: undefined;
  Settings1: undefined;
  Profile1: undefined;
  ApartmentDetails:undefined
};

type TabParamList = {
  Home: undefined;
  Scheduled: undefined;
  ExportData: undefined;
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
        name="Home1"
        component={Home}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ApartmentDetails"
        component={ApartmentDetails}
      />
    </Stack.Navigator>
  );
}

function ScheduledRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Scheduled1"
        component={Scheduled}
      />
    </Stack.Navigator>
  );
}

function ExportDataRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="ExportData1"
        component={ExportData}
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
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    {focused && (
      <LinearGradient
        colors={[Colors.Primary_01, Colors.Primary_01]}
        style={{
          position: "absolute",
          top: -8,
          width: RFValue(25, screenResolution.screenWidth),
          height: RFValue(1, screenResolution.screenHeight),
          borderRadius: 2,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    )}
    <Icon
      name={iconName}
      size={RFValue(12, screenResolution.screenWidth)}
      color={focused ? Colors.Primary_01 : "gray"}
    />
  </View>
);

export function AppBottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              Home
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Scheduled"
        component={ScheduledRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="calendar-outline" />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              Scheduled
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              Contact
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="ExportData"
        component={ExportDataRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="arrow-down-circle-outline" />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              Export Data
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="settings" />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              Setting
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
