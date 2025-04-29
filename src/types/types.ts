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
  [key: string]: string;
};

export type LanguageTranslation = {
  welcomeBack: string;
  pleaseLoginHere: string;
  emailAddress: string;
  email: string;
  password: string;
  forgotPassword: string;
  rememberme: string;
  donthaveaccount: string;
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
  resetyourpassword: string;
  enteryouremail: string;
  rememberyourpassword: string;
  sendOtp: string;
  changePassword: string;
  enteryournewpassword: string;
  invalidEmail: string;
  emailRequired: string;
  passwordRequired: string;
  passwordMin: string;
  fullnameRequired: string;
  roleRequired: string;
  selectRole: string;
  confirmpasswordRequired: string;
  passwordsDoNotMatch: string;
  goodMorning: string;
  seeAll: string;
  category: string;
  advertisements: string;
  service: string;
  cleaning: string;
  repairing: string;
  painting: string;
  laundry: string;
  plumbing: string;
  electrical: string;
  carpentry: string;
  moving: string;
  pestControl: string;
  gardening: string;
  homeSecurity: string;
  etc: string;
  all: string;
  reviews: string;
  editProfile: string;
  notifications: string;
  payments: string;
  security: string;
  privacyPolicy: string;
  helpCenter: string;
  inviteFriends: string;
  language: string;
  logout: string;
  dateOfBirth: string;
  save: string;
  phoneNumber: string;
  fullName: string;
  address: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  proceedToPay: string;
  enterName: string;
  deleteAccount: string;
  deleteAccountConfirm: string;
  deleteYourAccount: string;
  enterYourPassword: string;
  warning: string;
  bookingHistory: string;
  savedPaymentMethods: string;
  personalPreferences: string;
  proceedInstruction: string;
  passwordPlaceholder: string;
  delete: string;
  warningDelete: string;
  title: string;
  description: string;
  price: string;
  location: string;
  book: string;
  AdFullView: string;
  deleteChat: string;
  areYourSureYouWant: string;
  typeamsg: string;
  request: string;
  upcoming: string;
  ongoing: string;
  completed: string;
  canceled: string;
  accept: string;
  cancel: string;
  bookingDetails: string;
  pay: string;
  amount: string;
  vat: string;
  total: string;
  bookmark: string;
  ourservices: string;
  awayfromhome: string;
  becleanisaplatform: string;
  personalizeyourexp: string;
  getstarted: string;
  selectAppLanguage: string;
  selectLanguage: string;
  priceError: string;
  imagesRequired: string;
  serviceName: string;
  servicePrice: string;
  servicePriceError: string;
  bookingDateTime: string;
  pinLocation: string;
  submit: string;
  additionalServices: string;
  addService: string;
  categoryRequired: string;
  titleRequired: string;
  descriptionRequired: string;
  priceRequired: string;
  serviceNameRequired: string;
  servicePriceRequired: string;
  bookingRequired: string;
  addressRequired: string;
  pinLocationRequired: string;
  createAd: string;
  selectCategory: string;
  edit: string;
  myAds: string;
  services: string;
  jobs: string;
  createJob: string;
  createService: string;
  image: string;
  imageFullView: string;
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
