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
import { Left, Right, Down, DropRight } from "../../assets/icons";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import { AddScheduleProps, Property } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSchedule } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import Toast from "react-native-toast-message";
import { fetchPropertiesByUserID } from "../../store/actions/action";
import { TimePickerModal } from "react-native-paper-dates";
import {
  fetchSchedulesByPropertyIdAndUserId,
  updatePropertyRevenue,
} from "../../store/actions/action";
import moment from "moment";

const AddSchedule: React.FC<AddScheduleProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const user = useAppSelector((state: any) => state.reducer.user);
  const userPropertySchedules = useAppSelector(
    (state: any) => state.reducer.userPropertySchedules
  );
  const userProperties = useAppSelector(
    (state: any) => state.reducer.userProperties
  );
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictingDates, setConflictingDates] = useState<
    { dates: string; clientName: string }[]
  >([]);

  useEffect(() => {
    if (selectedProperty?.id) {
      dispatch(
        fetchSchedulesByPropertyIdAndUserId(selectedProperty.id, user?.userId)
      );
    }
  }, [selectedProperty]);

  const handleShowDropdown = () => {
    setShowPropertyDropdown(!showPropertyDropdown);
  };

  const handleSelectApartment = (
    property: Property,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedProperty(property);
    setFieldValue("propertyId", property.id);
    setFieldValue("property", property.title);
    setShowPropertyDropdown(false);
  };

  useEffect(() => {
    if (
      t("calendarData.monthNames") &&
      t("calendarData.monthNamesShort") &&
      t("calendarData.dayNames") &&
      t("calendarData.dayNamesShort") &&
      t("calendarData.today")
    ) {
      LocaleConfig.locales[DEFAULT_LANGUAGE] = {
        monthNames: t("calendarData.monthNames", { returnObjects: true }),
        monthNamesShort: t("calendarData.monthNamesShort", {
          returnObjects: true,
        }),
        dayNames: t("calendarData.dayNames", { returnObjects: true }),
        dayNamesShort: t("calendarData.dayNamesShort", { returnObjects: true }),
        today: t("calendarData.today"),
      };
      LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
      setIsLocaleReady(true);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (user?.userId) {
        dispatch(fetchPropertiesByUserID(user.userId));
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

    initialize();
  }, [dispatch, user?.userId]);

  const validationSchema = Yup.object().shape({
    property: Yup.string().required(t("property") + " " + t("isRequired")),
    clientName: Yup.string().required(t("clientName") + " " + t("isRequired")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("Email") + " " + t("isRequired")),
    phoneNum: Yup.string().required(t("phoneNum") + " " + t("isRequired")),
    visitDates: Yup.string().required(t("visitDates") + " " + t("isRequired")),
    visitTime: Yup.string().required(t("visitTime") + " " + t("isRequired")),
    propertyToVisit: Yup.string().required(
      t("propertyToVisitors") + " " + t("isRequired")
    ),
    numberOfVisitors: Yup.string().required(
      t("numberOfVisitors") + " " + t("isRequired")
    ),
    numberOfInfants: Yup.string().required(
      t("numberOfInfants") + " " + t("isRequired")
    ),
    agreedPrice: Yup.string().required(
      t("agreedPrice") + " " + t("isRequired")
    ),
  });

  const handleCreate = async (formData: any) => {
    if (!startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: t("selectVisitDates"),
        position: "bottom",
      });
      return;
    }

    if (selectedProperty?.id) {
      const existingSchedules = userPropertySchedules.filter(
        (schedule: any) => schedule.propertyId === selectedProperty.id
      );

      const selectedStart = moment(startDate, "YYYY-MM-DD").startOf("day");
      const selectedEnd = moment(endDate, "YYYY-MM-DD").endOf("day");

      const conflicts: { dates: string; clientName: string }[] = [];

      existingSchedules.forEach((schedule: any) => {
        if (!schedule.visitDates || typeof schedule.visitDates !== "string")
          return;

        const [rangeStartStr, rangeEndStr] = schedule.visitDates.split(" - ");
        if (!rangeStartStr || !rangeEndStr) return;

        const rangeStart = moment(rangeStartStr.trim(), "MMM D, YYYY").startOf(
          "day"
        );
        const rangeEnd = moment(rangeEndStr.trim(), "MMM D, YYYY").endOf("day");

        if (!rangeStart.isValid() || !rangeEnd.isValid()) {
          console.error("Failed to parse dates:", rangeStartStr, rangeEndStr);
          return;
        }

        const hasOverlap = !(
          rangeEnd.isBefore(selectedStart) || rangeStart.isAfter(selectedEnd)
        );

        if (hasOverlap) {
          conflicts.push({
            dates: schedule.visitDates,
            clientName: schedule.clientName || "Unknown",
          });
        }
      });

      if (conflicts.length > 0) {
        setConflictingDates(conflicts);
        setConflictModalVisible(true);
        return;
      }

      dispatch(
        fetchSchedulesByPropertyIdAndUserId(selectedProperty.id, user?.userId)
      );

      const totalRevenue = userPropertySchedules.reduce(
        (acc: number, schedule: any) =>
          acc + parseFloat(schedule.agreedPrice || "0"),
        0
      );

      const newRevenue = totalRevenue + parseFloat(formData.agreedPrice || "0");

      formData.revenue = newRevenue;

      dispatch(addSchedule(formData, user?.userId, navigation));
      dispatch(updatePropertyRevenue(selectedProperty.id, newRevenue));
    }
  };

  const onDayPress = (
    day: { dateString: string },
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: colors.Primary_01,
          textColor: colors.white,
        },
      });
    } else {
      const start = moment(startDate, "YYYY-MM-DD").startOf("day");
      const end = moment(day.dateString, "YYYY-MM-DD").startOf("day");

      if (end.isBefore(start)) {
        setStartDate(day.dateString);
        setEndDate(null);
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            endingDay: true,
            color: colors.Primary_01,
            textColor: colors.white,
          },
        });
        return;
      }
      const newMarkedDates: Record<string, any> = {};
      let current = start.clone();

      while (current.isSameOrBefore(end)) {
        const dateStr = current.format("YYYY-MM-DD");
        if (dateStr === startDate) {
          newMarkedDates[dateStr] = {
            startingDay: true,
            color: colors.Primary_01,
            textColor: colors.white,
          };
        } else if (dateStr === day.dateString) {
          newMarkedDates[dateStr] = {
            endingDay: true,
            color: colors.Primary_01,
            textColor: colors.white,
          };
        } else {
          newMarkedDates[dateStr] = {
            color: "#b0dfdc",
            textColor: colors.black,
          };
        }
        current.add(1, "days");
      }

      setEndDate(day.dateString);
      setMarkedDates(newMarkedDates);

      const formatDate = (dateStr: string) => {
        return moment(dateStr, "YYYY-MM-DD").format("MMM D, YYYY");
      };

      const visitDates = `${formatDate(startDate)} - ${formatDate(
        day.dateString
      )}`;
      setFieldValue("visitDates", visitDates);
      setCalendarVisible(false);
    }
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
        <Header title={t("schedulePropertyVisit")} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{
              propertyId: "",
              property: "",
              clientName: "",
              email: "",
              phoneNum: "",
              visitDates: "",
              visitTime: "",
              propertyToVisit: "",
              numberOfVisitors: "",
              numberOfInfants: "",
              agreedPrice: "",
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
                  <Text style={styles.label}>{t("selectProperty")}</Text>
                  <TouchableOpacity
                    onPress={handleShowDropdown}
                    activeOpacity={0.8}
                    style={[
                      styles.optionButton,
                      {
                        borderColor: showPropertyDropdown
                          ? colors.Primary_01
                          : colors.black,
                        borderBottomLeftRadius: showPropertyDropdown ? 0 : 4,
                        borderBottomRightRadius: showPropertyDropdown ? 0 : 4,
                      },
                    ]}
                  >
                    <Text style={styles.optionText}>
                      {selectedProperty?.title || t("selectProperty")}
                    </Text>
                    {showPropertyDropdown ? <Down /> : <DropRight />}
                  </TouchableOpacity>
                  {showPropertyDropdown && (
                    <View style={styles.propertyDropdown}>
                      {userProperties.map((property: Property) => (
                        <TouchableOpacity
                          key={property.id}
                          style={styles.propertyOption}
                          onPress={() =>
                            handleSelectApartment(property, setFieldValue)
                          }
                        >
                          <Text style={styles.propertyText}>
                            {property.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
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
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCalendarVisible(true)}
                  >
                    <FormInput
                      label={t("visitDates")}
                      placeholder={t("visitDates")}
                      value={values.visitDates}
                      editable={false}
                      error={touched.visitDates && errors.visitDates}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setVisible(true)}
                  >
                    <FormInput
                      label={t("visitTime")}
                      placeholder={t("visitTime")}
                      value={values.visitTime}
                      editable={false}
                      error={touched.visitTime && errors.visitTime}
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
                    keyboardType="numeric"
                  />
                  <FormInput
                    label={t("numberOfInfants")}
                    placeholder={t("numberOfInfants")}
                    value={values.numberOfInfants}
                    onChangeText={handleChange("numberOfInfants")}
                    onBlur={handleBlur("numberOfInfants")}
                    error={touched.numberOfInfants && errors.numberOfInfants}
                    keyboardType="numeric"
                  />
                  <FormInput
                    label={t("agreedPrice")}
                    placeholder={t("agreedPrice")}
                    value={values.agreedPrice}
                    onChangeText={handleChange("agreedPrice")}
                    onBlur={handleBlur("agreedPrice")}
                    error={touched.agreedPrice && errors.agreedPrice}
                    keyboardType="decimal-pad"
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
                              hideExtraDays
                              markingType="period"
                              markedDates={markedDates}
                              onDayPress={(day) =>
                                onDayPress(day, setFieldValue)
                              }
                              hideArrows
                              current={
                                displayedMonth.toISOString().split("T")[0]
                              }
                              theme={{
                                todayTextColor: colors.Primary_01,
                                dayTextColor: colors.black,
                                textDayFontFamily: "Nunito-Medium",
                                textDayFontSize: 14,
                                textDayHeaderFontFamily: "Nunito-Medium",
                                textSectionTitleColor: colors.PLACE_HOLDER,
                              }}
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
                            />
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                {visible && (
                  <TimePickerModal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    onConfirm={({ hours, minutes }) => {
                      const ampm = hours >= 12 ? "PM" : "AM";
                      const formattedHours = hours % 12 || 12;
                      const formattedTime = `${formattedHours}:${minutes
                        .toString()
                        .padStart(2, "0")} ${ampm}`;
                      setFieldValue("visitTime", formattedTime);
                      setVisible(false);
                    }}
                    locale={i18n.language}
                    label={t("visitTime")}
                    cancelLabel={t("cancel")}
                    confirmLabel={t("ok")}
                    defaultInputType="keyboard"
                  />
                )}
                <Modal
                  visible={conflictModalVisible}
                  transparent
                  animationType="fade"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.conflictModal}>
                      <Text style={styles.conflictTitle}>
                        {t("datesAlreadyBooked")}
                      </Text>
                      <Text style={styles.conflictSubtitle}>
                        {t("conflictingDates")}:
                      </Text>

                      <ScrollView
                        style={styles.conflictList}
                        showsVerticalScrollIndicator={false}
                      >
                        {conflictingDates.map((conflict, index) => (
                          <View key={index} style={styles.conflictItem}>
                            <Text style={styles.conflictDate}>
                              {conflict.dates}
                            </Text>
                            <Text style={styles.conflictClient}>
                              {t("bookedBy")}: {conflict.clientName}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>

                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setConflictModalVisible(false)}
                      >
                        <Text style={styles.closeButtonText}>{t("ok")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
      gap: 25,
      borderWidth: 1,
      borderColor: colors.Neutral_01,
      padding: 13,
      borderRadius: 8,
    },
    headerMonthText: {
      ...Typography.f_14_nunito_bold,
      color: colors.black,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 4,
      borderWidth: 0.5,
      paddingHorizontal: 13,
      paddingVertical: 15,
    },
    optionText: {
      ...Typography.f_14_nunito_medium,
      color: colors.DARK_GREEN,
    },
    propertyOption: {
      paddingVertical: 12,
      paddingHorizontal: 13,
      borderBottomWidth: 1,
      borderBottomColor: colors.Neutral_01,
    },
    propertyText: {
      ...Typography.f_14_nunito_medium,
      color: colors.DARK_GREEN,
    },
    propertyDropdown: {
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.Primary_01,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      overflow: "hidden",
      marginTop: -1,
      zIndex: 10,
    },
    label: {
      color: colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
      marginBottom: 10,
    },
    conflictModal: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      width: "90%",
      maxHeight: "70%",
    },
    conflictTitle: {
      ...Typography.f_16_nunito_bold,
      color: colors.Primary_01,
      marginBottom: 10,
      textAlign: "center",
    },
    conflictSubtitle: {
      ...Typography.f_16_nunito_medium,
      color: colors.black,
      marginBottom: 15,
    },
    conflictList: {
      maxHeight: 200,
    },
    conflictItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.Neutral_01,
      paddingVertical: 10,
    },
    conflictDate: {
      ...Typography.f_14_nunito_bold,
      color: colors.DARK_GREEN,
    },
    conflictClient: {
      ...Typography.f_14_nunito_medium,
      color: colors.PLACE_HOLDER,
      marginTop: 5,
    },
    closeButton: {
      backgroundColor: colors.Primary_01,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 20,
    },
    closeButtonText: {
      ...Typography.f_16_nunito_bold,
      color: colors.white,
    },
  });

export default AddSchedule;
