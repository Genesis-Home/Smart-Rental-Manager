import {getItem} from './assynsStorage';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'auth/invalid-email': 'The email address is invalid.',
    'auth/user-disabled': 'The user account has been disabled.',
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'The password is incorrect.',
    'auth/email-already-in-use': 'The email address is already in use.',
    'auth/weak-password': 'The password is too weak.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/network-request-failed': 'Network error, please try again later.',
    'auth/too-many-requests': 'Too many requests. Try again later.',
    'auth/invalid-verification-code': 'The verification code is invalid.',
    'auth/session-expired': 'The verification session has expired.',
    'auth/provider-already-linked':
      'This provider is already linked to the account.',
    'auth/credential-already-in-use':
      'This credential is already associated with another user.',
    'auth/requires-recent-login':
      'This operation requires recent authentication. Please log in again.',
    'auth/missing-email': 'An email address is required.',
    'auth/invalid-credential': 'The credential provided is invalid.',
    'auth/user-token-expired':
      'The user token has expired. Please log in again.',
    'auth/invalid-api-key': 'The API key provided is invalid.',
    'auth/app-not-authorized':
      'The app is not authorized to use Firebase Authentication.',
    'auth/user-mismatch': 'The user does not match the given credentials.',
    'auth/account-exists-with-different-credential':
      'An account already exists with the same email but different sign-in credentials.',
    'auth/popup-closed-by-user':
      'The popup was closed before completing the sign-in.',
    'auth/internal-error':
      'An internal error occurred. Please try again later.',
    // custom toast
    'Login successful!': 'Login successful!',
    'Passwords do not match.': 'Passwords do not match.',
    'User registered successfully!': 'User registered successfully!',
    'Password reset email sent successfully.':
      'Password reset email sent successfully.',
    'User update successfully!': 'User update successfully!',
    jobCreatedSuccess: 'Job created successfully!',
    serviceCreatedSuccess: 'Service created successfully!',
    'Ad updated successfully!': 'Ad updated successfully!',
    'Ad deleted successfully!': 'Ad deleted successfully!',
    '': '',
  },
  it: {
    'auth/invalid-email': "L'indirizzo email non è valido.",
    'auth/user-disabled': "L'account utente è stato disabilitato.",
    'auth/user-not-found': 'Nessun utente trovato con questa email.',
    'auth/wrong-password': 'La password non è corretta.',
    'auth/email-already-in-use': "L'indirizzo email è già in uso.",
    'auth/weak-password': 'La password è troppo debole.',
    'auth/operation-not-allowed': 'Questa operazione non è consentita.',
    'auth/network-request-failed': 'Errore di rete, riprova più tardi.',
    'auth/too-many-requests': 'Troppe richieste. Riprova più tardi.',
    'auth/invalid-verification-code': 'Il codice di verifica non è valido.',
    'auth/session-expired': 'La sessione di verifica è scaduta.',
    'auth/provider-already-linked':
      "Questo provider è già collegato all'account.",
    'auth/credential-already-in-use':
      'Questa credenziale è già associata a un altro utente.',
    'auth/requires-recent-login':
      "Questa operazione richiede un'autenticazione recente. Effettua nuovamente l'accesso.",
    'auth/missing-email': 'È richiesto un indirizzo email.',
    'auth/invalid-credential': 'La credenziale fornita non è valida.',
    'auth/user-token-expired':
      "Il token utente è scaduto. Effettua nuovamente l'accesso.",
    'auth/invalid-api-key': 'La chiave API fornita non è valida.',
    'auth/app-not-authorized':
      "L'app non è autorizzata a utilizzare Firebase Authentication.",
    'auth/user-mismatch': "L'utente non corrisponde alle credenziali fornite.",
    'auth/account-exists-with-different-credential':
      'Esiste già un account con la stessa email ma con credenziali diverse.',
    'auth/popup-closed-by-user':
      "Il popup è stato chiuso prima del completamento dell'accesso.",
    'auth/internal-error':
      'Si è verificato un errore interno. Riprova più tardi.',
    // custom toast
    'Login successful!': 'Accesso effettuato con successo!',
    'Passwords do not match.': 'Le password non corrispondono.',
    'User registered successfully!': 'Utente registrato con successo!',
    'Password reset email sent successfully.':
      'Email di reimpostazione della password inviata con successo.',
    'User update successfully!': 'Utente aggiornato con successo!',
    jobCreatedSuccess: 'Lavoro creato con successo!',
    serviceCreatedSuccess: 'Servizio creato con successo!',
    'Ad updated successfully!': 'Annuncio aggiornato con successo!',
    'Ad deleted successfully!': 'Annuncio eliminato con successo!',
    '': '',
  },
};

// Function to get translated error message
const getFirebaseErrorMessage = async (errorCode: string): Promise<string> => {
  const languageCode: any = await getItem('languagecode', 'en');
  const errorMessage: string | undefined =
    translations[languageCode]?.[errorCode];
  return errorMessage || translations['en']['auth/internal-error'];
};

export default getFirebaseErrorMessage;
