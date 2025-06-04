import { NavigationProp } from "@react-navigation/native";
import { TextInputProps } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import rootReducer from "../store/reducers/rootReducer";
import { RouteProp } from "@react-navigation/native";
import { GooglePlaceData as GooglePlaceDataAutocomplete } from "react-native-google-places-autocomplete";

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Splash1: undefined;
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EditProfile:undefined;
  ResetPassword: undefined;
  MyAds:undefined;
  Tabs: {
    screen?: string;
    params?: {
      screen?: string;
      params?: { id?: string };
    };
  };
  AddProperty: undefined;
  Notification: undefined;
  AutomatedEmail: {
    visitDetails: {
      visitDates: string;
      visitTime: string;
      numberOfVisitors: string;
      numberOfInfants: string;
      location: Location;
    };
  };
  Map: { location: Location };
  EditProperty: { id: string };
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  Home: {
    screen?: string;
    params?: {
      id?: string;
    };
  };
  Scheduled: undefined;
  ExportData: undefined;
  Profile: undefined;
  createContact: undefined;
  AddSchedule: undefined;
  ApartmentDetails: { id: string };
};

export type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;

export type RootStackParamListBottomNavigation = {
  Home1: undefined;
  ApartmentDetails: { id: string };
  Scheduled1: undefined;
  AddSchedule: undefined;
  ExportData1: undefined;
  Settings1: undefined;
  Profile1: undefined;
  createContact: undefined;
};

export interface MarkerProps {
  latitude: number;
  longitude: number;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export type TabParamList = {
  Home: undefined;
  Scheduled: undefined;
  ExportData: undefined;
  Settings: undefined;
  Profile: undefined;
};

// Component Props Types
export interface HeaderProps {
  title: string;
  isAutomatedEmail?: boolean;  
}

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string | boolean;
  showToggle?: boolean;
  onToggleSecure?: () => void;
}

