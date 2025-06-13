import { Dispatch } from "redux";
import { CommonActions, NavigationProp } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { deleteItem, setItem, getItem } from "../../services/assynsStorage";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import { scheduleBookingNotifications } from "../../services/notificationService";
import axios from "axios";
import { Location } from "../../types/types";
import { generateSchedulePDF } from '../../services/pdfService';

export const getCurrentUser =
  (navigation: NavigationProp<any>): any =>
  async (dispatch: Dispatch) => {
    try {
      const user = await getItem("user", null);
      if (user) {
        dispatch({ type: "SET_USER", payload: user });
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

export const sendEmail =
  (
    navigation: NavigationProp<any>,
    email: string,
    clientName:string,
    phoneNum:string,
    visitDates: string,
    visitTime: string,
    numberOfVisitors: string,
    numberOfInfants: string,
    property: string,
    location: Location,
    agreedPrice: string,
    totalAmount:string,
    advanceAmount: string,
    pdfPath?: string,
    scheduleId?: string,
  ): any =>
  async (dispatch: Dispatch) => {
    try {
      const formattedVisitDates = visitDates.replace(" - ", " to ");
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`;
      const balanceAmount = (parseFloat(agreedPrice) - (parseFloat(advanceAmount) || 0)).toFixed(2);

      let message = `Visit Details:\n\n📅 Visit Date & Time: ${formattedVisitDates}, ${visitTime}\n`;

      if (numberOfVisitors && numberOfVisitors.trim() !== '') {
        message += `👨‍👩‍👧‍👦 Number of Visitors: ${numberOfVisitors}\n`;
      }
      if (numberOfInfants && numberOfInfants.trim() !== '') {
        message += `👶 Number of Infants: ${numberOfInfants}\n`;
      }

      message += `🏠 Property Address: ${location.address}\n\n`;
      message += `💰 Financial Details:\n`;
      message += `Total Amount: ${agreedPrice}\n`;
      message += `Advance Amount: ${advanceAmount || '0'}\n`;
      message += `Balance Amount: ${balanceAmount}\n\n`;
      message += `🗺️ Google Maps Location: ${googleMapsUrl}`;

      const response = await axios.post(
        "https://api-youshwrkza-uc.a.run.app/send-email",
        {
          to: email,
          subject: "Your visit is confirmed",
          message,
          pdfPath: pdfPath ? `file://${pdfPath}` : undefined
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Email sent successfully:", response.data);

      navigation.navigate("AutomatedEmail", {
        visitDetails: {
          visitDates: formattedVisitDates,
          visitTime,
          ...(numberOfVisitors && { numberOfVisitors }),
          ...(numberOfInfants && { numberOfInfants }),
          property,
          location,
          agreedPrice,
          advanceAmount,
          balanceAmount,
          scheduleId,
          clientName,
          phoneNum,
          email,
          totalAmount,
        },
        pdfPath: pdfPath 
      });

    } catch (error) {
      console.error("Error sending email:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send email",
        position: "bottom",
      });
    }
  };

export const loginUser =
  (credentials: any, isSelectedRemember: any, navigation: any) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const user = (userCredential.user as any)._user;
      const userDoc = await firestore().collection("users").doc(user.uid).get();
      const userData = userDoc.data();

      if (!userData) {
        throw new Error("User data not found");
      }

      await setItem("user", userData);

      dispatch({ type: "SET_USER", payload: userData });
      dispatch({ type: "IS_LOADER", payload: false });

      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] })
      );

      const customMessage = await getFirebaseErrorMessage("Login successful!");
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
    } catch (error) {
      console.log(error, "loginUser_error");
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

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
  (formData: any, userId: string, navigation: any) => async (dispatch: any) => {
    console.log(formData, "formData");
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const propertyRef = firestore().collection("properties").doc();
      const propertyData = {
        title: formData.title,
        description: formData.description,
        otherDetails: formData.otherDetails,
        location: formData.location,
        images: formData.images,
        revenue: 0,
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await propertyRef.set(propertyData);

      // Fetch updated properties list after creating new property
      const snapshot = await firestore().collection("properties").get();

      if (snapshot.empty) {
        dispatch({ type: "SET_PROPERTIES", payload: [] });
      } else {
        const properties = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_PROPERTIES", payload: properties });
      }

      dispatch({ type: "IS_LOADER", payload: false });
      const customMessage = await getFirebaseErrorMessage(
        "Property added successfully"
      );
      Toast.show({
        type: "success",
        text1: customMessage,
        position: "bottom",
      });

      navigation.navigate("Tabs", { screen: "Home1" });
    } catch (error: any) {
      console.error("Add Property Error:", error);
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage(
        "Failed to add property. Please try again."
      );
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
      });
    }
  };

