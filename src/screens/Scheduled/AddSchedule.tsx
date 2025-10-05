import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
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
import { addSchedule, fetchContactsByUserID, fetchSchedulesByPropertyIdAndUserId } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import Toast from "react-native-toast-message";
import { fetchPropertiesByUserID } from "../../store/actions/action";
import { TimePickerModal } from "react-native-paper-dates";
import {
  updatePropertyRevenue,
} from "../../store/actions/action";
import moment from "moment";
import Colors from "../../utilities/constants/colors";
import { useFocusEffect } from "@react-navigation/native";

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
  const userContacts = useAppSelector((state: any) => state.reducer.contacts);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [checkOutTimeVisible, setCheckOutTimeVisible] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictingDates, setConflictingDates] = useState<
    { dates: string; clientName: string }[]
  >([]);
  const [useExistingContact, setUseExistingContact] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (selectedProperty?.id) {
        dispatch(
          fetchSchedulesByPropertyIdAndUserId(selectedProperty.id, user?.userId)
        );
      }
    }, [selectedProperty, user?.userId, dispatch])
  );

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

  const handleContactSelection = (
    contact: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedContact(contact);
    setFieldValue("clientName", contact.name);
    setFieldValue("email", contact.emailAddress);
    setFieldValue("phoneNum", contact.phoneNumber);
    setShowContactDropdown(false);
  };

  const handleContactTypeChange = (
    useExisting: boolean,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setUseExistingContact(useExisting);
    if (useExisting) {
      setFieldValue("clientName", "");
      setFieldValue("email", "");
      setFieldValue("phoneNum", "");
      setSelectedContact(null);
    } else {
      setSelectedContact(null);
    }
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
        dispatch(fetchContactsByUserID(user.userId));
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
    clientName: Yup.string().when("$useExistingContact", {
      is: false,
      then: (schema) =>
        schema.required(t("clientName") + " " + t("isRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string().when("$useExistingContact", {
      is: false,
      then: (schema) =>
        schema
          .email(t("invalidEmail"))
          .required(t("Email") + " " + t("isRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    phoneNum: Yup.string().when("$useExistingContact", {
      is: false,
      then: (schema) => schema.required(t("phoneNum") + " " + t("isRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    visitDates: Yup.string().required(t("visitDates") + " " + t("isRequired")),
    checkInTime: Yup.string()
      .required(t("checkInTime") + " " + t("isRequired")),
    checkOutTime: Yup.string()
      .required(t("checkOutTime") + " " + t("isRequired")),
    advanceAmount: Yup.string()
      .required(t("advanceAmount") + " " + t("isRequired"))
      .test("is-number", t("mustBeNumber"), (value) => !isNaN(Number(value)))
      .test(
        "less-than-total",
        "Down payment cannot be greater than agreed price",
        function (value) {
          const agreedPrice = parseFloat(this.parent.agreedPrice) || 0;
          const advanceAmount = parseFloat(value) || 0;
          return advanceAmount <= agreedPrice;
        }
      ),
    agreedPrice: Yup.string().required(
      t("agreedPrice") + " " + t("isRequired")
    ),
  });

  const handleCreate = async (formData: any) => {
    const agreedPrice = parseFloat(formData.agreedPrice) || 0;
    const advanceAmount = parseFloat(formData.advanceAmount) || 0;

    if (advanceAmount > agreedPrice) {
      Toast.show({
        type: "error",
        text1: "Down payment cannot be greater than agreed price",
        position: "bottom",
      });
      return;
    }

    if (!startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: t("selectVisitDates"),
        position: "bottom",
      });
      return;
    }

    if (!selectedProperty?.id) {
      Toast.show({
        type: "error",
        text1: t("pleaseSelectProperty"),
        position: "bottom",
      });
      return;
    }

    let finalFormData = { ...formData };

    if (useExistingContact && selectedContact) {
      finalFormData.clientName = selectedContact.name;
      finalFormData.email = selectedContact.emailAddress;
      finalFormData.phoneNum = selectedContact.phoneNumber;
    } else if (useExistingContact && !selectedContact) {
      Toast.show({
        type: "error",
        text1: t("pleaseSelectContact"),
        position: "bottom",
      });
      return;
    }

    if (!finalFormData.clientName || !finalFormData.email || !finalFormData.phoneNum) {
      Toast.show({
        type: "error",
        text1: t("pleaseFillAllRequiredFields"),
        position: "bottom",
      });
      return;
    }

    if (selectedProperty?.id) {
      const existingSchedules = userPropertySchedules.filter(
        (schedule: any) => schedule.propertyId === selectedProperty.id
      );

      const selectedStart = moment(startDate, "YYYY-MM-DD").startOf("day");
      const selectedEnd = moment(endDate, "YYYY-DD-MM").endOf("day");

      const conflicts: { dates: string; clientName: string }[] = [];
      let timeConflictMessage = '';

      existingSchedules.forEach((schedule: any) => {
        if (!schedule.visitDates || typeof schedule.visitDates !== "string")
          return;

        const [rangeStartStr, rangeEndStr] = schedule.visitDates.split(" - ");

        if (!rangeStartStr || !rangeEndStr) return;

        const rangeStart = moment(rangeStartStr.trim(), "MMM D, YYYY").startOf("day");
        const rangeEnd = moment(rangeEndStr.trim(), "MMM D, YYYY").endOf("day");

        if (!rangeStart.isValid() || !rangeEnd.isValid()) {
          console.error("Failed to parse dates:", rangeStartStr, rangeEndStr);
          return;
        }

        if (selectedStart.isAfter(rangeEnd)) {
          // No conflict
        } else if (selectedStart.isSame(rangeEnd, 'day')) {
          // Same day: check full datetime
          const prevCheckoutDateTime = moment(schedule.checkOutTime, 'YYYY-MM-DD HH:mm');
          const newCheckinDateTime = moment(`${startDate} ${finalFormData.checkInTime}`, 'YYYY-MM-DD HH:mm');
          if (!prevCheckoutDateTime.isValid() || !newCheckinDateTime.isValid()) {
            // fallback to old logic if parsing fails
            const parseTime = (timeStr: string) => {
              if (!timeStr) return 0;
              const [time, period] = timeStr.split(' ');
              const [hours, minutes] = time.split(':').map(Number);
              let hour24 = hours;
              if (period === 'PM' && hours !== 12) hour24 += 12;
              if (period === 'AM' && hours === 12) hour24 = 0;
              return hour24 * 60 + minutes;
            };
            const prevCheckoutTime = parseTime(schedule.checkOutTime);
            const newCheckinTime = parseTime(finalFormData.checkInTime);
            if (newCheckinTime <= prevCheckoutTime) {
              timeConflictMessage = `Check-in allowed only after ${prevCheckoutDateTime.format('D MMM YYYY, h:mm A')}`;
            }
          } else {
            if (newCheckinDateTime.isSameOrBefore(prevCheckoutDateTime)) {
              timeConflictMessage = `Check-in allowed only after ${prevCheckoutDateTime.format('D MMM YYYY, h:mm A')}`;
            }
          }
        } else if (selectedStart.isBetween(rangeStart, rangeEnd, undefined, '[]')) {
          // Overlap: not allowed
          conflicts.push({
            dates: schedule.visitDates,
            clientName: schedule.clientName,
          });
        }
      });

      if (timeConflictMessage) {
        Toast.show({
          type: 'error',
          text1: timeConflictMessage,
          position: 'bottom',
        });
        return;
      }
      if (conflicts.length > 0) {
        setConflictingDates(conflicts);
        setConflictModalVisible(true);
        return;
      }

      // Format check-in and check-out as full datetime strings in 12-hour format with AM/PM
      const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return '';
        const [hoursMinutes, ampm] = time.split(' ');
        let [hours, minutes] = hoursMinutes.split(':').map(Number);
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        // Create a moment object and format as 12-hour with AM/PM
        const dateTime = moment(`${date} ${hours}:${minutes}`, 'YYYY-MM-DD HH:mm');
        return dateTime.format('YYYY-MM-DD hh:mm A');
      };

      const scheduleData = {
        ...finalFormData,
        propertyId: selectedProperty.id,
        location: selectedProperty.location,
        visitDates: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        userId: user?.userId,
        createdAt: new Date(),
        revenue: parseFloat(finalFormData.agreedPrice || "0"),
        checkInTime: formatDateTime(startDate, finalFormData.checkInTime),
        checkOutTime: formatDateTime(endDate, finalFormData.checkOutTime),
        notes: selectedProperty?.notes || "",
      };

      dispatch(addSchedule(scheduleData, user?.userId, navigation));
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

  const formatDate = (dateStr: string) => {
    return moment(dateStr, "YYYY-MM-DD").format("MMM D, YYYY");
  };

  const formatMonth = (date: Date) => {
    const monthNames = t("calendarData.monthNames", {
      returnObjects: true,
    }) as string[];
    return `${monthNames[date.getMonth()]}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
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
              }}
              validationSchema={validationSchema}
              context={{ useExistingContact }}
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
                            onPress={() => {
                              handleSelectApartment(property, setFieldValue);
                              setFieldValue("location", property.location);
                            }}
                          >
                            <Text style={styles.propertyText}>
                              {property.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {touched.property && errors.property && (
                      <Text
                        style={[
                          Typography.f_14_nunito_medium,
                          { color: Colors.Error_Red, marginTop: 5 },
                        ]}
                      >
                        {errors.property}
                      </Text>
                    )}

                    <View style={styles.contactTypeSection}>
                      <Text style={styles.label}>{t("contactType")}</Text>
                      <View style={styles.radioGroup}>
                        <TouchableOpacity
                          style={styles.radioOption}
                          onPress={() =>
                            handleContactTypeChange(false, setFieldValue)
                          }
                        >
                          <View
                            style={[
                              styles.radioButton,
                              !useExistingContact && styles.radioButtonSelected,
                            ]}
                          >
                            {!useExistingContact && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={styles.radioLabel}>{t("newContact")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.radioOption}
                          onPress={() =>
                            handleContactTypeChange(true, setFieldValue)
                          }
                        >
                          <View
                            style={[
                              styles.radioButton,
                              useExistingContact && styles.radioButtonSelected,
                            ]}
                          >
                            {useExistingContact && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={styles.radioLabel}>
                            {t("existingContact")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {useExistingContact ? (
                      <View>
                        <Text style={styles.label}>{t("selectContact")}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            setShowContactDropdown(!showContactDropdown)
                          }
                          activeOpacity={0.8}
                          style={[
                            styles.optionButton,
                            {
                              borderColor: showContactDropdown
                                ? colors.Primary_01
                                : colors.black,
                              borderBottomLeftRadius: showContactDropdown ? 0 : 4,
                              borderBottomRightRadius: showContactDropdown
                                ? 0
                                : 4,
                            },
                          ]}
                        >
                          <Text style={styles.optionText}>
                            {selectedContact?.name || t("selectContact")}
                          </Text>
                          {showContactDropdown ? <Down /> : <DropRight />}
                        </TouchableOpacity>
                        {showContactDropdown && (
                          <View style={styles.contactDropdown}>
                            {userContacts.map((contact: any) => (
                              <TouchableOpacity
                                key={contact.id}
                                style={styles.contactOption}
                                onPress={() =>
                                  handleContactSelection(contact, setFieldValue)
                                }
                              >
                                <Text style={styles.contactText}>
                                  {contact.name} - {contact.emailAddress}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                        {selectedContact && (
                          <View style={styles.selectedContactDetails}>
                            <Text style={styles.detailRow}>
                              <Text style={styles.detailLabel}>
                                {t("Email")}:{" "}
                              </Text>
                              <Text style={styles.detailValue}>
                                {selectedContact.emailAddress}
                              </Text>
                            </Text>
                            <Text style={styles.detailRow}>
                              <Text style={styles.detailLabel}>
                                {t("phoneNum")}:{" "}
                              </Text>
                              <Text style={styles.detailValue}>
                                {" "}
                                {selectedContact.phoneNumber}
                              </Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <>
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
                      </>
                    )}

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
                        label={t("checkInTime")}
                        placeholder={t("checkInTime")}
                        value={values.checkInTime}
                        editable={false}
                        error={touched.checkInTime && errors.checkInTime}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setCheckOutTimeVisible(true)}
                    >
                      <FormInput
                        label={t("checkOutTime")}
                        placeholder={t("checkOutTime")}
                        value={values.checkOutTime}
                        editable={false}
                        error={touched.checkOutTime && errors.checkOutTime}
                      />
                    </TouchableOpacity>

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
                      onChangeText={(text) => {
                        // Remove any non-numeric characters except decimal point
                        const numericValue = text.replace(/[^0-9.]/g, "");
                        // Ensure only one decimal point
                        const parts = numericValue.split(".");
                        const formattedValue =
                          parts.length > 1
                            ? `${parts[0]}.${parts[1].slice(0, 2)}`
                            : numericValue;
                        handleChange("agreedPrice")(formattedValue);
                      }}
                      onBlur={(e) => {
                        // Format number without forcing decimals for integers
                        const value = parseFloat(values.agreedPrice) || 0;
                        const formattedValue = Number.isInteger(value)
                          ? value.toString()
                          : value.toFixed(2);
                        setFieldValue("agreedPrice", formattedValue);
                        handleBlur("agreedPrice")(e);
                      }}
                      error={touched.agreedPrice && errors.agreedPrice}
                      keyboardType="decimal-pad"
                    />

                    <FormInput
                      label={t("advanceAmount")}
                      placeholder={t("advanceAmount")}
                      value={values.advanceAmount}
                      onChangeText={(text) => {
                        // Remove any non-numeric characters except decimal point
                        const numericValue = text.replace(/[^0-9.]/g, "");
                        // Ensure only one decimal point
                        const parts = numericValue.split(".");
                        const formattedValue =
                          parts.length > 1
                            ? `${parts[0]}.${parts[1].slice(0, 2)}`
                            : numericValue;

                        const agreedPrice = parseFloat(values.agreedPrice) || 0;
                        const newAdvanceAmount = parseFloat(formattedValue) || 0;

                        if (newAdvanceAmount > agreedPrice) {
                          Toast.show({
                            type: "error",
                            text1:
                              "Down payment cannot be greater than agreed price",
                            position: "bottom",
                          });
                          return;
                        }

                        handleChange("advanceAmount")(formattedValue);
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(values.advanceAmount) || 0;
                        const formattedValue = Number.isInteger(value)
                          ? value.toString()
                          : value.toFixed(2);
                        setFieldValue("advanceAmount", formattedValue);
                        handleBlur("advanceAmount")(e);
                      }}
                      error={touched.advanceAmount && errors.advanceAmount}
                      keyboardType="decimal-pad"
                    />

                    <FormInput
                      label={t("balanceAmount")}
                      placeholder={t("balanceAmount")}
                      value={(() => {
                        const agreedPrice = parseFloat(values.agreedPrice) || 0;
                        const advance = parseFloat(values.advanceAmount) || 0;
                        const balance = agreedPrice - advance;
                        return Number.isInteger(balance)
                          ? balance.toString()
                          : balance.toFixed(2);
                      })()}
                      editable={false}
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

                        setFieldValue("checkInTime", formattedTime);
                        setVisible(false);
                      }}
                      locale={i18n.language}
                      label={t("checkInTime")}
                      cancelLabel={t("cancel")}
                      confirmLabel={t("ok")}
                      defaultInputType="keyboard"
                    />
                  )}

                  {checkOutTimeVisible && (
                    <TimePickerModal
                      visible={checkOutTimeVisible}
                      onDismiss={() => setCheckOutTimeVisible(false)}
                      onConfirm={({ hours, minutes }) => {
                        const ampm = hours >= 12 ? "PM" : "AM";
                        const formattedHours = hours % 12 || 12;
                        const formattedTime = `${formattedHours}:${minutes
                          .toString()
                          .padStart(2, "0")} ${ampm}`;

                        setFieldValue("checkOutTime", formattedTime);
                        setCheckOutTimeVisible(false);
                      }}
                      locale={i18n.language}
                      label={t("checkOutTime")}
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
    contactTypeSection: {
      marginVertical: 15,
    },
    radioGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioOption: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.Primary_01,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    radioButtonSelected: {
      backgroundColor: colors.Primary_01,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.white,
    },
    radioLabel: {
      ...Typography.f_14_nunito_medium,
      color: colors.DARK_GREEN,
    },
    contactDropdown: {
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.Primary_01,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      maxHeight: 200,
    },
    contactOption: {
      paddingVertical: 12,
      paddingHorizontal: 13,
      borderBottomWidth: 1,
      borderBottomColor: colors.Neutral_01,
    },
    contactText: {
      ...Typography.f_14_nunito_medium,
      color: colors.DARK_GREEN,
    },
    selectedContactDetails: {
      marginTop: 10,
      paddingVertical: 10,
      backgroundColor: colors.white,
      borderRadius: 4,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    detailLabel: {
      ...Typography.f_14_nunito_bold,
      color: colors.DARK_GREEN,
    },
    detailValue: {
      ...Typography.f_14_nunito_bold,
      color: colors.Primary_01,
    },
  });

export default AddSchedule;