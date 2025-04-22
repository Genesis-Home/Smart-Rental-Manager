import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../utilities/constants/screenResolution";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";

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
              <>
                <LinearGradient
                  colors={[Colors.Primary_01, Colors.Primary_01]}
                  style={{
                    position: "absolute",
                    top: -6,
                    width: RFValue(60, screenResolution.screenHeight),
                    height: 1,
                    borderRadius: 2,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <HomeIconActive width={22} height={22} />
              </>
            ) : (
              <HomeIcon width={22} height={22} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(9.5, screenResolution.screenHeight),
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
              <>
                <LinearGradient
                  colors={[Colors.Primary_01, Colors.Primary_01]}
                  style={{
                    position: "absolute",
                    top: -6,
                    width: RFValue(60, screenResolution.screenHeight),
                    height: 1,
                    borderRadius: 2,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <ScheduleIconActive width={22} height={22} />
              </>
            ) : (
              <ScheduleIcon width={22} height={22} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(9.5, screenResolution.screenHeight),
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
              <>
                <LinearGradient
                  colors={[Colors.Primary_01, Colors.Primary_01]}
                  style={{
                    position: "absolute",
                    top: -6,
                    width: RFValue(60, screenResolution.screenHeight),
                    height: 1,
                    borderRadius: 2,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <ContactIconActive width={22} height={22} />
              </>
            ) : (
              <ContactIcon width={22} height={22} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(9.5, screenResolution.screenHeight),
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
              <>
                <LinearGradient
                  colors={[Colors.Primary_01, Colors.Primary_01]}
                  style={{
                    position: "absolute",
                    top: -6,
                    width: RFValue(60, screenResolution.screenHeight),
                    height: 1,
                    borderRadius: 2,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <ExportIconActive width={18} height={18} />
              </>
            ) : (
              <ExportIcon width={18} height={18} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(9.5, screenResolution.screenHeight),
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
              <>
                <LinearGradient
                  colors={[Colors.Primary_01, Colors.Primary_01]}
                  style={{
                    position: "absolute",
                    top: -6,
                    width: RFValue(60, screenResolution.screenHeight),
                    height: 1,
                    borderRadius: 2,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <SettingIconActive width={22} height={22} />
              </>
            ) : (
              <SettingIcon width={22} height={22} />
            ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.Primary_01 : "gray",
                fontSize: RFValue(9.5, screenResolution.screenHeight),
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