export const fetchProperties = () => async (dispatch: any) => {
  try {
    dispatch({ type: "IS_LOADER", payload: true });

    const snapshot = await firestore()
      .collection("properties")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      dispatch({ type: "SET_PROPERTIES", payload: [] });
    } else {
      const properties = snapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch({ type: "SET_PROPERTIES", payload: properties });
    }
    dispatch({ type: "IS_LOADER", payload: false });
  } catch (error) {
    console.log(error, "fetchProperty_error");
    dispatch({ type: "IS_LOADER", payload: false });

    const errorMessage = await getFirebaseErrorMessage((error as any).code);
    Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
  }
};

export const fetchPropertyById =
  (propertyId: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const propertyDoc = await firestore()
        .collection("properties")
        .doc(propertyId)
        .get();

      if (!propertyDoc.exists) {
        dispatch({ type: "SET_PROPERTY", payload: null });
        const errorMessage = await getFirebaseErrorMessage(
          "Property not found."
        );
        Toast.show({
          type: "error",
          text1: errorMessage,
          position: "bottom",
        });
      } else {
        const property = {
          ...propertyDoc.data(),
          id: propertyDoc.id,
        };
        dispatch({ type: "SET_PROPERTY", payload: property });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchPropertyById_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const fetchPropertiesByUserID =
  (userID: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const snapshot = await firestore()
        .collection("properties")
        .where("createdBy", "==", userID)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_PROPERTIES", payload: [] });
      } else {
        const properties = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_PROPERTIES", payload: properties });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchproperty_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const addContact =
  (formData: any, userId: string, navigation: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const contactRef = firestore().collection("contacts").doc();
      const contactData = {
        name: formData.name,
        emailAddress: formData.email,
        phoneNumber: formData.phoneNum,
        notes: formData.notes,
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await contactRef.set(contactData);

      // Fetch updated contacts list after creating new contact
      const snapshot = await firestore()
        .collection("contacts")
        .where("createdBy", "==", userId)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_CONTACTS", payload: [] });
      } else {
        const contacts = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_CONTACTS", payload: contacts });
      }

      dispatch({ type: "IS_LOADER", payload: false });
      const customMessage = await getFirebaseErrorMessage(
        "Contact added successfully"
      );
      Toast.show({
        type: "success",
        text1: customMessage,
        position: "bottom",
      });

      navigation.goBack();
    } catch (error: any) {
      console.error("Add Contact Error:", error);
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage(
        "Failed to add contact. Please try again."
      );
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
      });
    }
  };

export const fetchContactsByUserID =
  (userID: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const snapshot = await firestore()
        .collection("contacts")
        .where("createdBy", "==", userID)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_CONTACTS", payload: [] });
      } else {
        const contacts = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_CONTACTS", payload: contacts });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchcontact_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const logoutUser = (navigation: any) => async (dispatch: any) => {
  try {
    dispatch({ type: "IS_LOADER", payload: true });
    await auth().signOut();
    deleteItem("user");
    navigation.replace("Signin");
    dispatch({ type: "IS_LOADER", payload: false });
    const customMessage = await getFirebaseErrorMessage("logout successfully!");
    Toast.show({
      type: "success",
      text1: customMessage,
      position: "bottom",
    });
  } catch (error) {
    const errorMessage = await getFirebaseErrorMessage((error as any).message);
    dispatch({ type: "IS_LOADER", payload: false });
    Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
  }
};

