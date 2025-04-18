import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import Feather from "react-native-vector-icons/Feather";
import { RFValue } from "react-native-responsive-fontsize";

import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import Colors from "../../utilities/constants/colors";
import screenResolution from "../../utilities/constants/screenResolution";

import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";

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

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Header title={t("recoverAccount")} />
        {/* Title & Subtitle */}
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
              {/* Password Field */}
              <Text style={styles.label}>{t("password")}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="**************"
                  placeholderTextColor={colors.PLACE_HOLDER}
                  secureTextEntry={secureEntry}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setSecureEntry(!secureEntry)}
                >
                  <Feather
                    name={secureEntry ? "eye" : "eye-off"}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Submit Button */}
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
    },
    scrollContent: {
      marginHorizontal: "6%",
      paddingBottom: 50,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 40,
      marginBottom: 10,
    },
    headerText: {
      color: Colors.DARK_GREEN,
      ...Typography.f_17_nunito_bold,
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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 0.3,
      borderColor: colors.black,
      borderRadius: 5,
      backgroundColor: colors.white,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    input: {
      height: 50,
      flex: 1,
      color: Colors.DARK_GREEN,
      ...Typography.f_12_nunito_medium,
    },
    iconContainer: {
      paddingLeft: 10,
    },
    eyeIcon: {
      fontSize: RFValue(20, screenResolution.screenHeight),
      color: Colors.DARK_GREEN,
    },
    errorText: {
      color: colors.Error_Red,
      marginTop: 5,
      ...Typography.f_14_nunito_medium,
    },
    buttonWrapper: {
      marginTop: 20,
    },
  });

export default ResetPassword;
