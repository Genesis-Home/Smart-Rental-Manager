import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";
import Colors from "../../utilities/constants/colors";

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Header title={t("termsConditions")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.textHeader}>
            {t("termsConditions")}
            {"\n"} {t("effectiveDate")}
            {"\n"}
            {t("termsAndConditionsTitle")}
            {"\n"}
            {t("accountUse")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("accountUseDetails")}
            {"\n"}
            <View style={styles.divider} /> {t("accountUseDetails1")}
            {"\n"} {t("appPurpose")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("appPurposeDetails")}
            {"\n"}
            <View style={styles.divider} /> {t("appPurposeDetails1")}
            {"\n"} {t("dataPrivacy")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("dataPrivacyDetails")}
            {"\n"}
            <View style={styles.divider} /> {t("dataPrivacyDetails1")}
            {"\n"} {t("communication")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("communicationDetails")}
            {"\n"} {t("emailsAndSharing")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("emailsAndSharingDetails")}
            {"\n"}
            <View style={styles.divider} /> {t("emailsAndSharingDetails1")}
            {"\n"} {t("DataExport")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("dataExportDetails")}
            {"\n"} {t("security")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("securityDetails")}
            {"\n"} {t("termination")}
          </Text>
          <Text style={styles.textHeader}>
            <View style={styles.divider} /> {t("terminationDetails")}
            {"\n"}
            <View style={styles.divider} /> {t("terminationDetails1")}
            {"\n"} {t("Contact")}
            {"\n"} {t("Eemail")}
            {"\n"} {t("Address")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  contentContainer: {
    marginTop: 15,
    marginBottom: 40,
  },
  textHeader: {
    ...Typography.f_14_nunito_bold,
    color: Colors.DARK_GRAY,
    lineHeight: 25,
  },
  divider: {
    height: 5,
    width: 5,
    borderRadius: 50,
    backgroundColor: Colors.DARK_GRAY,
    marginVertical: 10,
  },
});
