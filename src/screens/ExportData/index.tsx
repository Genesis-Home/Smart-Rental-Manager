import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { DownIcon, Left, Right } from "../../assets/icons";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import Images from "../../assets/images";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { useNavigation } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { ExportScreenNavigationProp } from "../../types/types";
import { fetchSchedulesByUserID, fetchAllSchedules } from "../../store/actions/action";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import RNFS from "react-native-fs";
import moment from "moment";
import SAF from 'react-native-saf-x';

const ExportData: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ExportScreenNavigationProp>();
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const user = useAppSelector((state: any) => state.reducer.user);
  const userSchedules = useAppSelector((state: any) => state.reducer.schedules);
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        if (user?.email === "admin@gmail.com" && showAllSchedules) {
          dispatch(fetchAllSchedules());
        } else {
          dispatch(fetchSchedulesByUserID(user.userId));
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

    fetchData();
  }, [dispatch, user?.userId, user?.email, showAllSchedules]);

  const filterSchedulesByDateRange = () => {
    if (!startDate || !endDate) return userSchedules;

    const selectedStart = moment(startDate, "YYYY-MM-DD").startOf("day");
    const selectedEnd = moment(endDate, "YYYY-MM-DD").endOf("day");

    return userSchedules.filter((schedule: any) => {
      if (!schedule.visitDates || typeof schedule.visitDates !== "string")
        return false;

      const [rangeStartStr, rangeEndStr] = schedule.visitDates.split(" - ");
      if (!rangeStartStr || !rangeEndStr) return false;

      const rangeStart = moment(rangeStartStr.trim(), "MMM D, YYYY").startOf(
        "day"
      );
      const rangeEnd = moment(rangeEndStr.trim(), "MMM D, YYYY").endOf("day");

      if (!rangeStart.isValid() || !rangeEnd.isValid()) {
        console.error("Failed to parse dates:", rangeStartStr, rangeEndStr);
        return false;
      }

      const hasOverlap = !(
        rangeEnd.isBefore(selectedStart) || rangeStart.isAfter(selectedEnd)
      );
      console.log("Has overlap:", hasOverlap);

      return hasOverlap;
    });
  };

  const filteredSchedules = filterSchedulesByDateRange();

  const exportToCSV = async () => {
    const schedules = filterSchedulesByDateRange();
    if (schedules.length === 0) {
      Toast.show({ type: "info", text1: t("noSchedulesInRange") });
      return;
    }

    try {
      if (Platform.OS === "android" && Platform.Version < 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show({ type: "error", text1: t("permissionDenied") });
          return;
        }
      }

      let csv =
        "Client Name,Email,Phone,Visit Dates,Check In Time,Check Out Time,Visitors,Infants,Property,Created By\n";
      schedules.forEach((item: any) => {
        const createdByDisplay =
          item.createdByEmail || item.createdByName || item.createdBy || "";
        csv += `"${item.clientName}","${item.email}","${item.phoneNum}","${item.visitDates}","${item.checkInTime}","${item.checkOutTime}","${item.numberOfVisitors}","${item.numberOfInfants}","${item.property}","${createdByDisplay}"\n`;
      });

      const fileName = showAllSchedules ? `All_Schedules_Export.csv` : `Schedules_Export.csv`;

      if (Platform.OS === "android" && Platform.Version >= 30) {
        // Android 11+ (SDK 30+): Use SAF to show Save As dialog and write CSV
        const fileDetail = await SAF.createDocument(csv, {
          mimeType: 'text/csv',
          initialName: fileName,
          encoding: 'utf8'
        });
        if (!fileDetail || !fileDetail.uri) {
          Toast.show({ type: "error", text1: t("exportFailed") });
          return;
        }
        Toast.show({
          type: "success",
          text1: t("fileSaved"),
          text2: t("fileSavedToDownloads"),
        });
      } else {
        const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        await RNFS.writeFile(path, csv, "utf8");
        Toast.show({
          type: "success",
          text1: t("fileSaved"),
          text2: `Downloads/${fileName}`,
        });
      }
    } catch (error) {
      console.error("CSV export error", error);
      Toast.show({ type: "error", text1: t("exportFailed") });
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

  const openCalendar = () => {
    setCalendarVisible(true);
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

  const onDayPress = (day: { dateString: string }) => {
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
      const start = new Date(startDate);
      const end = new Date(day.dateString);

      if (end < start) {
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
      let current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
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
        current.setDate(current.getDate() + 1);
      }

      setEndDate(day.dateString);
      setMarkedDates(newMarkedDates);
      setCalendarVisible(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Header title={t("dataExport")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.datePicker}
          activeOpacity={0.8}
          onPress={openCalendar}
        >
          <Text style={styles.datePickerText}>
            {startDate && endDate
              ? `${startDate} - ${endDate}`
              : t("selectDateRange")}
          </Text>
          <DownIcon />
        </TouchableOpacity>
        <View style={styles.excelPreviewWrapper}>
          <Image
            source={Images.Excel}
            resizeMode="contain"
            style={styles.excelImage}
          />
        </View>
        <View style={styles.exportBtnWrapper}>
          <CTAButton1 title={t("export")}
            submitHandler={exportToCSV}
            isLoading={false}
          />
        </View>
        {user?.email === "admin@gmail.com" && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => setShowAllSchedules((prev) => !prev)}
              style={{ marginRight: 8 }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: colors.Primary_01,
                  backgroundColor: showAllSchedules ? colors.Primary_01 : '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {showAllSchedules && (
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', minHeight: 20 }}>
              <Text style={[Typography.f_14_nunito_bold, { color: colors.Primary_01 }]}>
                {t('showAllSchedules') || "Show all users' schedules"}
              </Text>
            </View>
          </View>
        )}
        {filteredSchedules.length === 0 ? (
          <View style={styles.noSchedulesFound}>
            <Text style={styles.noSchedulesText}>{t("noSchedulesFound")}</Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={(item) => item.id}
            data={filteredSchedules}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.visitCard,
                  {
                    marginBottom:
                      index === filteredSchedules.length - 1 ? 40 : 0,
                  },
                ]}
              >
                <Text style={styles.visitTitle}>
                  {t("clientVisitAppointmentTitle")}
                </Text>
                <View style={styles.visitDetailsWrapper}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("clientName")}</Text>
                    <Text style={styles.detailValue}>{item.clientName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("Email")}</Text>
                    <Text style={styles.detailValue}>{item.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("phone")}</Text>
                    <Text style={styles.detailValue}>{item.phoneNum}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("visitDates")}</Text>
                    <Text style={styles.detailValue}>{item.visitDates}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("checkInTime")}</Text>
                    <Text style={styles.detailValue}>{item.checkInTime ? moment(item.checkInTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A') : ''}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("checkOutTime")}</Text>
                    <Text style={styles.detailValue}>{item.checkOutTime ? moment(item.checkOutTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A') : ''}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("numberOfVisitors")}
                    </Text>
                    <Text style={styles.detailValue}>
                      {item.numberOfVisitors} {t("adults")}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t("Infant")}</Text>
                    <Text style={styles.detailValue}>
                      {item.numberOfInfants} {t("infants")}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("googleMapsLocation")}
                    </Text>
                    <Text
                      onPress={() =>
                        navigation.navigate("Map", { location: item.location })
                      }
                      style={styles.mapLink}
                    >
                      {t("viewOnMap")}
                    </Text>
                  </View>
                  {user?.email === "admin@gmail.com" && showAllSchedules && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t("createdBy") || "Created By"}
                      </Text>
                      <Text style={styles.detailValue}>
                        {item.createdByEmail ||
                          item.createdByName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
      <Modal visible={calendarVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.calendarModal}>
                {isLocaleReady && (
                  <Calendar
                    key={displayedMonth.toISOString()}
                    hideExtraDays
                    markingType="period"
                    markedDates={markedDates}
                    onDayPress={onDayPress}
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
    </View>
  );
};

export default ExportData;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: "5%",
  },
  datePicker: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    padding: 13,
    borderRadius: 4,
    height: 45
  },
  datePickerText: {
    ...Typography.f_14_nunito_bold,
    color: colors.black,
  },
  excelPreviewWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    borderRadius: 4,
    paddingVertical: 13,
  },
  excelImage: {
    width: 115,
    height: 120,
  },
  exportBtnWrapper: {
    marginTop: 25,
    marginBottom: 15
  },
  visitCard: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    padding: 15,
    borderRadius: 4,
  },
  visitTitle: {
    ...Typography.f_14_nunito_bold,
    color: colors.black,
    textAlign: "center",
    marginTop: 15,
  },
  visitDetailsWrapper: {
    marginTop: 25,
    gap: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    ...Typography.f_14_nunito_medium,
    color: colors.black,
    width: "45%",
  },
  detailValue: {
    ...Typography.f_14_nunito_medium,
    color: colors.black,
    width: "45%",
  },
  mapLink: {
    ...Typography.f_14_nunito_medium,
    color: colors.Primary_01,
    width: "45%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModal: {
    width: "90%",
    backgroundColor: colors.white,
    padding: 5,
    borderRadius: 15,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    padding: 13,
    borderRadius: 8,
  },
  headerMonthText: {
    ...Typography.f_14_nunito_medium,
    color: colors.black,
  },
  noSchedulesFound: {
    alignItems: "center",
    marginTop: 40,
  },
  noSchedulesText: {
    ...Typography.f_14_nunito_extra_bold,
    color: colors.Primary_01,
  },
});
