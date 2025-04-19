import React from "react";
import { StyleSheet, View, ScrollView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";

interface AddScheduleProps {
  navigation: any;
}

const AddSchedule: React.FC<AddScheduleProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required(t("clientName") + " " + t("isRequired")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("Email") + " " + t("isRequired")),
    phoneNum: Yup.string().required(t("phoneNum") + " " + t("isRequired")),
    visitDateTime: Yup.string().required(
      t("visitDateTime") + " " + t("isRequired")
    ),
    propertyToVisit: Yup.string().required(
      t("propertyToVisitors") + " " + t("isRequired")
    ),
    numberOfVisitors: Yup.string().required(
      t("numberOfVisitors") + " " + t("isRequired")
    ),
    numberOfInfants: Yup.string().required(
      t("numberOfInfants") + " " + t("isRequired")
    ),
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
          <Header title={t("schedulePropertyVisit")} />
          <Formik
            initialValues={{
              clientName: "",
              email: "",
              phoneNum: "",
              visitDateTime: "",
              propertyToVisit: "",
              numberOfVisitors: "",
              numberOfInfants: "",
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
                  <FormInput
                    label={t("clientName")}
                    placeholder={t("clientName")}
                    value={values.clientName}
                    onChangeText={handleChange("clientName")}
                    onBlur={handleBlur("clientName")}
                    error={touched.clientName && errors.clientName}
                  />
                  <FormInput
                    label={t("Email")}
                    placeholder={t("Email")}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email}
                  />
                  <FormInput
                    label={t("phoneNum")}
                    placeholder={t("phoneNum")}
                    value={values.phoneNum}
                    onChangeText={handleChange("phoneNum")}
                    onBlur={handleBlur("phoneNum")}
                    error={touched.phoneNum && errors.phoneNum}
                  />
                  <FormInput
                    label={t("visitDateTime")}
                    placeholder={t("visitDateTime")}
                    value={values.visitDateTime}
                    onChangeText={handleChange("visitDateTime")}
                    onBlur={handleBlur("visitDateTime")}
                    error={touched.visitDateTime && errors.visitDateTime}
                  />
                  <FormInput
                    label={t("propertyToVisitors")}
                    placeholder={t("propertyToVisitors")}
                    value={values.propertyToVisit}
                    onChangeText={handleChange("propertyToVisit")}
                    onBlur={handleBlur("propertyToVisit")}
                    error={touched.propertyToVisit && errors.propertyToVisit}
                  />
                  <FormInput
                    label={t("numberOfVisitors")}
                    placeholder={t("numberOfVisitors")}
                    value={values.numberOfVisitors}
                    onChangeText={handleChange("numberOfVisitors")}
                    onBlur={handleBlur("numberOfVisitors")}
                    error={touched.numberOfVisitors && errors.numberOfVisitors}
                  />
                  <FormInput
                    label={t("numberOfInfants")}
                    placeholder={t("numberOfInfants")}
                    value={values.numberOfInfants}
                    onChangeText={handleChange("numberOfInfants")}
                    onBlur={handleBlur("numberOfInfants")}
                    error={touched.numberOfInfants && errors.numberOfInfants}
                  />
                </View>
                <View style={styles.createBTnContainer}>
                  <CTAButton1
                    title={t("createSchedule")}
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
    },
    createBTnContainer: {
      marginTop: 10,
    },
  });

export default AddSchedule;