export const updateUser =
  (credentials: any, userId: any, navigation: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      await firestore().collection("users").doc(userId).update(credentials);
      const userDoc = await firestore().collection("users").doc(userId).get();
      const userData = userDoc.data();
      setItem("user", userData);
      dispatch({ type: "SET_USER", payload: userData });
      dispatch({ type: "IS_LOADER", payload: false });
      setItem("user", userData);
      const customMessage = await getFirebaseErrorMessage(
        "User update successfully!"
      );
      Toast.show({ type: "success", text1: customMessage, position: "bottom" });
      navigation.goBack();
    } catch (error) {
      console.log(error, "updateUser_error");
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const addSchedule =
  (formData: any, userId: string, navigation: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      const scheduleRef = firestore().collection("schedules").doc();
      const scheduleId = scheduleRef.id; 
      const scheduleData = {
        id:scheduleId,
        clientName: formData.clientName,
        email: formData.email,
        phoneNum: formData.phoneNum,
        visitDates: formData.visitDates,
        visitTime: formData.visitTime,
        property: formData.property,
        propertyId: formData.propertyId,
        revenue: formData.revenue,
        propertyToVisit: formData.propertyToVisit,
        numberOfVisitors: formData.numberOfVisitors,
        numberOfInfants: formData.numberOfInfants,
        location: formData.location,
        agreedPrice: formData.agreedPrice,
        advanceAmount: formData.advanceAmount,
        totalAmount:formData.totalAmount,
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await scheduleRef.set(scheduleData);
      await scheduleBookingNotifications(scheduleData);

      dispatch({ type: "IS_LOADER", payload: false });

      try {
        const pdfPath = await generateSchedulePDF(scheduleData);
        dispatch(
          sendEmail(
            navigation,
            formData.email,
            formData.clientName,
            formData.phoneNum,
            formData.visitDates,
            formData.visitTime,
            formData.numberOfVisitors,
            formData.numberOfInfants,
            formData.property,
            formData.location,
            formData.agreedPrice,
            formData.advanceAmount,
            formData.totalAmount,
            pdfPath,
            scheduleId
          )
        );
      } catch (error) {
        console.error('Error generating PDF or sending email:', error);
        Toast.show({
          type: "error",
          text1: "Failed to generate PDF or send email",
          position: "bottom",
        });
      }

      // Show schedule creation success
      Toast.show({
        type: "success",
        text1: "Schedule added successfully",
        position: "bottom",
      });

    } catch (error: any) {
      console.error("Add Schedule Error:", error);
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage(
        "Failed to add schedule. Please try again."
      );
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
      });
    }
  };

export const fetchSchedulesByUserID =
  (userID: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const snapshot = await firestore()
        .collection("schedules")
        .where("createdBy", "==", userID)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_SCHEDULES", payload: [] });
      } else {
        const schedules = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_SCHEDULES", payload: schedules });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchschedule_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const fetchSchedulesByPropertyIdAndUserId =
  (propertyId: string, userId: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const snapshot = await firestore()
        .collection("schedules")
        .where("propertyId", "==", propertyId)
        .where("createdBy", "==", userId)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_PROPERTY_SCHEDULES", payload: [] });
      } else {
        const schedules = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_PROPERTY_SCHEDULES", payload: schedules });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchSchedulesByPropertyIdAndUserId_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const updatePropertyRevenue =
  (propertyId: string, newRevenue: number) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      await firestore().collection("properties").doc(propertyId).update({
        revenue: newRevenue,
      });

      const updatedPropertyDoc = await firestore()
        .collection("properties")
        .doc(propertyId)
        .get();

      const updatedProperty = {
        ...updatedPropertyDoc.data(),
        id: updatedPropertyDoc.id,
      };

      dispatch({ type: "SET_PROPERTY", payload: updatedProperty });

      dispatch({ type: "IS_LOADER", payload: false });
      console.log("Revenue Updated Successfully");
    } catch (error) {
      console.log(error, "updatePropertyRevenue_error");
      dispatch({ type: "IS_LOADER", payload: false });
    }
  };

