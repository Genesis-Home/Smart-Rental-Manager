import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type GeolocationResponse = any;
type GeolocationError = any;

export const checkLocationPermission = async (): Promise<GeolocationResponse> => {

const {t} = useTranslation();
  return new Promise(async (resolve, reject) => {
    try {
      let fine, coarse;

      if (Platform.OS === 'android') {
        fine = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        coarse = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);

        if (fine !== RESULTS.GRANTED && coarse !== RESULTS.GRANTED) {
          
          Alert.alert(
             t('locationRequired'),
            t('locationEnableMessage'),
            [
              {
                text: t('openSettings'),
                onPress: async () => {
                  await openSettings();
                },
              },
              {
                text: t('cancel'),
                style: 'cancel',
              },
            ],
            { cancelable: true }
          );


          return reject(new Error('Permission not granted'));
        }
      }

      // ✅ Agar permission mil gai tu location fetch karo
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          resolve(position);
        },
        (error) => {
          console.log('Error Code:', error.code);
          console.log('Error Message:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    } catch (error) {
      console.log('Permission check error:', error);
      reject(error);
    }
  });


  

  
};


