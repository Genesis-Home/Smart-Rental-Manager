import React from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";

const validationSchema = Yup.object().shape({
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
});

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View style={{ flex: 8 }}>
        <ScrollView contentContainerStyle={styles.containerC1}>
          <Header title={t("recoverAccount")} />
          <Text
            style={[
              Typography.f_20_nunito_bold,
              { marginTop: 20, color: colors.DARK_GREEN },
            ]}
          >
            {t("resetEmail")}
          </Text>
          <Text
            style={[
              Typography.f_16_nunito_regular,
              { marginTop: 5, color: colors.DARK_GREEN },
            ]}
          >
            {t("enteryouremail")}
          </Text>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={() => navigation.navigate("ResetPassword")}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.containerc1_c2}>
                <FormInput
                  label={t("emailAddress")}
                  placeholder="frank-williams@em"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={{ marginTop: 10 }}>
                  <CTAButton1
                    title={t("sendEmail")}
                    submitHandler={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    containerC1: {
      marginHorizontal: "6%",
      paddingBottom: 50,
    },
    containerc1_c2: {
      width: "100%",
      marginTop: 20,
    },
  });
};

export default ForgotPassword;
