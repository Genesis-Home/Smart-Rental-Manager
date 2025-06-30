import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { t } from "i18next";
import { RFValue } from "react-native-responsive-fontsize";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import screenResolution from "../../utilities/constants/screenResolution";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import { useTranslation } from "react-i18next";
import { SignInProps } from "../../types/types";
import { loginUser } from "../../store/actions/action";
import { useAppDispatch } from "../../store/hooks";
import CheckBox from "@react-native-community/checkbox";
import { useAppSelector } from "../../store/hooks";

const validationSchema = Yup.object().shape({
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
  password: Yup.string()
    .min(6, t("passwordMin"))
    .required(t("passwordRequired")),
});

const SignIn: React.FC<SignInProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const [isSelectedRemember, setisSelectedRemember] = useState<boolean>(false);
  const [secureEntryState, setsecureEntryState] = useState<boolean>(true);

  const submit = (values: { email: string; password: string }) => {
    let credentials = {
      email: values.email,
      password: values.password,
    };
    dispatch(loginUser(credentials, isSelectedRemember, navigation));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View
        style={[
          styles.mainContainer,
          { marginTop: Platform.OS === "ios" ? 50 : 0 },
        ]}
      >
        <View style={{ flex: 8 }}>
          <Header title={t("pleaseLoginHere")} />
          <ScrollView
            contentContainerStyle={styles.containerC1}
            showsVerticalScrollIndicator={false}
          >
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
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={submit}
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
                    placeholder={t("email")}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <FormInput
                    label={t("password")}
                    placeholder={t("password")}
                    secureTextEntry={secureEntryState}
                    showToggle
                    onToggleSecure={() => setsecureEntryState(!secureEntryState)}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password && errors.password}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <CheckBox
                        tintColors={{
                          true: colors.Primary_01,
                          false: colors.Primary_01,
                        }}
                        disabled={false}
                        value={isSelectedRemember}
                        onValueChange={setisSelectedRemember}
                      />
                      <Text
                        style={[
                        styles.label,
                          Typography.f_14_nunito_medium,
                          { color: colors.Primary_01 },
                        ]}
                      >
                        {t("rememberme")}
                      </Text>
                    </View>
                    <Text
                      style={[
                        Typography.f_14_nunito_medium,
                        {
                          color: colors.DARK_GREEN,
                          paddingVertical: 10,
                        },
                      ]}
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      {t("forgotPassword")}
                    </Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <CTAButton1
                      title={t("signIn")}
                      submitHandler={handleSubmit}
                    />
                  </View>
                  <Text
                    onPress={() => navigation.navigate("Signup")}
                    style={[
                      Typography.f_16_nunito_semi_bold,
                      {
                        color: colors.DARK_GREEN,
                        paddingVertical: 10,
                        textAlign: "center",
                        marginTop: 20,
                      },
                    ]}
                  >
                    {t("donthaveaccount")} {" "}
                    <Text
                      style={[
                        { color: colors.Primary_01 },
                        Typography.f_16_nunito_bold,
                      ]}
                    >
                      {t("signup")}
                    </Text>
                  </Text>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      marginHorizontal: "5%",
    },
    containerC1: {
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
    label: {
      color: colors.black,
    },
  });
};

export default SignIn;
