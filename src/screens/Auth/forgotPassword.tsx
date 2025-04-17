import React from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { BackIcon } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";

const validationSchema = Yup.object().shape({
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
});

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const dispatch = useDispatch();
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
              {t("recoverAccount")}
            </Text>
            <Text />
          </View>
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
                {/* Email Address Input */}
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
                      placeholder={"frank-williams@em"}
                      placeholderTextColor={colors.PLACE_HOLDER}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text
                      style={[
                        Typography.f_14_nunito_medium,
                        { color: colors.Error_Red, marginVertical: 5 },
                      ]}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
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

export default ForgotPassword;