export const fetchNotificationsByUserID =
  (userID: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const snapshot = await firestore()
        .collection("deliveredNotifications")
        .where("userId", "==", userID)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_NOTIFICATIONS", payload: [] });
      } else {
        const notifications = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      }
      dispatch({ type: "IS_LOADER", payload: false });
    } catch (error) {
      console.log(error, "fetchnotification_error");
      dispatch({ type: "IS_LOADER", payload: false });

      const errorMessage = await getFirebaseErrorMessage((error as any).code);
      Toast.show({ type: "error", text1: errorMessage, position: "bottom" });
    }
  };

export const deletePropertyById =
  (propertyId: string, userID: string) => async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });
      await firestore().collection("properties").doc(propertyId).delete();

      const snapshotuserproperties = await firestore()
        .collection("properties")
        .where("createdBy", "==", userID)
        .get();

      if (snapshotuserproperties.empty) {
        dispatch({ type: "SET_USER_PROPERTIES", payload: [] });
      } else {
        const properties = snapshotuserproperties.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_PROPERTIES", payload: properties });
      }

      const snapshotproperties = await firestore()
        .collection("properties")
        .get();

      if (snapshotproperties.empty) {
        dispatch({ type: "SET_PROPERTIES", payload: [] });
      } else {
        const properties = snapshotproperties.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_PROPERTIES", payload: properties });
      }

      dispatch({ type: "IS_LOADER", payload: false });
      const customMessage = await getFirebaseErrorMessage(
        "Property deleted successfully"
      );
      Toast.show({
        type: "success",
        text1: customMessage,
        position: "bottom",
      });
    } catch (error) {
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage(
        (error as any).code || "Failed to delete property"
      );
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
      });
    }
  };

export const updateProperty =
  (propertyId: string, formData: any, navigation: any) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: "IS_LOADER", payload: true });

      const propertyData = {
        title: formData.title,
        description: formData.description,
        otherDetails: formData.otherDetails,
        location: formData.location,
        images: formData.images,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection("properties")
        .doc(propertyId)
        .update(propertyData);

      // Fetch updated property
      const propertyDoc = await firestore()
        .collection("properties")
        .doc(propertyId)
        .get();
      const updatedProperty = {
        ...propertyDoc.data(),
        id: propertyDoc.id,
      };
      dispatch({ type: "SET_PROPERTY", payload: updatedProperty });

      // Update user properties list
      const snapshot = await firestore()
        .collection("properties")
        .where("createdBy", "==", formData.createdBy)
        .get();

      if (snapshot.empty) {
        dispatch({ type: "SET_USER_PROPERTIES", payload: [] });
      } else {
        const properties = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: "SET_USER_PROPERTIES", payload: properties });
      }

      dispatch({ type: "IS_LOADER", payload: false });
      const customMessage = await getFirebaseErrorMessage(
        "Property updated successfully"
      );
      Toast.show({
        type: "success",
        text1: customMessage,
        position: "bottom",
      });

      navigation.navigate("Tabs", { screen: "Home1" });
    } catch (error: any) {
      console.error("Update Property Error:", error);
      dispatch({ type: "IS_LOADER", payload: false });
      const errorMessage = await getFirebaseErrorMessage(
        "Failed to update property. Please try again."
      );
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
      });
    }
  };
