import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Address, Email, Whatsapp, Share, Copy } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { visitDetails } from "../../utilities/languageData/data";
import CTAButton1 from "../../components/CTA_BUTTON1";

const AutomatedEmail: React.FC = () => {
  const { t } = useTranslation();
  const visit = visitDetails[0];

  return (
    <View style={styles.screenWrapper}>
      <Header title={t("AutomatedEmail")} />

      <Email style={styles.emailIconStyle} />

      <Text style={styles.confirmationMessage}>{t("visitConfirmed")}</Text>

      <View style={styles.visitDetailsWrapper}>
        <Text style={styles.sectionTitle}>{t("visitDetails")}</Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("visitData")}: </Text>
          {visit.date}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("numberOfVisitors")}: </Text>
          {visit.numberOfVisitors}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("numberOfInfants")}: </Text>
          {visit.numberOfInfants}
        </Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("propertyAddress")}: </Text>
          {visit.propertyAddress}
        </Text>
      </View>

      <View style={styles.mapLinkWrapper}>
        <Address />
        <Text style={styles.googleMapsText}>{t("openInGoogleMaps")}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <CTAButton1
          title={t("Whatsapp")}
          submitHandler={() => console.log("Whatsapp")}
          icon={<Whatsapp />}
        />
        <CTAButton1
          title={t("ShareApp")}
          submitHandler={() => console.log("Share App")}
          backgroundColor={Colors.white}
          textColor={Colors.Primary_01}
          icon={<Share />}
        />
        <CTAButton1
          title={t("Copydata")}
          submitHandler={() => console.log("Copy data")}
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
