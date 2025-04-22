import type React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Header from "../../components/Header";
import { colors } from "../../utilities/constants";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t("privacyPolicy")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 15, marginBottom: 40 }}>
          <Text
            style={[
              Typography.f_14_nunito_bold,
              { color: colors.DARK_GRAY, lineHeight: 25 },
            ]}
          >
            {t("privacyPolicy")}
            {"\n"} {t("effectiveDate")} {"\n"}
            {t("appPurposeDetails")}
            {"\n"}
            1. {t("dataWeCollect")}: {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("agencyUserDetails")} {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("propertyInfo")} {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("clientVisitDetails")}
            {"\n"}
            2. {t("howWeUseIt")}:{"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("secureLogin")} {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("scheduleManage")} {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("sendConfirmation")}
            {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("exportVisitData")}
            {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("shareVisitInfo")} {"\n"}
            3. {t("privacySecurity")}:{"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("dataIsolation")}
            {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("passwordEncryption")}
            {"\n"}
            {"  "}
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 50,
                backgroundColor: colors.DARK_GRAY,
                marginVertical: 10,
              }}
            />{" "}
            {t("secureDataStorage")} {"\n"}
            4. {t("yourControl")}:{"\n"}
            {t("accountControl")} {"\n"}
            {t("Contact")}:{"\n"}
            {t("Eemail")}
            {"\n"}
            {t("Address")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: "5%",
  },
});
