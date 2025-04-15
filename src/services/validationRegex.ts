import Toast from 'react-native-toast-message';

// Function to validate if the data contains only alphabet letters and spaces
export const allLetter = (data: string): boolean => {
  // Regular expression to match letters and spaces
  let letters: RegExp = /^[a-zA-Z\s]*$/;

  // Check if the data matches the pattern
  if (letters.test(data)) {
    return true;
  } else {
    // Show error toast if validation fails
    Toast.show({
      type: 'error',
      text1: 'You can type only alphabet characters.',
      position: 'bottom',
    });
    return false;
  }
};
