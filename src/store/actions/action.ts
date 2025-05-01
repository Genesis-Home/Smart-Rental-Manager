import { Dispatch } from 'redux';
import { NavigationProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



interface Credentials {
  email: string;
  password: string;
}


export const registerUser =
  (credentials: any, navigation: any) => async (dispatch: any) => {
    console.log(credentials)
    if (credentials.password !== credentials.rePassword) {
      
      return;
    }
    try {
      dispatch({type: 'IS_LOADER', payload: true});
      const userCredential = await auth().createUserWithEmailAndPassword(
        credentials.email,
        credentials.password,
      );

      const userId = userCredential.user.uid;
      await firestore().collection('dev-users').doc(userId).set({
        ownerName: credentials.ownerName,
        email: credentials.email,
       
      });
      dispatch({type: 'IS_LOADER', payload: false});
      console.log('data store to firebase')
      
     
      navigation.navigate('Signin');
    } catch (error) {
      console.log(error, 'registerUser_error');
      dispatch({type: 'IS_LOADER', payload: false});
     
    }
  };




export const getCurrentUser = (navigation: NavigationProp<any>): any => async (dispatch: Dispatch) => {
  // Add your implementation here
};

export const loginUser = (credentials: Credentials, isSelectedRemember: boolean, navigation: NavigationProp<any>,): any => async (dispatch: Dispatch) => {
  // Add your implementation here
};
