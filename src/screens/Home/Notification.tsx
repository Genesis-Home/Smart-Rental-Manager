import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { BackIcon, Tick } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";

const Notification: React.FC = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const notifications = [
    {
      id: "1",
      notiMsg: {
        en: "Your reservation has been confirmed.",
        sp: "Su reserva ha sido confirmada.",
      },
      status: "new",
      date: "2025-04-18",
      time: "09:24 AM",
    },
    {
      id: "2",
      notiMsg: {
        en: "Payment received successfully.",
        sp: "Pago recibido con éxito.",
      },
      status: "new",
      date: "2025-04-17",
      time: "02:14 PM",
    },
    {
      id: "3",
      notiMsg: {
        en: "Reminder: Your bike rental ends tomorrow.",
        sp: "Recordatorio: Su alquiler de bicicleta termina mañana.",
      },
      status: "read",
      date: "2025-04-16",
      time: "11:00 AM",
    },
    {
      id: "4",
      notiMsg: {
        en: "New offer available in your area!",
        sp: "¡Nueva oferta disponible en su área!",
      },
      status: "read",
      date: "2025-04-15",
      time: "06:45 PM",
    },
    {
      id: "5",
      notiMsg: {
        en: "Profile updated successfully.",
        sp: "Perfil actualizado con éxito.",
      },
      status: "read",
      date: "2025-04-14",
      time: "10:30 AM",
    },
  ];

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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{t("Notification")}</Text>
        <Text />
      </View>
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
  },
  scrollViewContent: {
    marginHorizontal: "5%",
    paddingBottom: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: "5%",
  },
  title: {
    color: Colors.DARK_GREEN,
    ...Typography.f_17_nunito_bold,
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
