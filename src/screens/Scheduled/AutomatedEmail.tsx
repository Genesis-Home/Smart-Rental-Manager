import React from "react";
import { StyleSheet, View, Text, Share, Linking } from "react-native";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import {
  Address,
  Email,
  Whatsapp,
  Share as ShareIcon,
  Copy,
} from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const AutomatedEmail: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, "AutomatedEmail">>();
  const visit = route.params?.visitDetails;
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Map">>();
  const visitMessage = `${t("visitDetails")}\n${t("visitData")}: ${
    visit?.visitDates
  }, ${visit?.visitTime}\n${t("numberOfVisitors")}: ${
    visit?.numberOfVisitors
  }\n${t("numberOfInfants")}: ${visit?.numberOfInfants}\n${t(
    "propertyAddress"
  )}: ${visit?.location}`;

  const handleWhatsappShare = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(visitMessage)}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: "info",
        text1: t("whatsappNotInstall"),
        position: "bottom",
      });
    });
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: visitMessage,
      });
    } catch (error) {
      Toast.show({ type: "error", text1: t("shareErr"), position: "bottom" });
    }
  };

  const handleCopyData = () => {
    Clipboard.setString(visitMessage);
    Toast.show({ type: "success", text1: t("copyMsg"), position: "bottom" });
  };

  return (
    <View style={styles.screenWrapper}>
      <Header title={t("AutomatedEmail")} />

      <Email style={styles.emailIconStyle} />

      <Text style={styles.confirmationMessage}>{t("visitConfirmed")}</Text>

      <View style={styles.visitDetailsWrapper}>
        <Text style={styles.sectionTitle}>{t("visitDetails")}</Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("visitData")}: </Text>
          {visit?.visitDates},{visit?.visitTime}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("numberOfVisitors")}: </Text>
          {visit?.numberOfVisitors}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("numberOfInfants")}: </Text>
          {visit?.numberOfInfants}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("propertyAddress")}: </Text>
          {visit?.location?.address}
        </Text>
      </View>

      <View style={styles.mapLinkWrapper}>
        <Address />
        <Text
          onPress={() =>
            navigation.navigate("Map", { location: visit.location })
          }
          style={styles.googleMapsText}
        >
          {t("openInGoogleMaps")}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <CTAButton1
          title={t("Whatsapp")}
          submitHandler={handleWhatsappShare}
          icon={<Whatsapp />}
        />
        <CTAButton1
          title={t("ShareApp")}
          submitHandler={handleShareApp}
          backgroundColor={Colors.white}
          textColor={Colors.Primary_01}
          icon={<ShareIcon />}
        />
        <CTAButton1
          title={t("Copydata")}
          submitHandler={handleCopyData}
          backgroundColor={Colors.white}
          textColor={Colors.black}
          icon={<Copy />}
          borderColor={Colors.black}
        />
      </View>
    </View>
  );
};

export default AutomatedEmail;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  emailIconStyle: {
    alignSelf: "center",
    marginTop: 20,
  },
  confirmationMessage: {
    ...Typography.f_14_nunito_bold,
    color: Colors.black,
    textAlign: "center",
    marginTop: 15,
  },
  visitDetailsWrapper: {
    marginTop: 30,
    gap: 5,
  },
  sectionTitle: {
    ...Typography.f_14_nunito_bold,
    color: Colors.black,
  },
  detailRow: {
    ...Typography.f_14_nunito_regular,
    color: Colors.black,
  },
  detailLabel: {
    ...Typography.f_14_nunito_bold,
  },
  mapLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  googleMapsText: {
    ...Typography.f_14_nunito_semi_bold,
    color: Colors.Primary_01,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 15,
  },
});
