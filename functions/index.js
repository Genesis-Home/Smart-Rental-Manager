const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendScheduledNotifications = functions.pubsub
  .schedule("every 1 minutes")
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

    // Send notifications
    for (const notification of notifications) {
      try {
        // Get user's FCM tokens
        const userDoc = await admin
          .firestore()
          .collection("users")
          .doc(notification.userId)
          .get();

        const userTokens = userDoc.data()?.tokens || [];

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
