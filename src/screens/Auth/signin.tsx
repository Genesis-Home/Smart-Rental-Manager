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
import { BackIcon } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";

const validationSchema = Yup.object().shape({
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
  password: Yup.string()
    .min(6, t("passwordMin"))
    .required(t("passwordRequired")),
});

interface SignInProps {
  navigation: any;
}

const SignIn: React.FC<SignInProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const [secureEntryState, setsecureEntryState] = useState<boolean>(true);

  // const submit = (values: {email: string; password: string}) => {
  //   let credentials = {
  //     email: values.email,
  //     password: values.password,
  //   };
  //   // dispatch(loginUser(credentials));
  // };

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View style={{ flex: 8 }}>
        <ScrollView contentContainerStyle={styles.containerC1}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 40,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text
              style={[
                { color: Colors.DARK_GREEN },
                Typography.f_17_nunito_bold,
              ]}
            >
              {t("pleaseLoginHere")}
            </Text>
            <Text />
          </View>
          <Text
            style={[
              Typography.f_20_nunito_bold,
              { marginTop: 20, color: colors.DARK_GREEN },
            ]}
          >
            {t("signIn")}
          </Text>
          <Text
            style={[
              Typography.f_16_nunito_regular,
              { marginTop: 5, color: colors.DARK_GREEN },
            ]}
          >
            {t("loginEmailPrompt")}
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            // onSubmit={submit}
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
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        { top: 3, color: colors.DARK_GREEN },
                        Typography.f_14_nunito_medium,
                      ]}
                    >
                      {t("emailAddress")}
                    </Text>
                  </View>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={t("email")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        { color: colors.Error_Red },
                      ]}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        { top: 3, color: colors.DARK_GREEN },
                        Typography.f_14_nunito_medium,
                      ]}
                    >
                      {t("password")}
                    </Text>
                  </View>
                  <View style={styles.inputContiner}>
                    <TextInput
                      secureTextEntry={secureEntryState}
                      style={styles.input}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={t("password")}
                      placeholderTextColor={colors.PLACE_HOLDER}
                    />
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "10%",
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        setsecureEntryState(!secureEntryState);
                      }}
                    >
                      <Feather
                        name={secureEntryState ? "eye" : "eye-off"}
                        style={{
                          fontSize: RFValue(20, screenResolution.screenHeight),
                          color: colors.DARK_GREEN,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        { color: colors.Error_Red },
                      ]}
                    >
                      {errors.password}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text
                    style={[
                      Typography.f_14_nunito_medium,
                      {
                        textAlign: "right",
                        color: colors.DARK_GREEN,
                        paddingVertical: 10,
                      },
                    ]}
                    onPress={() => navigation.navigate("ForgotPassword")}
                  >
                    {t("forgotPassword")}
                  </Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                  <CTAButton1
                    title={t("signIn")}
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
    text: {
      fontWeight: "700",
      fontSize: RFValue(24, screenResolution.screenHeight),
      lineHeight: 32,
      letterSpacing: -0.3,
      color: colors.black,
    },
    containerc1_c2: {
      width: "100%",
      marginTop: 20,
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
  });
};

export default SignIn;
