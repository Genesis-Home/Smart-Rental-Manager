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
} from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { DownIcon, Left, Right, True, False } from "../../assets/icons";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import Images from "../../assets/images";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";

type ExportScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExportData: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ExportScreenNavigationProp>();
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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
          <CTAButton1
            title={t("export")}
            submitHandler={() => navigation.navigate("Home")}
          />
        </View>
        <View style={styles.visitCard}>
          <Text style={styles.visitDate}>26-5-2025</Text>
          <Text style={styles.visitTitle}>
            {t("clientVisitAppointmentTitle")}
          </Text>
          <View style={styles.visitDetailsWrapper}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("clientName")}</Text>
              <Text style={styles.detailValue}>Frank Williams</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("Email")}</Text>
              <Text style={styles.detailValue}>frank-williams@em</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("phone")}</Text>
              <Text style={styles.detailValue}>+92 345055862</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("visitDateTime")}</Text>
              <Text style={styles.detailValue}>15 April 2025 – 3:30 PM</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("numberOfVisitors")}</Text>
              <Text style={styles.detailValue}>2 Adults</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("Infant")}</Text>
              <View style={styles.booleanIcons}>
                <True />
                <False />
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("propertyToVisitors")}</Text>
              <Text style={styles.detailValue}>
                592 Clifton Heights, Block 5, Karachi
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("googleMapsLocation")}</Text>
              <Text style={styles.mapLink}>{t("viewOnMap")}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal visible={calendarVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
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
  },
  visitCard: {
    marginVertical: 25,
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    padding: 15,
    borderRadius: 4,
  },
  visitDate: {
    ...Typography.f_14_nunito_bold,
    color: colors.black,
    textAlign: "center",
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
    width:"45%"
  },
  detailValue: {
    ...Typography.f_14_nunito_medium,
    color: colors.black,
    width: "45%",
  },
  booleanIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "45%",
  },
  mapLink: {
    ...Typography.f_14_nunito_medium,
    color: colors.Primary_01,
    width: "50%",
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
});