export interface CTAButton1Props {
  title: string;
  submitHandler: () => void;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

// Screen Props Types
export interface SplashProps {
  navigation: NavigationProp<any, any>;
}

export interface Splash1ScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList, "Splash1"> {}

export interface SignInProps {
  navigation: any;
}

export interface SignUpProps {
  navigation: any;
}

export interface ForgotPasswordProps {
  navigation: any;
}

export interface ResetPasswordProps {
  navigation: any;
}
export interface NotificationScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface AddPropertyProps {
  navigation: any;
}

export interface HomeScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface Contact {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
}

export interface CreateContactScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface EditProfileProps {
  navigation: any;
}
export interface EditPropertyProps {
  navigation: any;
}
export interface AddPropertyProps {
  navigation: any;
}

export interface SettingNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface AddScheduleProps {
  navigation: any;
}

export interface ScheduledScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface Day {
  day: string;
  number: number;
}

export interface ExportScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

// Firebase Types
export type Translations = {
  [key: string]: string;
};

// Language Types
export type CalendarData = {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  today: string;
};

export type LanguageTranslation = {
  welcome: string;
  trackVisits: string;
  loginEmailPrompt: string;
  registerEmailPrompt: string;
  pleaseLoginHere: string;
  emailAddress: string;
  agencyName: string;
  ownerName: string;
  email: string;
  password: string;
  forgotPassword: string;
  rememberme: string;
  donthaveaccount: string;
  recoverAccount: string;
  signup: string;
  or: string;
  signIn: string;
  pleaseRegisterHere: string;
  fullname: string;
  confirmpassword: string;
  role: string;
  alreadyhaveanaccount: string;
  resetpassword: string;
  enteryouremail: string;
  rememberyourpassword: string;
  sendOtp: string;
  changePassword: string;
  enternewpassword: string;
  invalidEmail: string;
  emailRequired: string;
  passwordRequired: string;
  passwordMin: string;
  fullnameRequired: string;
  roleRequired: string;
  confirmpasswordRequired: string;
  passwordsDoNotMatch: string;
  agencyNameRequired: string;
  ownerNameRequired: string;
  passwordsMustMatch: string;
  resetEmail: string;
  sendEmail: string;
  addProperty: string;
  PhotoUpload: string;
  photo: string;
  addTitle: string;
  addDes: string;
  detail: string;
  desc: string;
  otherDet: string;
  submit: string;
  AdFullView: string;
  Notification: string;
  notiReceived: string;
  notiNew: string;
  Email: string;
  name: string;
  phoneNum: string;
  createContact: string;
  create: string;
  note: string;
  home: string;
  scheduled: string;
  contact: string;
  exportData: string;
  setting: string;
  location: string;
  title: string;
  schedulePropertyVisit: string;
  days: Record<string, string>;
  createSchedule: string;
  clientName: string;
  visitDates: string;
  propertyToVisitors: string;
  numberOfVisitors: string;
  numberOfInfants: string;
  AutomatedEmail: string;
  visitConfirmed: string;
  visitData: string;
  propertyAddress: string;
  visitDetail: string;
  openInGoogleMaps: string;
  Whatsapp: string;
  ShareApp: string;
  Copydata: string;
  dataExport: string;
  export: string;
  clientVisitAppointmentTitle: string;
  phone: string;
  Infant: string;
  googleMapsLocation: string;
  viewOnMap: string;
  calendarData: CalendarData;
  selectDateRange: string;
  editProfile: string;
  notification: string;
  language: string;
  termsConditions: string;
  privacyPolicy: string;
  signOut: string;
  save: string;
  effectiveDate: string;
  accountUse: string;
  accountUseDetails: string;
  accountUseDetails1: string;
  appPurpose: string;
  appPurposeDetails: string;
  appPurposeDetails1: string;
  dataPrivacy: string;
  dataPrivacyDetails: string;
  dataPrivacyDetails1: string;
  communication: string;
  communicationDetails: string;
  emailsAndSharing: string;
  emailsAndSharingDetails: string;
  emailsAndSharingDetails1: string;
  DataExport: string;
  dataExportDetails: string;
  security: string;
  securityDetails: string;
  termination: string;
  terminationDetails: string;
  terminationDetails1: string;
  Contact: string;
  Eemail: string;
  Address: string;
  termsAndConditionsTitle: string;
  dataWeCollect: string;
  agencyUserDetails: string;
  propertyInfo: string;
  clientVisitDetails: string;
  howWeUseIt: string;
  secureLogin: string;
  scheduleManage: string;
  sendConfirmation: string;
  exportVisitData: string;
  shareVisitInfo: string;
  privacySecurity: string;
  dataIsolation: string;
  passwordEncryption: string;
  secureDataStorage: string;
  yourControl: string;
  accountControl: string;
  search: string;
  noLocation: string;
  noApartmentsFound: string;
  noContactsFound: string;
  confirmLogout: string;
  ok: string;
  cancel: string;
  selectProperty: string;
  property: string;
  visitTime: string;
  infants: string;
  adults: string;
  noSchedulesInRange: string;
  fileSaved: string;
  permissionDenied: string;
  exportFailed: string;
  noSchedulesFound: string;
  agreedPrice: string;
  noRevenue: string;
  noRevenueAvailable: string;
  selectVisitDates: string;
  bookedBy: string;
  conflictingDates: string;
  datesAlreadyBooked: string;
  notiNoDetails: string;
  noNotificationsFound: string;
  visitDetails: string;
  copyMsg: string;
  shareErr: string;
  whatsappNotInstall: string;
  myads:string;
  Revenue:string;
  confirmDelete:string;
  editProperty:string;
  editPhotos:string;
  mapLink:string;
  advanceAmount:string;
  totalAmount:string;
  balanceAmount:string
};

export type LanguageData = {
  locale: string;
  translation: LanguageTranslation;
};

export type AppLanguage = {
  id: string;
  code: string;
  name: string;
};

export type VisitDetail = {
  [key: string]: string;
};

export type RootState = ReturnType<typeof rootReducer>;

export interface Credentials {
  email: string;
  password: string;
}

export interface State {
  isError: boolean;
  isLoader: boolean;
  user: Record<string, any>;
  savedCords: number[];
  isLocation: boolean;
  properties: any[];
  contacts: any[];
  property: Property | null;
  userProperties: any[];
  schedules: any[];
  userPropertySchedules: any[];
  notifications: any[];
}

export interface Action {
  type: string;
  payload: any;
}

export interface Event {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
}
export interface Location {
  address: string;
  lat: number;
  long: number ;
}
interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

declare module "react-native-google-places-autocomplete" {
  export interface GooglePlaceData {
    types: string[];
  }
}
declare module "react-native-google-places-autocomplete" {
  export interface GooglePlaceData {
    types: string[];
  }
}
export interface GooglePlaceData extends GooglePlaceDataAutocomplete {
  types: string[];
}

export interface GooglePlaceDetail {
  formatted_address: string;
  geometry: Geometry;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: { address: string; lat: number; long: number | null };
  images: string[];
  otherDetails: string;
}

export interface RouteParams {
  id: string;
}
