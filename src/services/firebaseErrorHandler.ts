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
      "User updated successfully!":"User updated successfully!",
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
    "Contact deleted successfully": "Contact deleted successfully",
    "Failed to delete contact": "Failed to delete contact",
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
    "Failed to add schedule. Please try again.":
      "Failed to add schedule. Please try again.",
    "Property updated successfully": "Property updated successfully",
    "Failed to update property. Please try again.":
      "Failed to update property. Please try again.",
  },
  gr: {
    "auth/invalid-email": "Η διεύθυνση email δεν είναι έγκυρη.",
    "auth/user-disabled": "Ο λογαριασμός χρήστη έχει απενεργοποιηθεί.",
    "auth/user-not-found": "Δεν βρέθηκε χρήστης με αυτό το email.",
    "Contact deleted successfully": "Η επαφή διαγράφηκε με επιτυχία",
    "Failed to delete contact": "Αποτυχία διαγραφής της επαφής",

    "auth/wrong-password": "Ο κωδικός είναι λανθασμένος.",
    "auth/email-already-in-use": "Η διεύθυνση email χρησιμοποιείται ήδη.",
    "auth/weak-password": "Ο κωδικός είναι πολύ αδύναμος.",
    "auth/operation-not-allowed": "Αυτή η λειτουργία δεν επιτρέπεται.",
    "auth/network-request-failed":
      "Σφάλμα δικτύου, παρακαλώ δοκιμάστε ξανά αργότερα.",
    "auth/too-many-requests": "Πάρα πολλές αιτήσεις. Δοκιμάστε ξανά αργότερα.",
    "auth/invalid-verification-code":
      "Ο κωδικός επαλήθευσης δεν είναι έγκυρος.",
    "auth/session-expired": "Η συνεδρία επαλήθευσης έχει λήξει.",
    "auth/provider-already-linked":
      "Αυτός ο πάροχος είναι ήδη συνδεδεμένος με τον λογαριασμό.",
    "auth/credential-already-in-use":
      "Αυτά τα διαπιστευτήρια χρησιμοποιούνται ήδη από άλλο χρήστη.",
    "auth/requires-recent-login":
      "Αυτή η λειτουργία απαιτεί πρόσφατη πιστοποίηση. Παρακαλώ συνδεθείτε ξανά.",
    "auth/missing-email": "Απαιτείται διεύθυνση email.",
    "auth/invalid-credential":
      "Τα διαπιστευτήρια που παρέχονται δεν είναι έγκυρα.",
    "auth/user-token-expired":
      "Το διακριτικό χρήστη έχει λήξει. Παρακαλώ συνδεθείτε ξανά.",
    "auth/invalid-api-key": "Το κλειδί API που παρέχεται δεν είναι έγκυρο.",
    "auth/app-not-authorized":
      "Η εφαρμογή δεν έχει εξουσιοδότηση να χρησιμοποιεί το Firebase Authentication.",
    "auth/user-mismatch":
      "Ο χρήστης δεν ταιριάζει με τα παρεχόμενα διαπιστευτήρια.",
    "auth/account-exists-with-different-credential":
      "Υπάρχει ήδη λογαριασμός με το ίδιο email αλλά με διαφορετικά διαπιστευτήρια.",
    "auth/popup-closed-by-user":
      "Το αναδυόμενο παράθυρο έκλεισε πριν ολοκληρωθεί η σύνδεση.",
    "auth/internal-error":
      "Παρουσιάστηκε εσωτερικό σφάλμα. Παρακαλώ δοκιμάστε ξανά αργότερα.",
    // custom toast
    "Login successful!": "Επιτυχής σύνδεση!",
    "Property updated successfully": "Η ιδιοκτησία ενημερώθηκε με επιτυχία",
    "Failed to update property. Please try again.":
      "Αποτυχία ενημέρωσης της ιδιοκτησίας. Παρακαλώ δοκιμάστε ξανά.",
            "User updated successfully!":"Ο χρήστης ενημερώθηκε με επιτυχία!",

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
