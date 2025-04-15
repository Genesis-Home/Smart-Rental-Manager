import DeviceInfo from 'react-native-device-info';
import {Platform, StatusBar} from 'react-native';

export const DEFAULT_LANGUAGE: string = 'en';
export {default as colors} from './colors';

export const paginationLimit: number = 10;

export const version: string = DeviceInfo.getVersion();
export const systemVersion: string = DeviceInfo.getSystemVersion();
export const platform: string = Platform.OS;
export const deviceUId: any = DeviceInfo.getUniqueId();
export const deviceType: string = DeviceInfo.getDeviceType();
export const hasNotch: boolean = DeviceInfo.hasNotch();
export const statusBarHeight: any =
  Platform.OS === 'android' ? StatusBar.currentHeight : StatusBar.currentHeight;
