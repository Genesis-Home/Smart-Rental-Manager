import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import Colors from "../../utilities/constants/colors";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";

interface CreateContactProps {
  navigation: any;
}

const CreateContact: React.FC<CreateContactProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("name") + " " + t("isRequired")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("emailAddress") + " " + t("isRequired")),
    phoneNum: Yup.string().required(t("phoneNum") + " " + t("isRequired")),
    notes: Yup.string().required(t("note") + " " + t("isRequired")),
  });

  const handleCreate = (values: any) => {
    console.log("Form Data:", values);
  };

  return (
    <View style={[styles.mainContainer, styles.platformMarginTop]}>
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header title={t("createContact")} />
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNum: "",
              notes: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleCreate}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.textInputSection}>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={[
                        Typography.f_16_nunito_medium,
                        { color: Colors.black, paddingLeft: 3 },
                      ]}
                    >
                      {t("name")}
                    </Text>
                    <TextInput
                      placeholder={t("name")}
                      placeholderTextColor={Colors.PLACE_HOLDER}
                      style={styles.textInput}
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                    />
                    {touched.name && errors.name && (
                      <Text style={{ color: Colors.Error_Red }}>
                        {errors.name}
                      </Text>
                    )}
                  </View>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={[
                        Typography.f_16_nunito_medium,
                        { color: Colors.black, paddingLeft: 3 },
                      ]}
                    >
                      {t("emailAddress")}
                    </Text>
                    <TextInput
                      placeholder={t("emailAddress")}
                      placeholderTextColor={Colors.PLACE_HOLDER}
                      style={styles.textInput}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                    />
                    {touched.email && errors.email && (
                      <Text style={{ color: Colors.Error_Red }}>
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={[
                        Typography.f_16_nunito_medium,
                        { color: Colors.black, paddingLeft: 3 },
                      ]}
                    >
                      {t("phoneNum")}
                    </Text>
                    <TextInput
                      placeholder={t("phoneNum")}
                      placeholderTextColor={Colors.PLACE_HOLDER}
                      style={styles.textInput}
                      value={values.phoneNum}
                      onChangeText={handleChange("phoneNum")}
                      onBlur={handleBlur("phoneNum")}
                    />
                    {touched.phoneNum && errors.phoneNum && (
                      <Text style={{ color: Colors.Error_Red }}>
                        {errors.phoneNum}
                      </Text>
                    )}
                  </View>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={[
                        Typography.f_16_nunito_medium,
                        { color: Colors.black, paddingLeft: 3 },
                      ]}
                    >
                      {t("note")}
                    </Text>
                    <TextInput
                      placeholder={`${t("note")}.....`}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      placeholderTextColor={Colors.PLACE_HOLDER}
                      style={styles.textInputMultiline}
                      value={values.notes}
                      onChangeText={handleChange("notes")}
                      onBlur={handleBlur("notes")}
                    />
                    {touched.notes && errors.notes && (
                      <Text style={{ color: Colors.Error_Red }}>
                        {errors.notes}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.createBTnContainer}>
                  <CTAButton1
                    title={t("create")}
                    submitHandler={handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    platformMarginTop: {
      marginTop: Platform.OS === "ios" ? 50 : 0,
    },
    contentContainer: {
      flex: 8,
    },
    scrollContainer: {
      marginHorizontal: "5%",
      paddingBottom: 50,
    },
    textInputSection: {
      marginVertical: 15,
      gap: 20,
    },
    textInput: {
      borderColor: colors.black,
      borderRadius: 5,
      borderWidth: 0.3,
      paddingHorizontal: 10,
      paddingVertical: 15,
      color: Colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
    },
    textInputMultiline: {
      borderColor: colors.black,
      borderRadius: 5,
      borderWidth: 0.3,
      paddingHorizontal: 10,
      paddingVertical: 15,
      color: Colors.DARK_GREEN,
      height: 120,
      ...Typography.f_14_nunito_medium,
    },
    createBTnContainer: {
      marginTop: 10,
    },
  });

export default CreateContact;
