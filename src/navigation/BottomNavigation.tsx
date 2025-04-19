import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../utilities/constants/screenResolution";
import { useTranslation } from "react-i18next";

// Screens
import Home from "../screens/Home/Home";
import Scheduled from "../screens/Scheduled";
import ExportData from "../screens/ExportData";
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";

import ApartmentDetails from "../screens/Home/ApartmentDetails";
import createContact from "../screens/Profile/CreateContact";
import AddSchedule from "../screens/Scheduled/AddSchedule";

import { colors } from "../utilities/constants";
import Colors from "../utilities/constants/colors";

// SVG Icons
import {
  Home as HomeIcon,
  HomeA as HomeIconActive,
  Contact as ContactIcon,
  ContactA as ContactIconActive,
  ExportData as ExportIcon,
  ExportDataA as ExportIconActive,
  Schedule as ScheduleIcon,
  ScheduleA as ScheduleIconActive,
  Setting as SettingIcon,
  SettingA as SettingIconActive,
} from "../assets/icons";

type RootStackParamList = {
  Home1: undefined;
  Scheduled1: undefined;
  ExportData1: undefined;
  Settings1: undefined;
  Profile1: undefined;
  ApartmentDetails: undefined;
  createContact: undefined;
  AddSchedule: undefined;
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
        name="Home1"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApartmentDetails"
        component={ApartmentDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ScheduledRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Scheduled1"
        component={Scheduled}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddSchedule}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ExportDataRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExportData1"
        component={ExportData}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SettingsRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings1"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile1"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="createContact"
        component={createContact}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function AppBottomNavigator() {
  const { t } = useTranslation();

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
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeRoutes}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIconActive width={24} height={24} />
            ) : (
              <HomeIcon width={24} height={24} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              {t("home")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Scheduled"
        component={ScheduledRoutes}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ScheduleIconActive width={24} height={24} />
            ) : (
              <ScheduleIcon width={24} height={24} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              {t("scheduled")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileRoutes}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ContactIconActive width={24} height={24} />
            ) : (
              <ContactIcon width={24} height={24} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              {t("contact")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ExportData"
        component={ExportDataRoutes}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ExportIconActive width={24} height={24} />
            ) : (
              <ExportIcon width={24} height={24} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              {t("exportData")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsRoutes}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingIconActive width={24} height={24} />
            ) : (
              <SettingIcon width={24} height={24} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(7, screenResolution.screenWidth),
                fontFamily: "Nunito-Bold",
              }}
            >
              {t("setting")}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
