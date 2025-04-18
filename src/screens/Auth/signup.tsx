import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import screenResolution from "../../utilities/constants/screenResolution";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";

const validationSchema = Yup.object().shape({
  agencyName: Yup.string().required(t("agencyNameRequired")),
  ownerName: Yup.string().required(t("ownerNameRequired")),
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
  password: Yup.string()
    .min(6, t("passwordMin"))
    .required(t("passwordRequired")),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], t("passwordsMustMatch"))
    .required(t("confirmpasswordRequired")),
});

interface SignUpProps {
  navigation: any;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View style={{ flex: 8 }}>
        <ScrollView contentContainerStyle={styles.containerC1}>
        <Header title={t("pleaseRegisterHere")}/>
          <Text
            style={[
              Typography.f_20_nunito_bold,
              { marginTop: 20, color: colors.DARK_GREEN },
            ]}
          >
            {t("signup")}
          </Text>

          <Text
            style={[
              Typography.f_16_nunito_regular,
              { marginTop: 5, color: colors.DARK_GREEN },
            ]}
          >
            {t("registerEmailPrompt")}
          </Text>

          <Formik
            initialValues={{
              agencyName: "",
              ownerName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
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
              <View style={styles.containerc1_c2}>
                {/* Agency Name */}
                <View>
                  <Text style={styles.label}>{t("agencyName")}</Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={styles.input}
                      value={values.agencyName}
                      onChangeText={handleChange("agencyName")}
                      onBlur={handleBlur("agencyName")}
                      placeholder={t("agencyName")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                  </View>
                  {touched.agencyName && errors.agencyName && (
                    <Text style={styles.errorText}>{errors.agencyName}</Text>
                  )}
                </View>

                {/* Owner Name */}
                <View>
                  <Text style={styles.label}>{t("ownerName")}</Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={styles.input}
                      value={values.ownerName}
                      onChangeText={handleChange("ownerName")}
                      onBlur={handleBlur("ownerName")}
                      placeholder={t("ownerName")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                  </View>
                  {touched.ownerName && errors.ownerName && (
                    <Text style={styles.errorText}>{errors.ownerName}</Text>
                  )}
                </View>

                {/* Email Address */}
                <View>
                  <Text style={styles.label}>{t("emailAddress")}</Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={t("emailAddress")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password */}
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>{t("password")}</Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      secureTextEntry={showPassword}
                      style={styles.input}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={t("password")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      activeOpacity={0.8}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        style={styles.eyeIconStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Confirm Password */}
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>{t("confirmpassword")}</Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      secureTextEntry={showConfirmPassword}
                      style={styles.input}
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder={t("confirmpassword")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      activeOpacity={0.8}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Feather
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        style={styles.eyeIconStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <View style={{ marginTop: 40 }}>
                  <CTAButton1
                    title={t("signup")}
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
    label: {
      flexDirection: "row",
      top: 3,
      color: colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
    },
    inputContiner: {
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.black,
      borderRadius: 5,
      borderWidth: 0.3,
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      height: 50,
      color: colors.DARK_GREEN,
      width: "90%",
      ...Typography.f_12_nunito_medium,
    },
    errorText: {
      color: colors.Error_Red,
      ...Typography.f_14_nunito_medium,
      marginVertical: 5,
    },
    eyeIcon: {
      justifyContent: "center",
      alignItems: "center",
      width: "10%",
    },
    eyeIconStyle: {
      fontSize: RFValue(20, screenResolution.screenHeight),
      color: colors.DARK_GREEN,
    },
  });
};

export default SignUp;
