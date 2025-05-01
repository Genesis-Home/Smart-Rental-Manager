import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";
import { AddPhoto, Left, Right } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { addDays, format, startOfWeek, startOfMonth } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { ScheduledScreenNavigationProp, Day } from "../../types/types";

const Scheduled: React.FC = () => {
  const navigation = useNavigation<ScheduledScreenNavigationProp>();
  const { t, i18n } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  const properties = t("properties", { returnObjects: true }) as string[];

  const getLocale = () => {
    switch (i18n.language) {
      case "sp":
        return es;
      case "en":
      default:
        return enUS;
    }
  };

  const generateWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 5, locale: getLocale() });
    const week: Day[] = [];
    for (let i = 0; i < 8; i++) {
      const dayDate = addDays(start, i);
      week.push({
        day: format(dayDate, "EEE", { locale: getLocale() }),
        number: parseInt(format(dayDate, "d")),
      });
    }
    setDays(week);
  };

  useEffect(() => {
    generateWeekDays(currentDate);
  }, [currentDate, i18n.language]);

  const goToPreviousWeek = () => {
    setCurrentDate((prev) => addDays(prev, -8));
  };

  const goToNextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 8));
  };

  const onDateSelect = (date: string) => {
    const newDate = new Date(date);
    setSelectedDate(date);
    setCurrentDate(newDate);
    setShowCalendar(false);
  };

  useEffect(() => {
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
  }, [t]);

  const handlePreviousMonth = () => {
    const previousMonth = addDays(startOfMonth(currentDate), -1);
    setCurrentDate(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addDays(startOfMonth(currentDate), 32);
    setCurrentDate(nextMonth);
  };

  return (
    <View style={styles.container}>
      <Header title={t("schedulePropertyVisit")} />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddSchedule")}
        activeOpacity={0.8}
        style={styles.addPhotoButton}
      >
        <AddPhoto height={30} width={30} />
      </TouchableOpacity>
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <Left height={24} width={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Text style={styles.monthText}>
            {format(currentDate, "MMMM yyyy", { locale: getLocale() })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextWeek}>
          <Right height={24} width={24} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.daysContainer}>
          {days.map((item, index) => {
            const isSelected =
              item.number ===
              parseInt(
                format(new Date(selectedDate ? selectedDate : currentDate), "d")
              );
            return (
              <View
                key={index}
                style={[
                  styles.dayItem,
                  isSelected && { backgroundColor: colors.Primary_01 },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isSelected ? colors.white : colors.PLACE_HOLDER },
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.numberText,
                    { color: isSelected ? colors.white : colors.black },
                  ]}
                >
                  {item.number}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={{ marginBottom: 40 }}>
          {properties.map((item, index) => (
            <View key={index} style={styles.propertyRow}>
              <Text style={styles.propertyText}>{item}</Text>
              <View style={styles.slotsContainer}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.slot} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal visible={showCalendar} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.calendarModal}>
                {isLocaleReady && (
                  <Calendar
                    key={currentDate.toISOString()}
                    current={currentDate.toISOString().split("T")[0]}
                    onDayPress={(day) => onDateSelect(day.dateString)}
                    hideExtraDays
                    hideArrows
                    renderHeader={() => (
                      <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={handlePreviousMonth}>
                          <Left />
                        </TouchableOpacity>
                        <Text style={styles.headerMonthText}>
                          {format(currentDate, "MMMM yyyy", {
                            locale: getLocale(),
                          })}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth}>
                          <Right />
                        </TouchableOpacity>
                      </View>
                    )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: "5%",
  },
  addPhotoButton: {
    position: "absolute",
    right: 0,
    top: 35,
    zIndex: 1,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  monthText: {
    ...Typography.f_16_nunito_bold,
    color: colors.black,
  },
  daysContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayItem: {
    width: 35,
    height: 40,
    backgroundColor: colors.Neutral_01,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  dayText: {
    ...Typography.f_12_nunito_bold,
  },
  numberText: {
    ...Typography.f_12_nunito_bold,
  },
  propertyRow: {
    marginBottom: 15,
  },
  propertyText: {
    ...Typography.f_14_nunito_bold,
    color: colors.black,
    marginBottom: 5,
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slot: {
    width: 35,
    height: 35,
    backgroundColor: colors.Neutral_01,
    borderRadius: 4,
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
});

export default Scheduled;
