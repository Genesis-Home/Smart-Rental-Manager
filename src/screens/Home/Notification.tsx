import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Colors from "../../utilities/constants/colors";
import { Tick } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import {
  getStoredNotifications,
  logFCMToken,
} from "../../services/notificationService";
import Header from "../../components/Header";

const Notification: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  console.log(notifications, "notifications");

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getStoredNotifications();
      setNotifications(data);

      // Test FCM token
      const token = await logFCMToken();
      console.log("FCM Token for testing:", token);
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.notificationWrapper}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconWrapper}>
            <Tick />
            <View style={styles.notificationTextWrapper}>
              <Text style={styles.notificationMessage}>
                {t("notiReceived")}
              </Text>
              <View style={styles.dateTimeWrapper}>
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={styles.separatorLine} />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </View>
          {item.status === "new" && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{t("notiNew")}</Text>
            </View>
          )}
        </View>
        <Text style={styles.notificationDetails}>
          {item.notiMsg[i18n.language] || item.notiMsg["en"]}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("Notification")} />
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  notificationWrapper: {
    marginTop: 30,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  notificationTextWrapper: {
    gap: 5,
  },
  notificationMessage: {
    ...Typography.f_16_nunito_semi_bold,
    color: Colors.black,
  },
  dateTimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    ...Typography.f_14_nunito_regular,
    color: Colors.PLACE_HOLDER,
  },
  separatorLine: {
    height: 15,
    width: 1.5,
    backgroundColor: Colors.PLACE_HOLDER,
  },
  timeText: {
    ...Typography.f_14_nunito_regular,
    color: Colors.PLACE_HOLDER,
  },
  statusBadge: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Primary_01,
  },
  statusText: {
    ...Typography.f_14_nunito_semi_bold,
    color: Colors.white,
  },
  notificationDetails: {
    ...Typography.f_14_nunito_regular,
    color: Colors.PLACE_HOLDER,
    marginTop: 10,
    lineHeight: 20,
  },
});
