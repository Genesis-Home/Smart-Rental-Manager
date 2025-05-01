import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
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
  const [secureEntryState, setsecureEntryState] = useState<boolean>(true);

  const submit = (values: { email: string; password: string }) => {
    let credentials = {
      email: values.email,
      password: values.password,
    };
    dispatch(loginUser(credentials, null, navigation));
  };

  return (
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
            // onSubmit={() => navigation.navigate("Tabs")}
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
  });
};

export default SignIn;
