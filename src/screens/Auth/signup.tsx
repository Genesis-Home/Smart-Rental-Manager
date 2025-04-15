import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { t } from "i18next";
// local imports
import Images from "../../assets/images";
import { BackIcon } from "../../assets/icons";
import Feather from "react-native-vector-icons/Feather";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";
import screenResolution from "../../utilities/constants/screenResolution";
import CTAButton1 from "../../components/CTA_BUTTON1";
import * as Yup from "yup";
import { useFormik, FormikProps } from "formik";

interface SignupProps {
  navigation: any;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  rePassword: string;
  role: string;
}

export default function Signup({ navigation }: SignupProps) {
  const styles = createStyles(colors);

  const [role, setRole] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [secureEntryState, setSecureEntryState] = useState<boolean>(true);
  const [secureEntryState1, setSecureEntryState1] = useState<boolean>(true);

  const roles = ["User", "Provider"];

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    formik.setFieldValue("role", selectedRole);
    setModalVisible(false);
    formik.validateField("role");
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(t("fullnameRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    password: Yup.string()
      .min(6, t("passwordMin"))
      .required(t("passwordRequired")),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], t("passwordsDoNotMatch"))
      .required(t("confirmpasswordRequired")),
    role: Yup.string().required(t("roleRequired")),
  });

  const formik: FormikProps<FormValues> = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      rePassword: "",
      role: "",
    },
    validationSchema,
    onSubmit: (values: FormValues) => {
      let credentials = {
        ...values,
        dob: "",
        phone: "",
        gender: "",
        address: "",
        profilePhoto: "",
      };
      console.log(credentials, "CREDENTIALS");
    },
  });

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View
        style={{
          height: 200,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.Primary_01,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Signin")}
          activeOpacity={0.8}
          style={{ position: "absolute", left: 20, top: 20 }}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.containerc1_c1}>
          <Image
            resizeMode="contain"
            style={{ width: 250, height: 120 }}
            source={Images.Logo}
          />
        </View>
      </View>

      <View style={{ flex: 8 }}>
        <ScrollView contentContainerStyle={styles.containerC1}>
          <Text
            style={[
              Typography.f_14_poppins_medium,
              { marginTop: 20, color: colors.Primary_01 },
            ]}
          >
            {t("pleaseRegisterHere")}
          </Text>
          <View style={styles.containerc1_c2}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    { top: 3, color: colors.Primary_01 },
                    Typography.f_14_poppins_medium,
                  ]}
                >
                  {t("fullname")}
                </Text>
              </View>
              <View style={styles.inputContiner}>
                <TextInput
                  style={styles.input}
                  value={formik.values.fullName}
                  onChangeText={formik.handleChange("fullName")}
                  placeholder={t("fullname")}
                  placeholderTextColor={colors.Neutral_01}
                />
              </View>
              {formik.errors.fullName && formik.touched.fullName && (
                <Text
                  style={[
                    Typography.f_14_poppins_medium,
                    { color: colors.Error_Red },
                  ]}
                >
                  {formik.errors.fullName}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    { top: 3, color: colors.Primary_01 },
                    Typography.f_14_poppins_medium,
                  ]}
                >
                  {t("emailAddress")}
                </Text>
              </View>
              <View style={styles.inputContiner}>
                <TextInput
                  style={styles.input}
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  placeholder={t("email")}
                  placeholderTextColor={colors.Neutral_01}
                />
              </View>
              {formik.errors.email && formik.touched.email && (
                <Text
                  style={[
                    Typography.f_14_poppins_medium,
                    { color: colors.Error_Red },
                  ]}
                >
                  {formik.errors.email}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  { top: 3, color: colors.black },
                  Typography.f_14_poppins_medium,
                ]}
              >
                {t("role")}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                activeOpacity={0.8}
                style={styles.list}
              >
                <Text
                  style={[
                    Typography.f_14_poppins_medium,
                    { color: role ? colors.black : colors.Neutral_01 },
                  ]}
                >
                  {role ? role : "Select Role"}
                </Text>
                <Feather
                  name={modalVisible ? "chevron-up" : "chevron-down"}
                  style={{
                    fontSize: RFValue(20, screenResolution.screenHeight),
                    color: colors.Primary_01,
                  }}
                />
              </TouchableOpacity>
              {modalVisible && (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: colors.white,
                    borderColor: colors.Primary_01,
                    borderWidth: 1,
                    borderRadius: 7,
                    marginTop: 5,
                  }}
                >
                  {roles.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRoleSelect(item)}
                      activeOpacity={0.8}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text
                        style={[
                          Typography.f_14_poppins_medium,
                          { color: colors.black },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {formik.errors.role && formik.touched.role && (
              <Text
                style={[
                  Typography.f_14_poppins_medium,
                  { color: colors.Error_Red },
                ]}
              >
                {formik.errors.role}
              </Text>
            )}

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    { top: 3, color: colors.Primary_01 },
                    Typography.f_14_poppins_medium,
                  ]}
                >
                  {t("password")}
                </Text>
              </View>
              <View style={styles.inputContiner}>
                <TextInput
                  secureTextEntry={secureEntryState}
                  style={styles.input}
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  placeholder={t("password")}
                  placeholderTextColor={colors.Neutral_01}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "10%",
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSecureEntryState(!secureEntryState);
                  }}
                >
                  <Feather
                    name={secureEntryState ? "eye" : "eye-off"}
                    style={{
                      fontSize: RFValue(20, screenResolution.screenHeight),
                      color: colors.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {formik.errors.password && formik.touched.password && (
                <Text
                  style={[
                    Typography.f_14_poppins_medium,
                    { color: colors.Error_Red },
                  ]}
                >
                  {formik.errors.password}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    { top: 3, color: colors.Primary_01 },
                    Typography.f_14_poppins_medium,
                  ]}
                >
                  {t("confirmpassword")}
                </Text>
              </View>
              <View style={styles.inputContiner}>
                <TextInput
                  secureTextEntry={secureEntryState1}
                  style={styles.input}
                  value={formik.values.rePassword}
                  onChangeText={formik.handleChange("rePassword")}
                  placeholder={t("confirmpassword")}
                  placeholderTextColor={colors.Neutral_01}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "10%",
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSecureEntryState1(!secureEntryState1);
                  }}
                >
                  <Feather
                    name={secureEntryState1 ? "eye" : "eye-off"}
                    style={{
                      fontSize: RFValue(20, screenResolution.screenHeight),
                      color: colors.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {formik.errors.rePassword && formik.touched.rePassword && (
                <Text
                  style={[
                    Typography.f_14_poppins_medium,
                    { color: colors.Error_Red },
                  ]}
                >
                  {formik.errors.rePassword}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <CTAButton1
                title={t("signup")}
                submitHandler={formik.handleSubmit}
              />
            </View>
          </View>

          <View style={styles.containerc1_c3}>
            <TouchableOpacity
              style={styles.socialText}
              onPress={() => navigation.navigate("Signin")}
            >
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_medium,
                  { color: colors.Primary_01 },
                ]}
              >
                {t("alreadyhaveanaccount")}{" "}
              </Text>
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_bold,
                  { color: colors.Primary_01 },
                ]}
              >
                {" "}
                {t("signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    containerC1: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: "10%",
      paddingBottom: 50,
    },
    text: {
      fontWeight: "700",
      fontSize: RFValue(24, screenResolution.screenHeight),
      lineHeight: 32,
      letterSpacing: -0.3,
      color: colors.black,
    },
    label: {
      color: colors.black,
    },
    textInputYourEmail: {
      fontWeight: "700",
      fontSize: RFValue(16, screenResolution.screenHeight),
      lineHeight: 22,
      letterSpacing: -0.3,
      color: colors.black,
      marginBottom: 50,
    },
    containerc1_c1: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    containerc1_c2: {
      width: "100%",
      marginTop: 20,
    },
    containerc1_c3: {
      width: "100%",
      justifyContent: "flex-end",
    },
    inputContiner: {
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.Primary_01,
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      height: 50,
      color: colors.black,
      width: "90%",
      ...Typography.f_14_poppins_medium,
    },
    socialText: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    socialTextC1: {
      fontSize: RFValue(16, screenResolution.screenHeight),
      lineHeight: 38,
      letterSpacing: -0.3,
      color: colors.Neutral_01,
      fontWeight: "normal",
      textAlign: "center",
    },
    socialIcon: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 20,
    },
    iconSize: {
      width: 50,
      height: 50,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    list: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderColor: colors.Primary_01,
      borderWidth: 1,
      borderRadius: 7,
      height: 50,
      overflow: "hidden",
      backgroundColor: colors.white,
    },
  });
};
