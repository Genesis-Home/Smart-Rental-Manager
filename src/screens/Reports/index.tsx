import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import moment from "moment";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Header from "../../components/Header";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPropertiesByUserID, fetchSchedulesByUserID } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import { DEFAULT_LANGUAGE, colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import { DownIcon, Left, Right } from "../../assets/icons";
import { useTranslation } from "react-i18next";


type ViewMode = "daily" | "weekly" | "monthly" | "yearly";
type DateField = "anchor" | "start" | "end";

type Stats = {
  bookingCount: number;
  prepaymentTotal: number;
  totalPayment: number;
};

type ChartPoint = {
  label: string;
  value: number;
};

const VIEW_MODES: ViewMode[] = ["daily", "weekly", "monthly", "yearly"];

const safeNumber = (value: any) => {
  const parsed = parseFloat(String(value ?? "0"));
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseVisitRange = (visitDates?: string) => {
  if (!visitDates || typeof visitDates !== "string") return null;
  const [startStr, endStr] = visitDates.split(" - ");
  if (!startStr || !endStr) return null;

  const start = moment(startStr.trim(), "MMM D, YYYY").startOf("day");
  const end = moment(endStr.trim(), "MMM D, YYYY").endOf("day");
  if (!start.isValid() || !end.isValid()) return null;

  return { start, end };
};

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: any) => state.reducer.user);
  const userSchedules = useAppSelector((state: any) => state.reducer.schedules);
  const userProperties = useAppSelector((state: any) => state.reducer.userProperties);

  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const [anchorDate, setAnchorDate] = useState(moment().format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dateField, setDateField] = useState<DateField>("anchor");
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    LocaleConfig.locales[DEFAULT_LANGUAGE] = {
      monthNames: t("calendarData.monthNames", { returnObjects: true }),
      monthNamesShort: t("calendarData.monthNamesShort", { returnObjects: true }),
      dayNames: t("calendarData.dayNames", { returnObjects: true }),
      dayNamesShort: t("calendarData.dayNamesShort", { returnObjects: true }),
      today: t("calendarData.today"),
    };
    LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
    setIsLocaleReady(true);
  }, [t]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!user?.userId) {
        const message = await getFirebaseErrorMessage("User not authenticated");
        Toast.show({ type: "error", text1: message, position: "bottom" });
        return;
      }

      dispatch(fetchSchedulesByUserID(user.userId));
      dispatch(fetchPropertiesByUserID(user.userId));
    };

    bootstrap();
  }, [dispatch, user?.userId]);

  const selectedPropertyName = useMemo(() => {
    if (selectedPropertyId === "all") return t("allApartments");
    const property = userProperties.find((item: any) => item.id === selectedPropertyId);
    return property?.title || t("selectedApartment");
  }, [selectedPropertyId, userProperties]);

  const modeRange = useMemo(() => {
    const base = moment(anchorDate, "YYYY-MM-DD");
    if (!base.isValid()) {
      const now = moment();
      return { start: now.startOf("day"), end: now.endOf("day") };
    }

    if (viewMode === "daily") {
      return { start: base.clone().startOf("day"), end: base.clone().endOf("day") };
    }

    if (viewMode === "weekly") {
      return { start: base.clone().startOf("week"), end: base.clone().endOf("week") };
    }

    if (viewMode === "monthly") {
      return { start: base.clone().startOf("month"), end: base.clone().endOf("month") };
    }

    return { start: base.clone().startOf("year"), end: base.clone().endOf("year") };
  }, [anchorDate, viewMode]);

  const customRange = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = moment(startDate, "YYYY-MM-DD").startOf("day");
    const end = moment(endDate, "YYYY-MM-DD").endOf("day");
    if (!start.isValid() || !end.isValid()) return null;
    return start.isAfter(end) ? { start: end, end: start } : { start, end };
  }, [startDate, endDate]);

  const appliedRange = customRange || modeRange;

  const schedulesInScope = useMemo(() => {
    const preFiltered = selectedPropertyId === "all"
      ? userSchedules
      : userSchedules.filter((item: any) => item.propertyId === selectedPropertyId);

    return preFiltered.filter((schedule: any) => {
      const range = parseVisitRange(schedule.visitDates);
      if (!range) return false;

      return !(range.end.isBefore(appliedRange.start) || range.start.isAfter(appliedRange.end));
    });
  }, [appliedRange.end, appliedRange.start, selectedPropertyId, userSchedules]);

  const stats: Stats = useMemo(() => {
    return schedulesInScope.reduce(
      (acc: Stats, schedule: any) => {
        acc.bookingCount += 1;
        acc.prepaymentTotal += safeNumber(schedule.advanceAmount);
        acc.totalPayment += safeNumber(schedule.agreedPrice);
        return acc;
      },
      { bookingCount: 0, prepaymentTotal: 0, totalPayment: 0 }
    );
  }, [schedulesInScope]);

  const chartPoints: ChartPoint[] = useMemo(() => {
    if (viewMode === "monthly") {
      const base = moment(anchorDate, "YYYY-MM-DD");
      const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
      const counters: Record<string, number> = {
        W1: 0,
        W2: 0,
        W3: 0,
        W4: 0,
        W5: 0,
        W6: 0,
      };

      schedulesInScope.forEach((schedule: any) => {
        const range = parseVisitRange(schedule.visitDates);
        if (!range) return;

        const startWeek = Math.floor((range.start.date() - 1) / 7) + 1;
        const key = `W${Math.max(1, Math.min(6, startWeek))}`;
        counters[key] += 1;
      });

      return weeks.map((label) => ({ label, value: counters[label] || 0 }));
    }

    if (viewMode === "yearly") {
      const counters = Array.from({ length: 12 }).map(() => 0);

      schedulesInScope.forEach((schedule: any) => {
        const range = parseVisitRange(schedule.visitDates);
        if (!range) return;
        const index = range.start.month();
        counters[index] += 1;
      });

      return counters.map((value, index) => ({
        label: moment().month(index).format("MMM"),
        value,
      }));
    }

    return [];
  }, [anchorDate, schedulesInScope, viewMode]);

  const maxChartValue = useMemo(() => {
    const max = chartPoints.reduce((acc, item) => Math.max(acc, item.value), 0);
    return max === 0 ? 1 : max;
  }, [chartPoints]);

  const openCalendar = (field: DateField) => {
    setDateField(field);
    const presetDate = field === "anchor" ? anchorDate : field === "start" ? startDate : endDate;
    const parsed = moment(presetDate || anchorDate, "YYYY-MM-DD");
    if (parsed.isValid()) {
      setDisplayedMonth(parsed.toDate());
    }
    setCalendarVisible(true);
  };

  const onDayPress = (day: { dateString: string }) => {
    if (dateField === "anchor") {
      setAnchorDate(day.dateString);
    } else if (dateField === "start") {
      setStartDate(day.dateString);
    } else {
      setEndDate(day.dateString);
    }
    setCalendarVisible(false);
  };

  const clearRange = () => {
    setStartDate("");
    setEndDate("");
  };

  const rangeLabel = `${appliedRange.start.format("MMM D, YYYY")} - ${appliedRange.end.format("MMM D, YYYY")}`;

  return (

    <View style={styles.screenContainer}>
      <View style={{ width: "100%", paddingHorizontal: 20, }}>
        <Header title={t("analyticsReports")} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionLabel}>{t("timeView")}</Text>
        <View style={styles.segmentContainer}>
          {VIEW_MODES.map((mode) => {
            const active = mode === viewMode;
            return (
              <TouchableOpacity
                key={mode}
                activeOpacity={0.8}
                onPress={() => setViewMode(mode)}
                style={[styles.segmentButton, active && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{mode.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {(viewMode === "monthly" || viewMode === "yearly") && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t("bookingsTrend")}</Text>
            {/* Chart grid background */}
            <View style={styles.chartGrid} pointerEvents="none">
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${(i * 20)}%`,
                    borderTopWidth: 1,
                    borderTopColor: '#F0F4F8',
                  }}
                />
              ))}
            </View>
            <View style={styles.chartBarsRow}>
              {chartPoints.map((point, idx) => {
                const height = Math.max(8, (point.value / maxChartValue) * 110);
                // Color palette for bars
                const barColors = [
                  '#4F8EF7', '#F76C5E', '#43D9AD', '#FFD166', '#9B5DE5', '#F7B801', '#00B8A9', '#F6416C', '#43B0F1', '#FF6F61', '#6A4C93', '#2EC4B6'
                ];
                const barColor = barColors[idx % barColors.length];
                // Show only first letter for month labels in yearly mode
                let label = point.label;
                if (viewMode === "yearly" && typeof label === "string") {
                  label = label.charAt(0);
                }
                return (
                  <View key={point.label} style={styles.chartBarItem}>
                    <Text style={styles.chartValue}>{point.value}</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height,
                          backgroundColor: barColor,
                          shadowColor: barColor,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.18,
                          shadowRadius: 4,
                          elevation: 4,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>{t("apartment")}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.selectorButton}
          onPress={() => setIsPropertyDropdownOpen((prev) => !prev)}
        >
          <Text style={styles.selectorText}>{selectedPropertyName}</Text>
          <DownIcon />
        </TouchableOpacity>

        {isPropertyDropdownOpen && (
          <View style={styles.dropdownCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedPropertyId("all");
                setIsPropertyDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownText}>{t("allApartments")}</Text>
            </TouchableOpacity>

            {userProperties.map((property: any) => (
              <TouchableOpacity
                key={property.id}
                activeOpacity={0.8}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedPropertyId(property.id);
                  setIsPropertyDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownText}>{property.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.rowWrap}>
          <TouchableOpacity activeOpacity={0.8} style={styles.dateField} onPress={() => openCalendar("start")}>
            <Text style={styles.dateLabel}>{t("rangeStart")}</Text>
            <Text style={styles.dateValue}>{startDate ? moment(startDate).format("MMM D, YYYY") : t("notSet")}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.dateField} onPress={() => openCalendar("end")}>
            <Text style={styles.dateLabel}>{t("rangeEnd")}</Text>
            <Text style={styles.dateValue}>{endDate ? moment(endDate).format("MMM D, YYYY") : t("notSet")}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.clearRangeBtn} onPress={clearRange}>
          <Text style={styles.clearRangeText}>{t("clearCustomRange")}</Text>
        </TouchableOpacity>

        <View style={styles.periodCard}>
          <Text style={styles.periodTitle}>{t("appliedPeriod")}</Text>
          <Text style={styles.periodValue}>{rangeLabel}</Text>
          {customRange && <Text style={styles.periodHint}>{t("customRangeActive")}</Text>}
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>{t("bookingQuantity")}</Text>
            <Text style={styles.metricValue}>{stats.bookingCount}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>{t("prepayment")}</Text>
            <Text style={styles.metricValue}>${stats.prepaymentTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>{t("totalPayment")}</Text>
            <Text style={styles.metricValue}>${stats.totalPayment.toFixed(2)}</Text>
          </View>
        </View>



        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{t("bookingsInPeriod")}</Text>
          <Text style={styles.listCount}>{schedulesInScope.length}</Text>
        </View>

        {schedulesInScope.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chart-bar-stacked" size={24} color={colors.DARK_GRAY} />
            <Text style={styles.emptyText}>{t("noReportData")}</Text>
          </View>
        ) : (
          <FlatList
            data={schedulesInScope}
            keyExtractor={(item: any) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                <Text style={styles.bookingProperty}>{item.property || t("unknownProperty")}</Text>
                <Text style={styles.bookingLine}>{t("client")}: {item.clientName || "-"}</Text>
                <Text style={styles.bookingLine}>{t("visit")}: {item.visitDates || "-"}</Text>
                <Text style={styles.bookingLine}>{t("downPayment")}: ${safeNumber(item.advanceAmount).toFixed(2)}</Text>
                <Text style={styles.bookingLine}>{t("totalPayment")}: ${safeNumber(item.agreedPrice).toFixed(2)}</Text>
              </View>
            )}
          />
        )}
      </ScrollView>

      <Modal visible={calendarVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      const next = new Date(displayedMonth);
                      next.setMonth(next.getMonth() - 1);
                      setDisplayedMonth(next);
                    }}
                    activeOpacity={0.8}
                  >
                    <Left width={16} height={16} />
                  </TouchableOpacity>

                  <Text style={styles.calendarMonth}>{moment(displayedMonth).format("MMMM YYYY")}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      const next = new Date(displayedMonth);
                      next.setMonth(next.getMonth() + 1);
                      setDisplayedMonth(next);
                    }}
                    activeOpacity={0.8}
                  >
                    <Right width={16} height={16} />
                  </TouchableOpacity>
                </View>

                {isLocaleReady && (
                  <Calendar
                    current={moment(displayedMonth).format("YYYY-MM-DD")}
                    markedDates={{
                      ...(anchorDate
                        ? {
                          [anchorDate]: {
                            selected: true,
                            selectedColor: colors.Primary_01,
                            selectedTextColor: colors.white,
                          },
                        }
                        : {}),
                      ...(startDate
                        ? {
                          [startDate]: {
                            selected: true,
                            selectedColor: "#7ACDC8",
                            selectedTextColor: colors.white,
                          },
                        }
                        : {}),
                      ...(endDate
                        ? {
                          [endDate]: {
                            selected: true,
                            selectedColor: "#54B8B1",
                            selectedTextColor: colors.white,
                          },
                        }
                        : {}),
                    }}
                    onMonthChange={(month: any) => {
                      setDisplayedMonth(new Date(month.year, month.month - 1, 1));
                    }}
                    onDayPress={onDayPress}
                    theme={{
                      selectedDayBackgroundColor: colors.Primary_01,
                      selectedDayTextColor: colors.white,
                      todayTextColor: colors.Primary_01,
                      arrowColor: colors.Primary_01,
                      dotColor: colors.Primary_01,
                      textDayFontFamily: "Nunito-Regular",
                      textMonthFontFamily: "Nunito-Bold",
                      textDayHeaderFontFamily: "Nunito-SemiBold",
                    }}
                    hideArrows
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
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    ...Typography.f_14_nunito_bold,
    color: colors.DARK_GREEN,
    marginTop: 10,
    marginBottom: 8,
  },
  segmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  segmentButton: {
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  segmentButtonActive: {
    backgroundColor: colors.Primary_01,
    borderColor: colors.Primary_01,
  },
  segmentText: {
    ...Typography.f_12_nunito_bold,
    color: colors.DARK_GRAY,
  },
  segmentTextActive: {
    color: colors.white,
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GREEN,
  },
  dropdownCard: {
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F4",
  },
  dropdownText: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GREEN,
  },
  rowWrap: {
    marginTop: 10,
    gap: 8,
  },
  dateField: {
    borderWidth: 1,
    borderColor: colors.Neutral_01,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateLabel: {
    ...Typography.f_12_nunito_bold,
    color: colors.DARK_GRAY,
  },
  dateValue: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GREEN,
    marginTop: 2,
  },
  clearRangeBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#E8F6F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  clearRangeText: {
    ...Typography.f_12_nunito_bold,
    color: colors.Primary_01,
  },
  periodCard: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#F5FBFA",
    padding: 12,
    borderWidth: 1,
    borderColor: "#D9F0EE",
  },
  periodTitle: {
    ...Typography.f_12_nunito_bold,
    color: colors.DARK_GRAY,
  },
  periodValue: {
    ...Typography.f_14_nunito_bold,
    color: colors.DARK_GREEN,
    marginTop: 2,
  },
  periodHint: {
    ...Typography.f_12_nunito_medium,
    color: colors.Primary_01,
    marginTop: 4,
  },
  metricsGrid: {
    marginTop: 12,
    gap: 10,
  },
  metricCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E7ECEF",
    backgroundColor: colors.white,
  },
  metricTitle: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GRAY,
  },
  metricValue: {
    ...Typography.f_20_nunito_bold,
    color: colors.DARK_GREEN,
    marginTop: 4,
  },
  chartCard: {
    marginTop: 12,
    borderRadius: 6, // Less rounded border
    borderWidth: 1,
    borderColor: "#E7ECEF",
    backgroundColor: colors.white,
    paddingHorizontal: 4, // Less padding for more bar space
    paddingVertical: 14,
  },
  chartTitle: {
    ...Typography.f_14_nunito_bold,
    color: colors.DARK_GREEN,
    marginBottom: 10,
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  chartBarsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 140,
    position: "relative",
    zIndex: 1,
    marginBottom: 4,
  },
  chartBarItem: {
    width: 20, // Narrower for yearly (12 bars)
    alignItems: "center",
    marginHorizontal: 1,
  },
  chartValue: {
    ...Typography.f_12_nunito_bold,
    color: colors.DARK_GRAY,
    marginBottom: 4,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chartBar: {
    width: 16, // Narrower for yearly
    borderTopLeftRadius: 0, // Rectangular bars
    borderTopRightRadius: 0,
    marginBottom: 2,
    backgroundColor: colors.Primary_01,
    // shadow and elevation set dynamically
  },
  chartLabel: {
    ...Typography.f_12_nunito_medium,
    color: colors.DARK_GRAY,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 40,
  },
  listHeader: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    ...Typography.f_16_nunito_bold,
    color: colors.DARK_GREEN,
  },
  listCount: {
    ...Typography.f_14_nunito_bold,
    color: colors.Primary_01,
  },
  listContent: {
    marginTop: 8,
    gap: 10,
  },
  bookingCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E7ECEF",
    padding: 12,
    backgroundColor: colors.white,
  },
  bookingProperty: {
    ...Typography.f_14_nunito_bold,
    color: colors.DARK_GREEN,
    marginBottom: 4,
  },
  bookingLine: {
    ...Typography.f_12_nunito_medium,
    color: colors.DARK_GRAY,
    marginTop: 2,
  },
  emptyState: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7ECEF",
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GRAY,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  calendarCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  calendarHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarMonth: {
    ...Typography.f_16_nunito_bold,
    color: colors.DARK_GREEN,
  },
});

export default Reports;
