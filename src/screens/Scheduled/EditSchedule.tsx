import React, { useEffect } from "react";
import { StyleSheet, View, Platform, Text, TouchableOpacity, Modal } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import { RouteProp } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { TimePickerModal } from "react-native-paper-dates";
import moment from "moment";
import { Left, Right } from "../../assets/icons";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { scheduleBookingNotifications, deleteBookingNotifications } from '../../services/notificationService';

const EditSchedule: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditSchedule'>>();
  const booking = route.params?.booking;

  const [calendarVisible, setCalendarVisible] = React.useState(false);
  const [displayedMonth, setDisplayedMonth] = React.useState(new Date());
  const [markedDates, setMarkedDates] = React.useState<Record<string, any>>({});
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [checkInTimeVisible, setCheckInTimeVisible] = React.useState(false);
  const [checkOutTimeVisible, setCheckOutTimeVisible] = React.useState(false);
  const [isLocaleReady, setIsLocaleReady] = React.useState(false);
  // For time picker initial values
  const [checkInPickerTime, setCheckInPickerTime] = React.useState<{hours: number, minutes: number} | null>(null);
  const [checkOutPickerTime, setCheckOutPickerTime] = React.useState<{hours: number, minutes: number} | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.reducer.user);

  // Set initial selected dates and markedDates from booking.visitDates, and set calendar locale
  React.useEffect(() => {
    if (
      t("calendarData.monthNames") &&
      t("calendarData.monthNamesShort") &&
      t("calendarData.dayNames") &&
      t("calendarData.dayNamesShort") &&
      t("calendarData.today")
    ) {
      LocaleConfig.locales[DEFAULT_LANGUAGE] = {
        monthNames: t("calendarData.monthNames", { returnObjects: true }),
        monthNamesShort: t("calendarData.monthNamesShort", { returnObjects: true }),
        dayNames: t("calendarData.dayNames", { returnObjects: true }),
        dayNamesShort: t("calendarData.dayNamesShort", { returnObjects: true }),
        today: t("calendarData.today"),
      };
      LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
      setIsLocaleReady(true);
    }
    if (booking?.visitDates) {
      const [start, end] = booking.visitDates.split(" - ");
      const startMoment = moment(start, "MMM D, YYYY");
      const endMoment = moment(end, "MMM D, YYYY");
      if (startMoment.isValid() && endMoment.isValid()) {
        setStartDate(startMoment.format("YYYY-MM-DD"));
        setEndDate(endMoment.format("YYYY-MM-DD"));
        // Mark all dates in range
        const newMarkedDates: Record<string, any> = {};
        let current = startMoment.clone();
        while (current.isSameOrBefore(endMoment)) {
          const dateStr = current.format("YYYY-MM-DD");
          if (dateStr === startMoment.format("YYYY-MM-DD")) {
            newMarkedDates[dateStr] = {
              startingDay: true,
              color: colors.Primary_01,
              textColor: colors.white,
            };
          } else if (dateStr === endMoment.format("YYYY-MM-DD")) {
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
        setMarkedDates(newMarkedDates);
        setDisplayedMonth(startMoment.toDate());
      }
    }
  }, [t, booking?.visitDates]);

  // Helper for formatting date
  const formatDate = (dateStr: string) => {
    return moment(dateStr, "YYYY-MM-DD").format("MMM D, YYYY");
  };
  const formatMonth = (date: Date) => {
    const monthNames = t("calendarData.monthNames", { returnObjects: true }) as string[];
    return `${monthNames[date.getMonth()]}`;
  };

  // Helper to parse "hh:mm A" to {hours, minutes}
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 9, minutes: 0 }; // default 9:00 AM
    const m = moment(timeStr, ["hh:mm A", "YYYY-MM-DD hh:mm A"]);
    return {
      hours: m.isValid() ? m.hours() : 9,
      minutes: m.isValid() ? m.minutes() : 0,
    };
  };

  const validationSchema = Yup.object().shape({
    property: Yup.string().required(t("property") + " " + t("isRequired")),
    clientName: Yup.string().required(t("clientName") + " " + t("isRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("Email") + " " + t("isRequired")),
    phoneNum: Yup.string().required(t("phoneNum") + " " + t("isRequired")),
    visitDates: Yup.string().required(t("visitDates") + " " + t("isRequired")),
    checkInTime: Yup.string().required(t("checkInTime") + " " + t("isRequired")),
    checkOutTime: Yup.string().required(t("checkOutTime") + " " + t("isRequired")),
    advanceAmount: Yup.string()
      .required(t("advanceAmount") + " " + t("isRequired"))
      .test("is-number", t("mustBeNumber"), (value) => !isNaN(Number(value)))
      .test(
        "less-than-total",
        t("advanceAmount") + " cannot be greater than " + t("agreedPrice"),
        function (value) {
          const agreedPrice = parseFloat(this.parent.agreedPrice) || 0;
          const advanceAmount = parseFloat(value) || 0;
          return advanceAmount <= agreedPrice;
        }
      ),
    agreedPrice: Yup.string().required(t("agreedPrice") + " " + t("isRequired")),
    propertyId: Yup.string(),
    location: Yup.mixed(),
    numberOfVisitors: Yup.string(),
    numberOfInfants: Yup.string(),
  });

  const initialValues = booking ? {
    propertyId: booking.propertyId || "",
    location: booking.location || "",
    property: booking.property || "",
    clientName: booking.clientName || "",
    email: booking.email || "",
    phoneNum: booking.phoneNum || "",
    visitDates: booking.visitDates || "",
    checkInTime: booking.checkInTime
      ? moment(booking.checkInTime, ["YYYY-MM-DD hh:mm A", "hh:mm A"]).format("hh:mm A")
      : "",
    checkOutTime: booking.checkOutTime
      ? moment(booking.checkOutTime, ["YYYY-MM-DD hh:mm A", "hh:mm A"]).format("hh:mm A")
      : "",
    numberOfVisitors: booking.numberOfVisitors || "",
    numberOfInfants: booking.numberOfInfants || "",
    agreedPrice: booking.agreedPrice || "",
    advanceAmount: booking.advanceAmount || "",
  } : {
    propertyId: "",
    location: "",
    property: "",
    clientName: "",
    email: "",
    phoneNum: "",
    visitDates: "",
    checkInTime: "",
    checkOutTime: "",
    numberOfVisitors: "",
    numberOfInfants: "",
    agreedPrice: "",
    advanceAmount: "",
  };

  const handleUpdate = async (values: any) => {
    if (!booking?.id) {
      console.log("No booking id!");
      return;
    }
    try {
      const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return '';
        const [hoursMinutes, ampm] = time.split(' ');
        let [hours, minutes] = hoursMinutes.split(':').map(Number);
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        const dateTime = moment(`${date} ${hours}:${minutes}`, 'YYYY-MM-DD HH:mm');
        return dateTime.format('YYYY-MM-DD hh:mm A');
      };
      const formatDate = (dateStr: string) => moment(dateStr, "YYYY-MM-DD").format("MMM D, YYYY");
      const updatedData = {
        ...values,
        visitDates: startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : values.visitDates,
        checkInTime: startDate ? formatDateTime(startDate, values.checkInTime) : values.checkInTime,
        checkOutTime: endDate ? formatDateTime(endDate, values.checkOutTime) : values.checkOutTime,
      };
      console.log("Updating booking id:", booking.id);
      console.log("Data to update:", updatedData);
      await firestore().collection('schedules').doc(booking.id).update(updatedData);
      // Fetch schedules after update
      if (user?.userId) {
        const snapshot = await firestore()
          .collection("schedules")
          .where("createdBy", "==", user.userId)
          .get();
        if (snapshot.empty) {
          dispatch({ type: "SET_USER_SCHEDULES", payload: [] });
        } else {
          const schedules = snapshot.docs.map((doc: any) => ({
            ...doc.data(),
            id: doc.id,
          }));
          dispatch({ type: "SET_USER_SCHEDULES", payload: schedules });
        }
      }
      // Only update notifications if dates or times changed
      const didDatesOrTimesChange =
        updatedData.visitDates !== booking.visitDates ||
        updatedData.checkInTime !== booking.checkInTime ||
        updatedData.checkOutTime !== booking.checkOutTime;
      if (didDatesOrTimesChange) {
        await deleteBookingNotifications(booking.id);
        await scheduleBookingNotifications({
          ...updatedData,
          id: booking.id,
          createdBy: user?.userId,
        });
      }
      Toast.show({
        type: "success",
        text1: t("bookingUpdatedSuccessfully") || "Booking updated!",
        position: "bottom",
      });
      navigation.goBack();
    } catch (error) {
      console.log("Update error:", error);
      Toast.show({
        type: "error",
        text1: t("failedToUpdateBooking") || "Failed to update booking!",
        position: "bottom",
      });
    }
  };

  // When opening time pickers, set initial time
  const openCheckInTimePicker = (values: any) => {
    setCheckInPickerTime(parseTime(values.checkInTime));
    setCheckInTimeVisible(true);
  };
  const openCheckOutTimePicker = (values: any) => {
    setCheckOutPickerTime(parseTime(values.checkOutTime));
    setCheckOutTimeVisible(true);
  };

  return (
    <View style={styles.mainContainer}>
      <Header title={t("editBooking")} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
            <>
              <View style={styles.textInputSection}>
                <FormInput
                  label={t("property")}
                  placeholder={t("property")}
                  value={values.property}
                  onChangeText={handleChange("property")}
                  onBlur={handleBlur("property")}
                  error={touched.property && typeof errors.property === "string" ? errors.property : undefined}
                />
                <FormInput
                  label={t("clientName")}
                  placeholder={t("clientName")}
                  value={values.clientName}
                  onChangeText={handleChange("clientName")}
                  onBlur={handleBlur("clientName")}
                  error={touched.clientName && typeof errors.clientName === "string" ? errors.clientName : undefined}
                />
                <FormInput
                  label={t("email")}
                  placeholder={t("email")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && typeof errors.email === "string" ? errors.email : undefined}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FormInput
                  label={t("phoneNum")}
                  placeholder={t("phoneNum")}
                  value={values.phoneNum}
                  onChangeText={handleChange("phoneNum")}
                  onBlur={handleBlur("phoneNum")}
                  error={touched.phoneNum && typeof errors.phoneNum === "string" ? errors.phoneNum : undefined}
                  keyboardType="phone-pad"
                />
                {/* visitDates picker */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => setCalendarVisible(true)}>
                  <FormInput
                    label={t("visitDates")}
                    placeholder={t("visitDates")}
                    value={values.visitDates}
                    editable={false}
                    error={touched.visitDates && typeof errors.visitDates === "string" ? errors.visitDates : undefined}
                  />
                </TouchableOpacity>
                {/* checkInTime picker */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => openCheckInTimePicker(values)}>
                  <FormInput
                    label={t("checkInTime")}
                    placeholder={t("checkInTime")}
                    value={values.checkInTime}
                    editable={false}
                    error={touched.checkInTime && typeof errors.checkInTime === "string" ? errors.checkInTime : undefined}
                  />
                </TouchableOpacity>
                {/* checkOutTime picker */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => openCheckOutTimePicker(values)}>
                  <FormInput
                    label={t("checkOutTime")}
                    placeholder={t("checkOutTime")}
                    value={values.checkOutTime}
                    editable={false}
                    error={touched.checkOutTime && typeof errors.checkOutTime === "string" ? errors.checkOutTime : undefined}
                  />
                </TouchableOpacity>
                <FormInput
                  label={t("numberOfVisitors")}
                  placeholder={t("numberOfVisitors")}
                  value={values.numberOfVisitors}
                  onChangeText={handleChange("numberOfVisitors")}
                  onBlur={handleBlur("numberOfVisitors")}
                  error={touched.numberOfVisitors && typeof errors.numberOfVisitors === "string" ? errors.numberOfVisitors : undefined}
                />
                <FormInput
                  label={t("numberOfInfants")}
                  placeholder={t("numberOfInfants")}
                  value={values.numberOfInfants}
                  onChangeText={handleChange("numberOfInfants")}
                  onBlur={handleBlur("numberOfInfants")}
                  error={touched.numberOfInfants && typeof errors.numberOfInfants === "string" ? errors.numberOfInfants : undefined}
                />
                <FormInput
                  label={t("agreedPrice")}
                  placeholder={t("agreedPrice")}
                  value={values.agreedPrice}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    const formattedValue = parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : numericValue;
                    handleChange("agreedPrice")(formattedValue);
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(values.agreedPrice) || 0;
                    const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
                    setFieldValue("agreedPrice", formattedValue);
                    handleBlur("agreedPrice")(e);
                  }}
                  error={touched.agreedPrice && typeof errors.agreedPrice === "string" ? errors.agreedPrice : undefined}
                  keyboardType="decimal-pad"
                />
                <FormInput
                  label={t("advanceAmount")}
                  placeholder={t("advanceAmount")}
                  value={values.advanceAmount}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    const formattedValue = parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : numericValue;
                    const agreedPrice = parseFloat(values.agreedPrice) || 0;
                    const newAdvanceAmount = parseFloat(formattedValue) || 0;
                    if (newAdvanceAmount > agreedPrice) {
                      Toast.show({
                        type: "error",
                        text1: t("advanceAmount") + " cannot be greater than " + t("agreedPrice"),
                        position: "bottom",
                      });
                      return;
                    }
                    handleChange("advanceAmount")(formattedValue);
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(values.advanceAmount) || 0;
                    const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
                    setFieldValue("advanceAmount", formattedValue);
                    handleBlur("advanceAmount")(e);
                  }}
                  error={touched.advanceAmount && typeof errors.advanceAmount === "string" ? errors.advanceAmount : undefined}
                  keyboardType="decimal-pad"
                />
                <FormInput
                  label={t("balanceAmount")}
                  placeholder={t("balanceAmount")}
                  value={(() => {
                    const agreedPrice = parseFloat(values.agreedPrice) || 0;
                    const advance = parseFloat(values.advanceAmount) || 0;
                    const balance = agreedPrice - advance;
                    return Number.isInteger(balance) ? balance.toString() : balance.toFixed(2);
                  })()}
                  editable={false}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.createBTnContainer}>
                <CTAButton1
                  title={t("update")}
                  submitHandler={handleSubmit}
                />
              </View>
              {/* Date Range Picker Modal */}
              <Modal visible={calendarVisible} transparent animationType="fade">
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setCalendarVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                      <View style={styles.calendarModal}>
                        {isLocaleReady && (
                          <Calendar
                            key={displayedMonth.toISOString()}
                            hideExtraDays
                            markingType="period"
                            markedDates={markedDates}
                            onDayPress={(day) => {
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
                                const visitDates = `${formatDate(startDate)} - ${formatDate(day.dateString)}`;
                                setFieldValue("visitDates", visitDates);
                                setCalendarVisible(false);
                              }
                            }}
                            hideArrows
                            current={displayedMonth.toISOString().split("T")[0]}
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
                                <TouchableOpacity onPress={() => {
                                  const newMonth = new Date(displayedMonth);
                                  newMonth.setMonth(newMonth.getMonth() - 1);
                                  setDisplayedMonth(newMonth);
                                }}>
                                  <Left />
                                </TouchableOpacity>
                                <Text style={styles.headerMonthText}>{formatMonth(displayedMonth)}</Text>
                                <TouchableOpacity onPress={() => {
                                  const newMonth = new Date(displayedMonth);
                                  newMonth.setMonth(newMonth.getMonth() + 1);
                                  setDisplayedMonth(newMonth);
                                }}>
                                  <Right />
                                </TouchableOpacity>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
              {/* Time Pickers */}
              {checkInTimeVisible && checkInPickerTime && (
                <TimePickerModal
                  visible={checkInTimeVisible}
                  onDismiss={() => setCheckInTimeVisible(false)}
                  onConfirm={({ hours, minutes }) => {
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const formattedHours = hours % 12 || 12;
                    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
                    setFieldValue("checkInTime", formattedTime);
                    setCheckInTimeVisible(false);
                  }}
                  hours={checkInPickerTime.hours}
                  minutes={checkInPickerTime.minutes}
                  locale={t("language")}
                  label={t("checkInTime")}
                  cancelLabel={t("cancel")}
                  confirmLabel={t("ok")}
                  defaultInputType="keyboard"
                />
              )}
              {checkOutTimeVisible && checkOutPickerTime && (
                <TimePickerModal
                  visible={checkOutTimeVisible}
                  onDismiss={() => setCheckOutTimeVisible(false)}
                  onConfirm={({ hours, minutes }) => {
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const formattedHours = hours % 12 || 12;
                    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
                    setFieldValue("checkOutTime", formattedTime);
                    setCheckOutTimeVisible(false);
                  }}
                  hours={checkOutPickerTime.hours}
                  minutes={checkOutPickerTime.minutes}
                  locale={t("language")}
                  label={t("checkOutTime")}
                  cancelLabel={t("cancel")}
                  confirmLabel={t("ok")}
                  defaultInputType="keyboard"
                />
              )}
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: "5%",
    backgroundColor: colors.white,
  },
  textInputSection: {
    marginVertical: 15,
  },
  createBTnContainer: {
    marginTop: 10,
    marginBottom:40
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarModal: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width:'100%'
    // borderBottomWidth: 1,
    // borderBottomColor: colors.BORDER_COLOR,
  },
  headerMonthText: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    color: colors.black,
  },
});

export default EditSchedule; 