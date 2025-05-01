import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../store/actions/action";
import { useDispatch } from "react-redux";
import { getApps } from 'firebase/app';



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
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const dispatch = useDispatch<any>();

  const isFirebaseConnected = getApps().length > 0;

  if(isFirebaseConnected){
    console.log('firebase connected!')
  }else{
    console.log('firebase connection failed!')
  }

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View style={{ flex: 8 }}>
        <Header title={t("pleaseRegisterHere")} />
        <ScrollView contentContainerStyle={styles.containerC1} showsVerticalScrollIndicator={false}>
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
            onSubmit={(values) => {
            dispatch(registerUser(values, navigation))
           
            }}
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
                  label={t("agencyName")}
                  placeholder={t("agencyName")}
                  value={values.agencyName}
                  onChangeText={handleChange("agencyName")}
                  onBlur={() => handleBlur("agencyName")}
                  error={touched.agencyName && errors.agencyName}
                />
                <FormInput
                  label={t("ownerName")}
                  placeholder={t("ownerName")}
                  value={values.ownerName}
                  onChangeText={handleChange("ownerName")}
                  onBlur={() => handleBlur("ownerName")}
                  error={touched.ownerName && errors.ownerName}
                />
                <FormInput
                  label={t("emailAddress")}
                  placeholder={t("emailAddress")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={() => handleBlur("email")}
                  error={touched.email && errors.email}
                  keyboardType="email-address"
                />
                <FormInput
                  label={t("password")}
                  placeholder={t("password")}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  error={touched.password && errors.password}
                  secureTextEntry={showPassword}
                  showToggle
                  onToggleSecure={() => setShowPassword(!showPassword)}
                />
                <FormInput
                  label={t("confirmpassword")}
                  placeholder={t("confirmpassword")}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  error={touched.confirmPassword && errors.confirmPassword}
                  secureTextEntry={showConfirmPassword}
                  showToggle
                  onToggleSecure={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
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
      marginHorizontal: "5%",
    },
    containerC1: {
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
  });
};

export default SignUp;
