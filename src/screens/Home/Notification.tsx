import React, { useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Colors from "../../utilities/constants/colors";
import { Tick } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchNotificationsByUserID } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import Toast from "react-native-toast-message";
import { NotificationScreenNavigationProp } from "../../types/types";
import { useNavigation } from "@react-navigation/native";

const Notification: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const notifications = useAppSelector((state) => state.reducer.notifications);
  const user = useAppSelector((state) => state.reducer.user);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        dispatch(fetchNotificationsByUserID(user.userId));
      } else {
        const customMessage = await getFirebaseErrorMessage(
          "User not authenticated"
        );
        Toast.show({
          type: "error",
          text1: customMessage,
          position: "bottom",
        });
        navigation.navigate("Signin");
      }
    };

    fetchData();
  }, [dispatch, user?.userId]);


  const renderItem = ({ item }: any) => {
    const sentAtDate = new Date(item.sentAt._seconds * 1000);
    const date = sentAtDate.toLocaleDateString();
    const time = sentAtDate.toLocaleTimeString();

    return (
      <View style={styles.notificationWrapper}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconWrapper}>
            <Tick />
            <View style={styles.notificationTextWrapper}>
              <Text style={styles.notificationMessage}>
                {item.title || t("notiReceived")}
              </Text>
              <View style={styles.dateTimeWrapper}>
                <Text style={styles.dateText}>{date}</Text>
                <View style={styles.separatorLine} />
                <Text style={styles.timeText}>{time}</Text>
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
          {item.body || t("notiNoDetails")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("Notification")} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
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
