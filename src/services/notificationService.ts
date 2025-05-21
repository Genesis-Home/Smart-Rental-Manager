import notifee, {
  AndroidImportance,
  EventType,
} from "@notifee/react-native";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

export const logFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const setupNotificationHandlers = () => {
  logFCMToken();

  messaging().onMessage(async (remoteMessage) => {
    console.log("Received FCM message:", remoteMessage);
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: "bookings",
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: "default",
        },
      },
    });
  });

  notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log("Notification clicked:", detail.notification);
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log("Background notification clicked:", detail.notification);
    }
  });
};

export async function scheduleBookingNotifications(bookingData: any) {
  try {
    if (!bookingData) {
      console.error("No booking data provided");
      return;
    }

    if (!bookingData.createdBy) {
      console.error("No user ID provided in booking data");
      return;
    }

    if (
      !bookingData.visitDates ||
      !bookingData.visitTime ||
      !bookingData.property
    ) {
      console.error("Missing required booking information");
      return;
    }

    const [startStr, endStr] = bookingData.visitDates.split(" - ");
    const checkInDate = moment(startStr, "MMM D, YYYY");
    const checkOutDate = moment(endStr, "MMM D, YYYY");

    const [timeStr, period] = bookingData.visitTime.split(" ");
    const [hours, minutes] = timeStr.split(":");
    let visitHour = parseInt(hours);
    if (period === "PM" && visitHour !== 12) visitHour += 12;
    if (period === "AM" && visitHour === 12) visitHour = 0;

    checkInDate.hours(visitHour).minutes(parseInt(minutes)).seconds(0);
    checkOutDate.hours(visitHour).minutes(parseInt(minutes)).seconds(0);

    try {
      const fcmToken = await messaging().getToken();

      await firestore()
        .collection("users")
        .doc(bookingData.createdBy)
        .update({
          tokens: firestore.FieldValue.arrayUnion(fcmToken),
        });
    } catch (tokenError) {
      console.log("Error handling FCM token:", tokenError);
      return;
    }

    const checkInNotificationDate = checkInDate.clone().subtract(1, "day");
    if (checkInNotificationDate.isAfter(moment())) {
      try {
        const notificationData = {
          title: "Upcoming Check-in",
          body: `Your booking for ${bookingData.property} starts tomorrow at ${bookingData.visitTime}!`,
          scheduledTime: checkInNotificationDate.toDate(),
          type: "check-in",
          bookingId: bookingData.id || null,
          userId: bookingData.createdBy,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        const notificationRef = await firestore()
          .collection("scheduledNotifications")
          .add(notificationData);
        console.log(
          "Created check-in notification with ID:",
          notificationRef.id
        );
      } catch (fcmError) {
        console.error("Error scheduling FCM notification:", fcmError);
        Toast.show({
          type: "error",
          text1: "Failed to schedule check-in notification",
          position: "bottom",
        });
      }
    }

    const checkInOneHourBefore = checkInDate.clone().subtract(1, "hour");
    if (checkInOneHourBefore.isAfter(moment())) {
      try {
        const notificationData = {
          title: "Check-in Reminder",
          body: `Your check-in is in 1 hour at ${bookingData.visitTime}!`,
          scheduledTime: checkInOneHourBefore.toDate(),
          type: "check-in-1hr",
          bookingId: bookingData.id || null,
          userId: bookingData.createdBy,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        const notificationRef = await firestore()
          .collection("scheduledNotifications")
          .add(notificationData);
        console.log(
          "Created 1hr check-in notification with ID:",
          notificationRef.id
        );
      } catch (fcmError) {
        console.error("Error scheduling 1hr FCM notification:", fcmError);
        Toast.show({
          type: "error",
          text1: "Failed to schedule 1-hour check-in notification",
          position: "bottom",
        });
      }
    }

    const checkOutNotificationDate = checkOutDate.clone().subtract(1, "day");
    if (checkOutNotificationDate.isAfter(moment())) {
      try {
        const notificationData = {
          title: "Upcoming Check-out",
          body: `Your booking for ${bookingData.property} ends tomorrow at ${bookingData.visitTime}!`,
          scheduledTime: checkOutNotificationDate.toDate(),
          type: "check-out",
          bookingId: bookingData.id || null,
          userId: bookingData.createdBy,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        const notificationRef = await firestore()
          .collection("scheduledNotifications")
          .add(notificationData);
        console.log(
          "Created check-out notification with ID:",
          notificationRef.id
        );
      } catch (fcmError) {
        console.error("Error scheduling FCM notification:", fcmError);
        Toast.show({
          type: "error",
          text1: "Failed to schedule check-out notification",
          position: "bottom",
        });
      }
    }

    const checkOutOneHourBefore = checkOutDate.clone().subtract(1, "hour");
    if (checkOutOneHourBefore.isAfter(moment())) {
      try {
        const notificationData = {
          title: "Check-out Reminder",
          body: `Your check-out is in 1 hour at ${bookingData.visitTime}!`,
          scheduledTime: checkOutOneHourBefore.toDate(),
          type: "check-out-1hr",
          bookingId: bookingData.id || null,
          userId: bookingData.createdBy,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        const notificationRef = await firestore()
          .collection("scheduledNotifications")
          .add(notificationData);
        console.log(
          "Created 1hr check-out notification with ID:",
          notificationRef.id
        );
      } catch (fcmError) {
        console.error("Error scheduling 1hr FCM notification:", fcmError);
        Toast.show({
          type: "error",
          text1: "Failed to schedule 1-hour check-out notification",
          position: "bottom",
        });
      }
    }
  } catch (error) {
    console.error("Error scheduling booking notifications:", error);
  }
}

