import { NavigationProp } from "@react-navigation/native";
import { TextInputProps } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import rootReducer from "../store/reducers/rootReducer";

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Splash1: undefined;
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Tabs: undefined;
  AddProperty: undefined;
  Notification: undefined;
  AutomatedEmail: undefined;
  Map: undefined;
  EditProfile: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  Home: undefined;
  Scheduled: undefined;
  ExportData: undefined;
  Profile: undefined;
  createContact: undefined;
  AddSchedule: undefined;
  ApartmentDetails: { id: string };
};

export type RootStackParamListBottomNavigation = {
  Home1: undefined;
  ApartmentDetails: undefined;
  Scheduled1: undefined;
  AddSchedule: undefined;
  ExportData1: undefined;
  Settings1: undefined;
  Profile1: undefined;
  createContact: undefined;
};

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
  onBackPress?: () => void;
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

export interface AddPropertyProps {
  navigation: any;
}

export interface HomeScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface CreateContactProps {
  navigation: any;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateContactScreenNavigationProp
  extends NativeStackNavigationProp<RootStackParamList> {}

export interface EditProfileProps {
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
  TermsConditions: string;
  registerissucessfullyhaveenjoy: string;
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
  isRequired: string;
  title: string;
  schedulePropertyVisit: string;
  days: Record<string, string>;
  properties: string[];
  createSchedule: string;
  clientName: string;
  visitDateTime: string;
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

// Store Types
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
}

export interface Action {
  type: string;
  payload: any;
}

// Property Types
export interface Property {
  id: string;
  title: {
    en: string;
    sp: string;
  };
  description: {
    en: string;
    sp: string;
  };
  address: {
    en: string;
    sp: string;
  };
  images: any[];
}
