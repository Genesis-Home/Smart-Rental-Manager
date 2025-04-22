import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import Colors from "../../utilities/constants/colors";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import { useTranslation } from "react-i18next";


const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, t("passwordMin"))
    .required(t("passwordRequired")),
});

interface ResetPasswordProps {
  navigation: any;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ navigation }) => {
  const [secureEntry, setSecureEntry] = useState(true);
  const styles = createStyles(colors);
  const { t} = useTranslation();


  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <Header title={t("recoverAccount")} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("resetpassword")}</Text>
        <Text style={styles.subtitle}>{t("enternewpassword")}</Text>
        <Formik
          initialValues={{ password: "" }}
          validationSchema={validationSchema}
          onSubmit={() => navigation.navigate("Tabs")}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <FormInput
                label={t("password")}
                placeholder="**************"
                secureTextEntry={secureEntry}
                showToggle
                onToggleSecure={() => setSecureEntry(!secureEntry)}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
              />
              <View style={styles.buttonWrapper}>
                <CTAButton1
                  title={t("changePassword")}
                  submitHandler={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      marginHorizontal: "5%",
    },
    scrollContent: {
      paddingBottom: 50,
    },
    title: {
      color: Colors.DARK_GREEN,
      marginTop: 20,
      ...Typography.f_20_nunito_bold,
    },
    subtitle: {
      color: Colors.DARK_GREEN,
      marginTop: 5,
      ...Typography.f_16_nunito_regular,
    },
    formContainer: {
      marginTop: 20,
      width: "100%",
    },
    label: {
      color: Colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
    },
    buttonWrapper: {
      marginTop: 20,
    },
  });

export default ResetPassword;
