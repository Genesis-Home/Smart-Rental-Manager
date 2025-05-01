import { PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { platform } from "../utilities/constants/index";

type WatchId = number | null;

type GeolocationResponse = any;
type GeolocationError = any;

export const checkLocationPermission = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (platform === "ios") {
      await Geolocation.requestAuthorization("always");
      startWatchingLocation(resolve, reject);
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startWatchingLocation(resolve, reject);
      } else {
        reject(new Error("Location permission denied!"));
      }
    }
  });
};

// Function to start watching the location
export const startWatchingLocation = (
  resolve: (position: GeolocationResponse) => void,
  reject: (error: GeolocationError) => void
): WatchId => {
  const watchId = Geolocation.watchPosition(
    (position: GeolocationResponse) => {
      // Real-time location updates
      resolve(position);
    },
    (error: GeolocationError) => {
      // Handle error (if any)
      reject(new Error("Location services are disabled"));
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 200,
      interval: 10000,
      fastestInterval: 5000,
    }
  );

  // Return the watchId so it can be used to stop the location watch later
  return watchId;
};

// Function to stop watching the location
export const stopWatchingLocation = (watchId: WatchId): void => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
  }
};
