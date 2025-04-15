import {Dispatch} from 'redux';
import {NavigationProp} from '@react-navigation/native';

interface Credentials {
  email: string;
  password: string;
}

export const getCurrentUser =
  (navigation: NavigationProp<any>): any =>
  async (dispatch: Dispatch) => {
    // Add your implementation here
  };

export const loginUser =
  (
    credentials: Credentials,
    isSelectedRemember: boolean,
    navigation: NavigationProp<any>,
  ): any =>
  async (dispatch: Dispatch) => {
    // Add your implementation here
  };
