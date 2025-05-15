const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendScheduledNotifications = functions
    .region("us-central1")
    .pubsub.schedule("every 1 minutes")
    .onRun(async (context) => {
      const now = admin.firestore.Timestamp.now();

      // Get all notifications that are due
      const snapshot = await admin
          .firestore()
          .collection("scheduledNotifications")
          .where("scheduledTime", "<=", now)
          .get();

      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(notifications, "notifications");

      // Send notifications
      for (const notification of notifications) {
        try {
        // Get user's FCM tokens
          const userDoc = await admin
              .firestore()
              .collection("users")
              .doc(notification.userId)
              .get();

          const userData = userDoc.data();
          const userTokens = userData && userData.tokens ? userData.tokens : [];

          if (userTokens.length > 0) {
          // Send to all user devices
            await admin.messaging().sendMulticast({
              tokens: userTokens,
              notification: {
                title: notification.title,
                body: notification.body,
              },
              data: {
                type: notification.type,
                bookingId: notification.bookingId,
              },
            });
          }

          // Delete the scheduled notification
          await admin
              .firestore()
              .collection("scheduledNotifications")
              .doc(notification.id)
              .delete();
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }

      return null;
    });
