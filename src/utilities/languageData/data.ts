type LanguageTranslation = {
  welcome: string;
  trackVisits:string;
  loginEmailPrompt: string;
  pleaseLoginHere:string,
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
  confirmpasswordRequired: string;
  passwordsDoNotMatch: string;
};

type LanguageData = {
  locale: string;
  translation: LanguageTranslation;
};

export const languageData: LanguageData[] = [
  {
    locale: 'en',
    translation: {
      welcome: 'Welcome!',
      trackVisits:'Keep track of all your visits and export data whenever you need it.',
      loginEmailPrompt: 'Enter your email to login',
      pleaseLoginHere:'Please Login Here!',
      emailAddress: 'Email Address',
      email: 'E-mail',
      password: 'Password',
      forgotPassword: 'Forget Password?',
      rememberme: 'Remember me',
      donthaveaccount: 'Don’t have account?',
      signup: 'Sign up',
      or: 'OR',
      signIn: 'Login',
      pleaseRegisterHere: 'Sign up to get started.',
      fullname: 'Full Name',
      confirmpassword: 'Confirm password',
      role: 'Role',
      alreadyhaveanaccount: 'Already have an account?',
      TermsConditions: 'Terms & Conditions',
      registerissucessfullyhaveenjoy: 'Register is sucessfully have enjoy!',
      resetyourpassword: 'Reset your password',
      enteryouremail: 'Enter your email address to reset your Password',
      rememberyourpassword: 'Remember your password?',
      sendOtp: 'SEND OTP',
      changePassword: 'Change password',
      enteryournewpassword: 'Enter your new password to access to your account',
      invalidEmail: 'Please enter a valid email address',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordMin: 'Password must be at least 6 characters long',
      fullnameRequired: 'Full Name is required',
      roleRequired: 'Role is required',
      confirmpasswordRequired: 'Confirm Password is required',
      passwordsDoNotMatch: 'Passwords do not match',
    },
  },
  {
    locale: 'sp',
    translation: {
      welcome: '¡Bienvenido!',
      trackVisits:'Lleva un registro de todas tus visitas y exporta los datos cuando los necesites.',
      loginEmailPrompt: 'Ingresa tu correo electrónico para iniciar sesión.',
      pleaseLoginHere:'¡Por favor, inicia sesión aquí!',
      emailAddress: 'Dirección de correo electrónico',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      rememberme: 'Recuérdame',
      donthaveaccount: '¿No tienes cuenta?',
      signup: 'Regístrate',
      or: 'O',
      signIn: 'Iniciar sesión',
      pleaseRegisterHere: 'Regístrate para comenzar.',
      fullname: 'Nombre completo',
      confirmpassword: 'Confirmar contraseña',
      role: 'Rol',
      alreadyhaveanaccount: '¿Ya tienes una cuenta?',
      TermsConditions: 'Términos y condiciones',
      registerissucessfullyhaveenjoy: '¡Registro exitoso, disfruta!',
      resetyourpassword: 'Restablecer tu contraseña',
      enteryouremail:
        'Ingresa tu correo electrónico para restablecer tu contraseña',
      rememberyourpassword: '¿Recuerdas tu contraseña?',
      sendOtp: 'ENVIAR CÓDIGO',
      changePassword: 'Cambiar contraseña',
      enteryournewpassword:
        'Ingresa tu nueva contraseña para acceder a tu cuenta',
      invalidEmail:
        'Por favor, ingresa una dirección de correo electrónico válida',
      emailRequired: 'El correo electrónico es obligatorio',
      passwordRequired: 'La contraseña es obligatoria',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres',
      fullnameRequired: 'El nombre completo es obligatorio',
      roleRequired: 'El rol es obligatorio',
      confirmpasswordRequired: 'Confirmar contraseña es obligatorio',
      passwordsDoNotMatch: 'Las contraseñas no coinciden',
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
    id: '0',
    name: 'English',
    code: 'en',
  },
  {
    id: '1',
    name: 'Spanish',
    code: 'sp',
  },
];
