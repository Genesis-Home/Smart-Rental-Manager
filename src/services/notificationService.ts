import notifee, {
  AndroidImportance,
  EventType,
  TriggerType,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

// Function to log FCM token for testing
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

// Setup notification handlers
export const setupNotificationHandlers = () => {
  // Log FCM token on setup
  logFCMToken();

  // Handle FCM notifications
  messaging().onMessage(async (remoteMessage) => {
    console.log("Received FCM message:", remoteMessage);
    // Display notification when app is in foreground
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

  // Handle notification clicks
  notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      // Handle notification click
      console.log("Notification clicked:", detail.notification);
      // You can add navigation logic here
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      // Handle notification click when app is in background
      console.log("Background notification clicked:", detail.notification);
      // You can add navigation logic here
    }
  });
};

// Function to schedule booking notifications
export async function scheduleBookingNotifications(bookingData: any) {
  try {
    // Request permission
    await notifee.requestPermission();

    // Ensure channel is created
    await notifee.createChannel({
      id: "bookings",
      name: "Booking Notifications",
      importance: AndroidImportance.HIGH,
    });

    // Parse dates and time
    const [startStr, endStr] = bookingData.visitDates.split(" - ");
    const checkInDate = moment(startStr, "MMM D, YYYY");
    const checkOutDate = moment(endStr, "MMM D, YYYY");

    // Parse visit time
    const [timeStr, period] = bookingData.visitTime.split(" ");
    const [hours, minutes] = timeStr.split(":");
    let visitHour = parseInt(hours);
    if (period === "PM" && visitHour !== 12) visitHour += 12;
    if (period === "AM" && visitHour === 12) visitHour = 0;

    // Set the time for check-in and check-out dates
    checkInDate.hours(visitHour).minutes(parseInt(minutes)).seconds(0);
    checkOutDate.hours(visitHour).minutes(parseInt(minutes)).seconds(0);

    try {
      // Get FCM token for current device
      const fcmToken = await messaging().getToken();

      // Update user's FCM tokens in Firestore
      await firestore()
        .collection("users")
        .doc(bookingData.createdBy)
        .update({
          tokens: firestore.FieldValue.arrayUnion(fcmToken),
        });
    } catch (tokenError) {
      console.log("Error handling FCM token:", tokenError);
      // Continue with local notifications even if FCM fails
    }

    // Schedule check-in notification (exactly 24 hours before)
    const checkInNotificationDate = checkInDate.clone().subtract(1, "day");
    if (checkInNotificationDate.isAfter(moment())) {
      // Schedule local notification
      await notifee.createTriggerNotification(
        {
          title: "Upcoming Check-in",
          body: `Your booking for ${bookingData.property} starts tomorrow at ${bookingData.visitTime}!`,
          android: {
            channelId: "bookings",
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: "default",
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: checkInNotificationDate.valueOf(),
        }
      );

      // Schedule FCM notification
      try {
        await firestore()
          .collection("scheduledNotifications")
          .add({
            title: "Upcoming Check-in",
            body: `Your booking for ${bookingData.property} starts tomorrow at ${bookingData.visitTime}!`,
            scheduledTime: checkInNotificationDate.toDate(),
            type: "check-in",
            bookingId: bookingData.id,
            userId: bookingData.createdBy,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (fcmError) {
        console.log("Error scheduling FCM notification:", fcmError);
        // Continue with local notifications even if FCM fails
      }
    }

    // Schedule check-in notification (exactly 1 hour before)
    const checkInOneHourBefore = checkInDate.clone().subtract(1, "hour");
    if (checkInOneHourBefore.isAfter(moment())) {
      // Schedule local notification
      await notifee.createTriggerNotification(
        {
          title: "Check-in Reminder",
          body: `Your check-in is in 1 hour at ${bookingData.visitTime}!`,
          android: {
            channelId: "bookings",
            importance: AndroidImportance.HIGH,
            pressAction: { id: "default" },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: checkInOneHourBefore.valueOf(),
        }
      );
      // Schedule FCM notification
      try {
        await firestore()
          .collection("scheduledNotifications")
          .add({
            title: "Check-in Reminder",
            body: `Your check-in is in 1 hour at ${bookingData.visitTime}!`,
            scheduledTime: checkInOneHourBefore.toDate(),
            type: "check-in-1hr",
            bookingId: bookingData.id,
            userId: bookingData.createdBy,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (fcmError) {
        console.log("Error scheduling 1hr FCM notification:", fcmError);
      }
    }

    // Schedule check-out notification (exactly 24 hours before)
    const checkOutNotificationDate = checkOutDate.clone().subtract(1, "day");
    if (checkOutNotificationDate.isAfter(moment())) {
      // Schedule local notification
      await notifee.createTriggerNotification(
        {
          title: "Upcoming Check-out",
          body: `Your booking for ${bookingData.property} ends tomorrow at ${bookingData.visitTime}!`,
          android: {
            channelId: "bookings",
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: "default",
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: checkOutNotificationDate.valueOf(),
        }
      );

      // Schedule FCM notification
      try {
        await firestore()
          .collection("scheduledNotifications")
          .add({
            title: "Upcoming Check-out",
            body: `Your booking for ${bookingData.property} ends tomorrow at ${bookingData.visitTime}!`,
            scheduledTime: checkOutNotificationDate.toDate(),
            type: "check-out",
            bookingId: bookingData.id,
            userId: bookingData.createdBy,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (fcmError) {
        console.log("Error scheduling FCM notification:", fcmError);
        // Continue with local notifications even if FCM fails
      }
    }

    // Schedule check-out notification (exactly 1 hour before)
    const checkOutOneHourBefore = checkOutDate.clone().subtract(1, "hour");
    if (checkOutOneHourBefore.isAfter(moment())) {
      // Schedule local notification
      await notifee.createTriggerNotification(
        {
          title: "Check-out Reminder",
          body: `Your check-out is in 1 hour at ${bookingData.visitTime}!`,
          android: {
            channelId: "bookings",
            importance: AndroidImportance.HIGH,
            pressAction: { id: "default" },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: checkOutOneHourBefore.valueOf(),
        }
      );
      // Schedule FCM notification
      try {
        await firestore()
          .collection("scheduledNotifications")
          .add({
            title: "Check-out Reminder",
            body: `Your check-out is in 1 hour at ${bookingData.visitTime}!`,
            scheduledTime: checkOutOneHourBefore.toDate(),
            type: "check-out-1hr",
            bookingId: bookingData.id,
            userId: bookingData.createdBy,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (fcmError) {
        console.log("Error scheduling 1hr FCM notification:", fcmError);
      }
    }

    // Save notification data
    const notificationData = {
      title: "Booking Created",
      body: `Booking created for ${bookingData.property} from ${bookingData.visitDates} at ${bookingData.visitTime}`,
      time: new Date().toISOString(),
      type: "booking",
      bookingData: bookingData,
    };

    const existingNotifications = await AsyncStorage.getItem("notifications");
    const notificationsArray = existingNotifications
      ? JSON.parse(existingNotifications)
      : [];

    notificationsArray.push(notificationData);
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(notificationsArray)
    );
  } catch (error) {
    console.error("Error scheduling booking notifications:", error);
  }
}

// Function to get stored notifications
export async function getStoredNotifications() {
  try {
    const storedNotifications = await AsyncStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
