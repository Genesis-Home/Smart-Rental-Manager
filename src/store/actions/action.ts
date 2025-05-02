import { Dispatch } from "redux";
import { CommonActions, NavigationProp } from "@react-navigation/native";
import { Credentials } from "../../types/types";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { deleteItem, setItem } from "../../services/assynsStorage";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import storage from "@react-native-firebase/storage";

export const getCurrentUser =
  (navigation: NavigationProp<any>): any =>
  async (dispatch: Dispatch) => {
    // Add your implementation here
  };

export const loginUser =
  (credentials: any, isSelectedRemember: any, navigation: any) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      // User Login
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      console.log("user", userCredential);

      const user = (userCredential.user as any)._user;

      const userDoc = await firestore().collection("users").doc(user.uid).get();

      const userData = userDoc.data();

      isSelectedRemember && setItem("user", userData);

      !isSelectedRemember && deleteItem("user");

      dispatch({ type: "SET_USER", payload: userData });
      dispatch({ type: "IS_LOADER", payload: false });

      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] })
      );

      const customMessage = await getFirebaseErrorMessage("Login successful!");
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
    } catch (error) {
      console.log(error, "loginUser_error");
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

//register user
export const registerUser =
  (credentials: any, navigation: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      const userCredential = await auth().createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      const userId = userCredential.user.uid;
      await firestore().collection("users").doc(userId).set({
        agencyName: credentials.agencyName,
        ownerName: credentials.ownerName,
        email: credentials.email,
        profilePhoto: null,
        userId: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: "IS_LOADER", payload: false });
      const customMessage = await getFirebaseErrorMessage(
        "User registered successfully!"
      );
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
      navigation.navigate("Signin");
    } catch (error) {
      console.log(error, "registerUser_error");
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const forgotPassword =
  (email: string, navigation: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      await auth().sendPasswordResetEmail(email);
      const customMessage = await getFirebaseErrorMessage(
        "Password reset email sent successfully."
      );
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
      dispatch({ type: "IS_LOADER", payload: false });
      navigation.navigate("Signin");
    } catch (error) {
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const addProperty =
  (formData: any, userId: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const propertyData = {
        title: formData.title,
        description: formData.description,
        otherDetails: formData.otherDetails,
        location: null,
        images: null,
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection("properties").add(propertyData);

      dispatch({ type: "IS_LOADER", payload: false });
      Toast.show({
        type: "success",
        text1: "Property added successfully",
        position: "bottom",
      });
    } catch (error: any) {
      console.error("Add Property Error:", error);
      dispatch({ type: "IS_LOADER", payload: false });
      Toast.show({
        type: "error",
        text1: "Failed to add property. Please try again.",
        position: "bottom",
      });
    }
  };
