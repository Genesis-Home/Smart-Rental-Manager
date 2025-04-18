type LanguageTranslation = {
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
  contact:string,
  exportData:string,
  setting:string
};

type LanguageData = {
  locale: string;
  translation: LanguageTranslation;
};

export const languageData: LanguageData[] = [
  {
    locale: "en",
    translation: {
      welcome: "Welcome!",
      trackVisits:
        "Keep track of all your visits and export data whenever you need it.",
      loginEmailPrompt: "Enter your email to login",
      registerEmailPrompt: "Enter your email to get started",
      pleaseLoginHere: "Please Login Here!",
      emailAddress: "Email Address",
      agencyName: "Agency Name",
      ownerName: "Owner’s Name",
      email: "E-mail",
      password: "Password",
      forgotPassword: "Forget Password?",
      rememberme: "Remember me",
      donthaveaccount: "Don’t have account?",
      recoverAccount: "Recover Your Account",
      signup: "Sign up",
      or: "OR",
      signIn: "Login",
      pleaseRegisterHere: "Please Register Here!",
      fullname: "Full Name",
      confirmpassword: "Confirm password",
      role: "Role",
      alreadyhaveanaccount: "Already have an account?",
      TermsConditions: "Terms & Conditions",
      registerissucessfullyhaveenjoy: "Register is sucessfully have enjoy!",
      resetpassword: "Reset password",
      enteryouremail: "Input your Email Address",
      rememberyourpassword: "Remember your password?",
      sendOtp: "SEND OTP",
      changePassword: "Change password",
      enternewpassword: "Create the new password",
      invalidEmail: "Please enter a valid email address",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordMin: "Password must be at least 6 characters long",
      fullnameRequired: "Full Name is required",
      roleRequired: "Role is required",
      confirmpasswordRequired: "Confirm Password is required",
      passwordsDoNotMatch: "Passwords do not match",
      agencyNameRequired: "Agency Name is required",
      ownerNameRequired: "Owner Name is required",
      passwordsMustMatch: "Passwords must match",
      resetEmail: "Reset Email",
      sendEmail: "Send Email",
      addProperty: "Add Property",
      PhotoUpload: "PhotoUpload",
      photo: "Photo",
      addTitle: "Add Title....",
      addDes: "Add Description ....",
      otherDet: "Other details",
      submit: "Submit",
      AdFullView: "Ad Full View",
      Notification: "Notification",
      notiReceived: " Notification received",
      notiNew: "New",
      contact: "Contact",
      Email: "Email",
      name: "Name",
      phoneNum: "Phone Number",
      createContact: "Create Contact",
      create: "Create",
      note: "Note.....",
      home: "Home",
      scheduled: "Scheduled",
      exportData: "Export Data",
      setting: "Setting",
    },
  },
  {
    locale: "sp",
    translation: {
      welcome: "¡Bienvenido!",
      trackVisits:
        "Lleva un registro de todas tus visitas y exporta los datos cuando los necesites.",
      loginEmailPrompt: "Ingresa tu correo electrónico para iniciar sesión.",
      registerEmailPrompt: "Ingresa tu correo electrónico para comenzar.",
      pleaseLoginHere: "¡Por favor, inicia sesión aquí!",
      emailAddress: "Dirección de correo electrónico",
      agencyName: "Nombre de la agencia",
      ownerName: "Nombre del propietario",
      email: "Correo electrónico",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      rememberme: "Recuérdame",
      donthaveaccount: "¿No tienes cuenta?",
      recoverAccount: "Recupera tu cuenta",
      signup: "Regístrate",
      or: "O",
      signIn: "Iniciar sesión",
      pleaseRegisterHere: "¡Por favor, regístrate aquí!",
      fullname: "Nombre completo",
      confirmpassword: "Confirmar contraseña",
      role: "Rol",
      alreadyhaveanaccount: "¿Ya tienes una cuenta?",
      TermsConditions: "Términos y condiciones",
      registerissucessfullyhaveenjoy: "¡Registro exitoso, disfruta!",
      resetpassword: "Restablecer contraseña",
      enteryouremail: "Ingresa tu dirección de correo electrónico",
      rememberyourpassword: "¿Recuerdas tu contraseña?",
      sendOtp: "ENVIAR CÓDIGO",
      changePassword: "Cambiar contraseña",
      enternewpassword: "Crea la nueva contraseña",
      invalidEmail:
        "Por favor, ingresa una dirección de correo electrónico válida",
      emailRequired: "El correo electrónico es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
      passwordMin: "La contraseña debe tener al menos 6 caracteres",
      fullnameRequired: "El nombre completo es obligatorio",
      roleRequired: "El rol es obligatorio",
      confirmpasswordRequired: "Confirmar contraseña es obligatorio",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
      agencyNameRequired: "El nombre de la agencia es obligatorio",
      ownerNameRequired: "El nombre del propietario es obligatorio",
      passwordsMustMatch: "Las contraseñas deben coincidir",
      resetEmail: "Restablecer correo electrónico",
      sendEmail: "Enviar correo electrónico",
      addProperty: "Agregar propiedad",
      PhotoUpload: "Subir foto",
      photo: "Foto",
      addTitle: "Agregar título...",
      addDes: "Agregar descripción...",
      otherDet: "Otros detalles",
      submit: "Enviar",
      AdFullView: "Vista completa del anuncio",
      Notification: "Notificación",
      notiReceived: "Notificación recibida",
      notiNew: "Nuevo",
      contact: "Contacto",
      Email: "Correo electrónico",
      name: "Nombre",
      phoneNum: "Número de teléfono",
      createContact: "Crear Contacto",
      create: "Crear",
      note: "Nota.....",
      home: "Inicio",
      scheduled: "Programado",
      exportData: "Exportar Datos",
      setting: "Configuración",
    },
  },
];

export type AppLanguage = {
  id: string;
  name: string;
  code: string;
};

export const appLanguages: AppLanguage[] = [
  {
    id: "0",
    name: "English",
    code: "en",
  },
  {
    id: "1",
    name: "Spanish",
    code: "sp",
  },
];
