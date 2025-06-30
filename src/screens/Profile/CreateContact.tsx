import React from "react";
import { StyleSheet, View, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../store/hooks";
import { useSelector } from "react-redux";
import { addContact } from "../../store/actions/action";
import { NavigationProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";

const CreateContact: React.FC<{ navigation: NavigationProp<any> }> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.reducer.user);
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("name") + " " + t("isRequired")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("emailAddress") + " " + t("isRequired")),
    phoneNum: Yup.string().required(t("phoneNum") + " " + t("isRequired")),
    // notes: Yup.string().required(t("note") + " " + t("isRequired")),
  });

  const handleCreate = async (values: any, resetForm: () => void) => {
    if (user?.userId) {
      try {
        await dispatch(addContact(values, user.userId, navigation));
        resetForm();
      } catch (err) {
        // error toast ya handling (optional)
      }
    } else {
      const customMessage = await getFirebaseErrorMessage(
        "User not authenticated"
      );
      Toast.show({
        type: "error",
        text1: customMessage,
        position: "bottom",
      });
      navigation.navigate("Signin");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View style={[styles.mainContainer, styles.platformMarginTop]}>
        <View style={styles.contentContainer}>
          <Header title={t("createContact")} />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={{
                name: "",
                email: "",
                phoneNum: "",
                notes: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) =>
                handleCreate(values, resetForm)
              }
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
                    <FormInput
                      label={t("name")}
                      placeholder={t("name")}
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      error={touched.name && errors.name}
                    />
                    <FormInput
                      label={t("emailAddress")}
                      placeholder={t("emailAddress")}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      error={touched.email && errors.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <FormInput
                      label={t("phoneNum")}
                      placeholder={t("phoneNum")}
                      value={values.phoneNum}
                      onChangeText={handleChange("phoneNum")}
                      onBlur={handleBlur("phoneNum")}
                      error={touched.phoneNum && errors.phoneNum}
                      keyboardType="phone-pad"
                    />
                    <FormInput
                      label={t("note")}
                      placeholder={`${t("note")}.....`}
                      multiline
                      numberOfLines={5}
                      value={values.notes}
                      onChangeText={handleChange("notes")}
                      onBlur={handleBlur("notes")}
                      error={touched.notes && errors.notes}
                    />
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
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      marginHorizontal: "5%",
      backgroundColor: colors.white,
    },
    platformMarginTop: {
      marginTop: Platform.OS === "ios" ? 50 : 0,
    },
    contentContainer: {
      flex: 8,
    },
    scrollContainer: {
      paddingBottom: 50,
    },
    textInputSection: {
      marginVertical: 15,
    },
    createBTnContainer: {
      marginTop: 10,
    },
  });

export default CreateContact;
