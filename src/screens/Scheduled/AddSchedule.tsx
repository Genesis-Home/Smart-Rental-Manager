import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Left, Right } from "../../assets/icons";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";

interface AddScheduleProps {
  navigation: any;
}

const AddSchedule: React.FC<AddScheduleProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    LocaleConfig.locales[DEFAULT_LANGUAGE] = {
      monthNames: t("calendarData.monthNames", { returnObjects: true }),
      monthNamesShort: t("calendarData.monthNamesShort", {
        returnObjects: true,
      }),
      dayNames: t("calendarData.dayNames", { returnObjects: true }),
      dayNamesShort: t("calendarData.dayNamesShort", {
        returnObjects: true,
      }),
      today: t("calendarData.today"),
    };
    LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
    setIsLocaleReady(true);
  }, []);

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
    navigation.navigate("AutomatedEmail");
  };

  const handleDaySelect = (
    day: { dateString: string },
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedDate(day.dateString);
    setFieldValue("visitDateTime", day.dateString);
    setCalendarVisible(false);
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(displayedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setDisplayedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(displayedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setDisplayedMonth(newMonth);
  };

  const formatMonth = (date: Date) => {
    const monthNames = t("calendarData.monthNames", {
      returnObjects: true,
    }) as string[];
    return `${monthNames[date.getMonth()]}`;
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
              clientName: "Smart Rental",
              email: "smartrental@gmail.com",
              phoneNum: "45301",
              visitDateTime:
                selectedDate || new Date().toISOString().split("T")[0],
              propertyToVisit: "2",
              numberOfVisitors: "2",
              numberOfInfants: "2",
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
              setFieldValue,
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
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCalendarVisible(true)}
                  >
                    <FormInput
                      label={t("visitDateTime")}
                      placeholder={t("visitDateTime")}
                      value={values.visitDateTime}
                      editable={false}
                      error={touched.visitDateTime && errors.visitDateTime}
                    />
                  </TouchableOpacity>
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
                <Modal
                  visible={calendarVisible}
                  transparent
                  animationType="fade"
                >
                  <TouchableWithoutFeedback
                    onPress={() => setCalendarVisible(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.calendarModal}>
                          {isLocaleReady && (
                            <Calendar
                              key={displayedMonth.toISOString()}
                              current={
                                displayedMonth.toISOString().split("T")[0]
                              }
                              onDayPress={(day) =>
                                handleDaySelect(day, setFieldValue)
                              }
                              hideExtraDays
                              hideArrows
                              markedDates={
                                selectedDate
                                  ? {
                                      [selectedDate]: {
                                        selected: true,
                                        selectedColor: colors.Primary_01,
                                      },
                                    }
                                  : {}
                              }
                              renderHeader={() => (
                                <View style={styles.calendarHeader}>
                                  <TouchableOpacity onPress={handlePrevMonth}>
                                    <Left />
                                  </TouchableOpacity>
                                  <Text style={styles.headerMonthText}>
                                    {formatMonth(displayedMonth)}
                                  </Text>
                                  <TouchableOpacity onPress={handleNextMonth}>
                                    <Right />
                                  </TouchableOpacity>
                                </View>
                              )}
                              theme={{
                                todayTextColor: colors.Primary_01,
                                dayTextColor: colors.black,
                                textDayFontSize: 14,
                                textDayFontFamily: "Nunito-Medium",
                                textDayHeaderFontFamily: "Nunito-Medium",
                                textSectionTitleColor: colors.PLACE_HOLDER,
                              }}
                            />
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    calendarModal: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 15,
      width: "90%",
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      gap: 25,
    },
    headerMonthText: {
      ...Typography.f_14_nunito_bold,
      color: colors.black,
    },
  });

export default AddSchedule;
