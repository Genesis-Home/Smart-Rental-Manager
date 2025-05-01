import { Dispatch } from "redux";
import { NavigationProp } from "@react-navigation/native";
import { Credentials } from "../../types/types";

export const getCurrentUser =
  (navigation: NavigationProp<any>): any =>
  async (dispatch: Dispatch) => {
    // Add your implementation here
  };

export const loginUser =
  (
    credentials: Credentials,
    isSelectedRemember: boolean,
    navigation: NavigationProp<any>
  ): any =>
  async (dispatch: Dispatch) => {
    // Add your implementation here
  };
