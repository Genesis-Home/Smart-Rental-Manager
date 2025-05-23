import { getItem } from "./assynsStorage";

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    "auth/invalid-email": "The email address is invalid.",
    "auth/user-disabled": "The user account has been disabled.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/email-already-in-use": "The email address is already in use.",
    "auth/weak-password": "The password is too weak.",
    "auth/operation-not-allowed": "This operation is not allowed.",
    "auth/network-request-failed": "Network error, please try again later.",
    "auth/too-many-requests": "Too many requests. Try again later.",
    "auth/invalid-verification-code": "The verification code is invalid.",
    "auth/session-expired": "The verification session has expired.",
    "auth/provider-already-linked":
      "This provider is already linked to the account.",
    "auth/credential-already-in-use":
      "This credential is already associated with another user.",
    "auth/requires-recent-login":
      "This operation requires recent authentication. Please log in again.",
    "auth/missing-email": "An email address is required.",
    "auth/invalid-credential": "The credential provided is invalid.",
    "auth/user-token-expired":
      "The user token has expired. Please log in again.",
    "auth/invalid-api-key": "The API key provided is invalid.",
    "auth/app-not-authorized":
      "The app is not authorized to use Firebase Authentication.",
    "auth/user-mismatch": "The user does not match the given credentials.",
    "auth/account-exists-with-different-credential":
      "An account already exists with the same email but different sign-in credentials.",
    "auth/popup-closed-by-user":
      "The popup was closed before completing the sign-in.",
    "auth/internal-error":
      "An internal error occurred. Please try again later.",
    // custom toast
    "Login successful!": "Login successful!",
    "Passwords do not match.": "Passwords do not match.",
    "User registered successfully!": "User registered successfully!",
    "Password reset email sent successfully.":
      "Password reset email sent successfully.",
    "User update successfully!": "User update successfully!",
    "Schedule added successfully": "Schedule added successfully",
    jobCreatedSuccess: "Job created successfully!",
    serviceCreatedSuccess: "Service created successfully!",
    "Ad updated successfully!": "Ad updated successfully!",
    "Ad deleted successfully!": "Ad deleted successfully!",
    "Property deleted successfully": "Property deleted successfully",
    "Failed to delete property": "Failed to delete property",
    "": "",
    "Failed to add property. Please try again.":
      "Failed to add property. Please try again.",
    "User not authenticated": "User not authenticated",
    "Failed to select images": "Failed to select images",
    "Property added successfully": "Property added successfully",
    "Failed to upload images. Please try again.":
      "Failed to upload images. Please try again.",
    "Property not found.": "Property not found.",
    "Contact added successfully": "Contact added successfully",
    "Failed to add contact. Please try again.":
      "Failed to add contact. Please try again.",
    "logout successfully!": "logout successfully!",
    "Failed to add schedule. Please try again.":"Failed to add schedule. Please try again."
  },
  sp: {
    "auth/invalid-email": "La dirección de correo electrónico no es válida.",
    "auth/user-disabled": "La cuenta de usuario ha sido deshabilitada.",
    "auth/user-not-found":
      "No se encontró un usuario con este correo electrónico.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/email-already-in-use":
      "La dirección de correo electrónico ya está en uso.",
    "auth/weak-password": "La contraseña es demasiado débil.",
    "auth/operation-not-allowed": "Esta operación no está permitida.",
    "auth/network-request-failed":
      "Error de red, por favor intenta nuevamente más tarde.",
    "auth/too-many-requests": "Demasiadas solicitudes. Intenta más tarde.",
    "auth/invalid-verification-code": "El código de verificación no es válido.",
    "auth/session-expired": "La sesión de verificación ha caducado.",
    "auth/provider-already-linked":
      "Este proveedor ya está vinculado a la cuenta.",
    "auth/credential-already-in-use":
      "Esta credencial ya está asociada con otro usuario.",
    "auth/requires-recent-login":
      "Esta operación requiere autenticación reciente. Inicia sesión nuevamente.",
    "auth/missing-email": "Se requiere una dirección de correo electrónico.",
    "auth/invalid-credential": "La credencial proporcionada no es válida.",
    "auth/user-token-expired":
      "El token del usuario ha expirado. Inicia sesión nuevamente.",
    "auth/invalid-api-key": "La clave API proporcionada no es válida.",
    "auth/app-not-authorized":
      "La aplicación no está autorizada para usar Firebase Authentication.",
    "auth/user-mismatch":
      "El usuario no coincide con las credenciales proporcionadas.",
    "auth/account-exists-with-different-credential":
      "Ya existe una cuenta con el mismo correo electrónico pero con credenciales diferentes.",
    "auth/popup-closed-by-user":
      "El popup fue cerrado antes de completar el inicio de sesión.",
    "auth/internal-error":
      "Ocurrió un error interno. Por favor intenta más tarde.",
    // custom toast
    "Login successful!": "¡Inicio de sesión exitoso!",
    "Passwords do not match.": "Las contraseñas no coinciden.",
    "User registered successfully!": "¡Usuario registrado con éxito!",
    "Password reset email sent successfully.":
      "Correo de restablecimiento de contraseña enviado exitosamente.",
    "User update successfully!": "¡Usuario actualizado con éxito!",
    "Schedule added successfully": "Programa añadido con éxito",
    jobCreatedSuccess: "¡Trabajo creado exitosamente!",
    serviceCreatedSuccess: "¡Servicio creado exitosamente!",
    "Ad updated successfully!": "¡Anuncio actualizado exitosamente!",
    "Ad deleted successfully!": "¡Anuncio eliminado exitosamente!",
    "Property deleted successfully": "Propiedad eliminada con éxito",
    "Failed to delete property": "No se pudo eliminar la propiedad",
    "": "",
    "Failed to add property. Please try again.":
      "No se pudo agregar la propiedad. Por favor, inténtelo de nuevo.",
    "User not authenticated": "Usuario no autenticado",
    "Failed to select images": "Error al seleccionar imágenes",
    "Property added successfully": "Propiedad añadida con éxito",
    "Failed to upload images. Please try again.":
      "No se pudieron cargar las imágenes. Por favor, inténtalo de nuevo.",
    "Property not found.": "Propiedad no encontrada.",
    "Contact added successfully": "Contacto añadido con éxito",
    "Failed to add contact. Please try again.":
      "Error al agregar el contacto. Por favor, inténtelo de nuevo.",
    "logout successfully!": "¡Cierre de sesión exitoso!",
    "Failed to add schedule. Please try again.":"No se pudo agregar el horario. Por favor, inténtelo de nuevo."
  },
};

// Function to get translated error message
const getFirebaseErrorMessage = async (errorCode: string): Promise<string> => {
  const languageCode: any = await getItem("languagecode", "en");
  const errorMessage: string | undefined =
    translations[languageCode]?.[errorCode];
  return errorMessage || translations["en"]["auth/internal-error"];
};

export default getFirebaseErrorMessage;
