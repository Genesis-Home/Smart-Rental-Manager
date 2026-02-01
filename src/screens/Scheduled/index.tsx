import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";
import { AddPhoto, Left, Right } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { addDays, format, startOfWeek, startOfMonth } from "date-fns";
import { enUS, es, el } from "date-fns/locale";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { DEFAULT_LANGUAGE } from "../../utilities/constants";
import { ScheduledScreenNavigationProp, Day } from "../../types/types";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import Toast from "react-native-toast-message";
import moment from "moment";
import {
  generateSchedulePDF,
  generateMonthlyFinancialReportPDF,
  generateYearlyFinancialSummaryPDF,
} from "../../services/pdfService";
import firestore from "@react-native-firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Share from "react-native-share";
import SAF from "react-native-saf-x";
import RNFS from "react-native-fs";
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";

// Custom Button Component
interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  backgroundColor = colors.Primary_01,
  textColor = colors.white,
  isLoading = false,
  disabled = false,
  style,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor,
          paddingVertical: 10,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          height: 45,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          {title && (
            <Text
              style={{
                color: textColor,
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const Scheduled: React.FC = () => {
  const navigation = useNavigation<ScheduledScreenNavigationProp>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingMonthlyReport, setIsGeneratingMonthlyReport] = useState(false);
  const [isGeneratingYearlyReport, setIsGeneratingYearlyReport] = useState(false);

  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [propertyImagesAfter, setPropertyImagesAfter] = useState<string[]>([]);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewingGallery, setViewingGallery] = useState<"before" | "after">("before");


  const fetchPropertyImages = async (schedule: any) => {
    if (schedule?.propertyId) {
      try {
        const propertyDoc = await firestore()
          .collection("properties")
          .doc(schedule.propertyId)
          .get();

        if (propertyDoc.exists) {
          const propertyData = propertyDoc.data();
          // Set images before (excluding cover photo which is first image)
          const imagesBefore = propertyData?.imagesBefore || propertyData?.images?.slice(1) || [];
          setPropertyImages(imagesBefore);

          // Set images after
          const imagesAfter = propertyData?.imagesAfter || [];
          setPropertyImagesAfter(imagesAfter);
        }
      } catch (error) {
        console.error("Error fetching property images:", error);
      }
    }
  };


  // Add this function to open image viewer
  const openImageView = (index: number, gallery: "before" | "after") => {
    setSelectedImageIndex(index);
    setViewingGallery(gallery);
    setIsImageViewVisible(true);
  };
  const handleSlotClick = async (
    slotIndex: number,
    item: { propertyId: string; propertyName: string; schedules: any[] }
  ) => {
    const slotDate = addDays(
      startOfWeek(currentDate, { weekStartsOn: 5 }),
      slotIndex
    );

    let clickedSchedule: any = null;
    item.schedules.forEach((schedule: any) => {
      if (schedule.visitDates) {
        const [startStr, endStr] = schedule.visitDates.split(" - ");
        const startDate = moment(startStr, "MMM D, YYYY").startOf("day");
        const endDate = moment(endStr, "MMM D, YYYY").endOf("day");
        const slotMoment = moment(slotDate);
        if (
          slotMoment.isSameOrAfter(startDate) &&
          slotMoment.isSameOrBefore(endDate)
        ) {
          clickedSchedule = schedule;
        }
      }
    });

    if (clickedSchedule) {
      setSelectedSchedule(clickedSchedule);
      await fetchPropertyImages(clickedSchedule); // Fetch images before showing modal
      setShowBookingDetailsModal(true);
    } else {
      navigation.navigate("AddSchedule", {
        preselectedDate: slotDate.toISOString().split("T")[0],
      });
    }
  };

  const parseScheduleRange = (visitDates?: string) => {
    if (!visitDates || typeof visitDates !== "string") return null;
    const [startStr, endStr] = visitDates.split(" - ");
    if (!startStr || !endStr) return null;
    const start = moment(startStr.trim(), "MMM D, YYYY").startOf("day");
    const end = moment(endStr.trim(), "MMM D, YYYY").endOf("day");
    if (!start.isValid() || !end.isValid()) return null;
    return { start, end };
  };

  const buildFinancialSummary = (schedules: any[]) => {
    const grouped: {
      [propertyId: string]: {
        propertyId: string;
        propertyName: string;
        bookings: number;
        totalRevenue: number;
        totalAdvance: number;
        totalBalance: number;
      };
    } = {};

    schedules.forEach((schedule: any) => {
      const propertyId = schedule.propertyId || "unknown";
      const propertyName = schedule.property || schedule.propertyName || "Unknown Property";
      if (!grouped[propertyId]) {
        grouped[propertyId] = {
          propertyId,
          propertyName,
          bookings: 0,
          totalRevenue: 0,
          totalAdvance: 0,
          totalBalance: 0,
        };
      }

      const revenue = parseFloat(schedule.agreedPrice || "0") || 0;
      const advance = parseFloat(schedule.advanceAmount || "0") || 0;
      grouped[propertyId].bookings += 1;
      grouped[propertyId].totalRevenue += revenue;
      grouped[propertyId].totalAdvance += advance;
      grouped[propertyId].totalBalance += Math.max(0, revenue - advance);
    });

    const properties = Object.values(grouped);
    const totals = properties.reduce(
      (acc, item) => {
        acc.bookings += item.bookings;
        acc.totalRevenue += item.totalRevenue;
        acc.totalAdvance += item.totalAdvance;
        acc.totalBalance += item.totalBalance;
        return acc;
      },
      { bookings: 0, totalRevenue: 0, totalAdvance: 0, totalBalance: 0 }
    );

    return { properties, totals };
  };

  const saveGeneratedPdf = async (pdfPath: string) => {
    if (Platform.OS === "android") {
      if (Platform.Version < 30) {
        Toast.show({
          type: "success",
          text1: "Report downloaded",
          text2: "File saved to app storage",
          position: "bottom",
        });
      } else {
        const fileName = pdfPath.split("/").pop() || "Report.pdf";
        const pdfBase64 = await RNFS.readFile(pdfPath, "base64");
        const fileDetail = await SAF.createDocument(pdfBase64, {
          mimeType: "application/pdf",
          initialName: fileName,
          encoding: "base64",
        });
        if (!fileDetail || !fileDetail.uri) {
          Toast.show({
            type: "error",
            text1: "Report download failed",
            position: "bottom",
          });
          return;
        }
        Toast.show({
          type: "success",
          text1: "Report downloaded",
          text2: "File saved to Downloads",
          position: "bottom",
        });
      }
    } else if (Platform.OS === "ios") {
      await Share.open({
        title: "Financial Report",
        url: pdfPath,
        type: "application/pdf",
        filename: pdfPath.split("/").pop(),
        saveToFiles: true,
      });
      Toast.show({
        type: "success",
        text1: "Report ready",
        text2: "Use Share to save",
        position: "bottom",
      });
    }
  };

  const handleMonthlyReport = async () => {
    if (isGeneratingMonthlyReport) return;
    setIsGeneratingMonthlyReport(true);
    try {
      const start = moment(currentDate).startOf("month");
      const end = moment(currentDate).endOf("month");

      const schedulesInMonth = userSchedules.filter((schedule: any) => {
        const range = parseScheduleRange(schedule.visitDates);
        if (!range) return false;
        return !(
          range.end.isBefore(start) || range.start.isAfter(end)
        );
      });

      if (schedulesInMonth.length === 0) {
        Toast.show({
          type: "info",
          text1: "No bookings found for this month",
          position: "bottom",
        });
        return;
      }

      const { properties, totals } = buildFinancialSummary(schedulesInMonth);
      const periodLabel = moment(currentDate).format("MMMM YYYY");
      const pdfPath = await generateMonthlyFinancialReportPDF({
        periodLabel,
        properties,
        totals,
      });
      await saveGeneratedPdf(pdfPath);
    } catch (error) {
      console.error("Monthly report error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to generate report",
        position: "bottom",
      });
    } finally {
      setIsGeneratingMonthlyReport(false);
    }
  };

  const handleYearlyReport = async () => {
    if (isGeneratingYearlyReport) return;
    setIsGeneratingYearlyReport(true);
    try {
      const start = moment(currentDate).startOf("year");
      const end = moment(currentDate).endOf("year");

      const schedulesInYear = userSchedules.filter((schedule: any) => {
        const range = parseScheduleRange(schedule.visitDates);
        if (!range) return false;
        return !(
          range.end.isBefore(start) || range.start.isAfter(end)
        );
      });

      if (schedulesInYear.length === 0) {
        Toast.show({
          type: "info",
          text1: "No bookings found for this year",
          position: "bottom",
        });
        return;
      }

      const { properties, totals } = buildFinancialSummary(schedulesInYear);
      const periodLabel = moment(currentDate).format("YYYY");
      const pdfPath = await generateYearlyFinancialSummaryPDF({
        periodLabel,
        properties,
        totals,
      });
      await saveGeneratedPdf(pdfPath);
    } catch (error) {
      console.error("Yearly report error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to generate report",
        position: "bottom",
      });
    } finally {
      setIsGeneratingYearlyReport(false);
    }
  };




  const user = useAppSelector((state: any) => state.reducer.user);
  const userSchedules = useAppSelector((state: any) => state.reducer.schedules);
  // Group schedules by property
  const groupedSchedules = useMemo(() => {
    const grouped: { [propertyId: string]: any[] } = {};

    userSchedules.forEach((schedule: any) => {
      if (!grouped[schedule.propertyId]) {
        grouped[schedule.propertyId] = [];
      }
      grouped[schedule.propertyId].push(schedule);
    });

    return Object.entries(grouped).map(([propertyId, schedules]) => ({
      propertyId,
      propertyName: schedules[0]?.property || "Unknown Property",
      schedules: schedules.sort((a: any, b: any) => {
        const dateA = moment(a.visitDates?.split(" - ")[0], "MMM D, YYYY");
        const dateB = moment(b.visitDates?.split(" - ")[0], "MMM D, YYYY");
        return dateA.isBefore(dateB) ? -1 : 1;
      }),
    }));
  }, [userSchedules]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        try {
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
        } catch (error) {
          console.log(error, "fetchschedule_error");
          const errorMessage = await getFirebaseErrorMessage(
            (error as any).code
          );
          Toast.show({
            type: "error",
            text1: errorMessage,
            position: "bottom",
          });
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
  }, [dispatch, user?.userId]);

  const getLocale = () => {
    switch (i18n.language) {
      case "gr":
        return el;
      case "en":
      default:
        return enUS;
    }
  };

  const generateWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 5, locale: getLocale() });
    const week: Day[] = [];
    for (let i = 0; i < 7; i++) {
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
    setCurrentDate((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 7));
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



  const handleDeleteSchedule = async () => {
    if (selectedSchedule && user?.userId) {
      setIsDeleting(true);
      try {
        // Custom delete function without global loader
        const scheduleRef = firestore()
          .collection("schedules")
          .doc(selectedSchedule.id);
        const scheduleDoc = await scheduleRef.get();

        if (scheduleDoc.exists) {
          const scheduleData = scheduleDoc.data();
          const propertyId = scheduleData?.propertyId;
          const agreedPrice = parseFloat(scheduleData?.agreedPrice || "0");

          await scheduleRef.delete();

          if (propertyId) {
            const propertyRef = firestore()
              .collection("properties")
              .doc(propertyId);
            const propertyDoc = await propertyRef.get();

            if (propertyDoc.exists) {
              const propertyData = propertyDoc.data();
              const currentRevenue = parseFloat(propertyData?.revenue || "0");
              const newRevenue = Math.max(0, currentRevenue - agreedPrice);

              await propertyRef.update({
                revenue: newRevenue,
              });
            }
          }

          // Custom fetch schedules without global loader
          const userSchedulesSnapshot = await firestore()
            .collection("schedules")
            .where("createdBy", "==", user.userId)
            .get();

          if (userSchedulesSnapshot.empty) {
            dispatch({ type: "SET_USER_SCHEDULES", payload: [] });
          } else {
            const schedules = userSchedulesSnapshot.docs.map((doc: any) => ({
              ...doc.data(),
              id: doc.id,
            }));
            dispatch({ type: "SET_USER_SCHEDULES", payload: schedules });
          }

          setShowDeleteModal(false);
          setShowBookingDetailsModal(false);
          setSelectedSchedule(null);

          const successMessage = await getFirebaseErrorMessage(
            "Booking cancelled successfully"
          );
          Toast.show({
            type: "success",
            text1: successMessage,
            position: "bottom",
          });
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
        const errorMessage = await getFirebaseErrorMessage(
          "Failed to cancel booking"
        );
        Toast.show({
          type: "error",
          text1: errorMessage,
          position: "bottom",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleViewPDF = async () => {
    if (selectedSchedule) {
      try {
        const scheduleDoc = await firestore()
          .collection("schedules")
          .doc(selectedSchedule.id)
          .get();

        let updatedBookingDetails = { ...selectedSchedule };
        if (scheduleDoc.exists) {
          const data = scheduleDoc.data();
          updatedBookingDetails = {
            ...selectedSchedule,
            notes: data?.notes || "",
          };
        }

        // Fetch property images and otherDetails from Firestore
        let propertyImages = [];
        let propertyOtherDetails = "";
        if (selectedSchedule.propertyId) {
          const propertyDoc = await firestore()
            .collection("properties")
            .doc(selectedSchedule.propertyId)
            .get();
          if (propertyDoc.exists) {
            const propertyData = propertyDoc.data();
            propertyImages = propertyData?.images || [];
            propertyOtherDetails = propertyData?.otherDetails || "";
          }
        }
        updatedBookingDetails.images = propertyImages;
        updatedBookingDetails.otherDetails = propertyOtherDetails;

        // Before navigating to ViewPDF, ensure scheduleId is set
        updatedBookingDetails.scheduleId = updatedBookingDetails.id;
        navigation.navigate("ViewPDF", { visit: updatedBookingDetails });
      } catch (error) {
        console.error("Error viewing PDF:", error);
        Toast.show({
          type: "error",
          text1: t("pdfNotAvailable"),
          position: "bottom",
        });
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (selectedSchedule) {
      try {
        // Ensure we have the latest notes from Firestore
        const scheduleDoc = await firestore()
          .collection("schedules")
          .doc(selectedSchedule.id)
          .get();

        let updatedBookingDetails = { ...selectedSchedule };
        if (scheduleDoc.exists) {
          const data = scheduleDoc.data();
          updatedBookingDetails = {
            ...selectedSchedule,
            notes: data?.notes || "",
          };
        }

        // Fetch property images and otherDetails from Firestore
        let propertyImages = [];
        let propertyOtherDetails = "";
        if (selectedSchedule.propertyId) {
          const propertyDoc = await firestore()
            .collection("properties")
            .doc(selectedSchedule.propertyId)
            .get();
          if (propertyDoc.exists) {
            const propertyData = propertyDoc.data();
            propertyImages = propertyData?.images || [];
            propertyOtherDetails = propertyData?.otherDetails || "";
          }
        }
        updatedBookingDetails.images = propertyImages;
        updatedBookingDetails.otherDetails = propertyOtherDetails;

        const pdfPath = await generateSchedulePDF(updatedBookingDetails);
        if (Platform.OS === "android") {
          if (Platform.Version < 30) {
            Toast.show({
              type: "success",
              text1: t("pdfDownloaded"),
              text2: t("fileSavedToDownloads"),
              position: "bottom",
            });
          } else {
            // Android 11+ (SDK 30+): Use SAF to show Save As dialog and write PDF
            const fileName = pdfPath.split("/").pop() || "Booking_Invoice.pdf";
            const pdfBase64 = await RNFS.readFile(pdfPath, "base64");
            const fileDetail = await SAF.createDocument(pdfBase64, {
              mimeType: "application/pdf",
              initialName: fileName,
              encoding: "base64",
            });
            if (!fileDetail || !fileDetail.uri) {
              Toast.show({
                type: "error",
                text1: t("pdfDownloadFailed"),
                position: "bottom",
              });
              return;
            }
            Toast.show({
              type: "success",
              text1: t("pdfDownloaded"),
              text2: t("fileSavedToDownloads"),
              position: "bottom",
            });
          }
        } else if (Platform.OS === "ios") {
          await Share.open({
            title: t("sharePDF"),
            url: pdfPath,
            type: "application/pdf",
            filename: pdfPath.split("/").pop(),
            saveToFiles: true,
          });
          Toast.show({
            type: "success",
            text1: t("pdfDownloaded"),
            text2: t("useShareToSave"),
            position: "bottom",
          });
        }
      } catch (error) {
        console.error("Error downloading PDF:", error);
        Toast.show({
          type: "error",
          text1: t("pdfDownloadFailed"),
          position: "bottom",
        });
      }
    }
  };

  const handleSharePDF = async () => {
    if (selectedSchedule) {
      try {
        const scheduleDoc = await firestore()
          .collection("schedules")
          .doc(selectedSchedule.id)
          .get();

        let updatedBookingDetails = { ...selectedSchedule };
        if (scheduleDoc.exists) {
          const data = scheduleDoc.data();
          updatedBookingDetails = {
            ...selectedSchedule,
            notes: data?.notes || "",
          };
        }

        // Fetch property images and otherDetails from Firestore
        let propertyImages = [];
        let propertyOtherDetails = "";
        if (selectedSchedule.propertyId) {
          const propertyDoc = await firestore()
            .collection("properties")
            .doc(selectedSchedule.propertyId)
            .get();
          if (propertyDoc.exists) {
            const propertyData = propertyDoc.data();
            propertyImages = propertyData?.images || [];
            propertyOtherDetails = propertyData?.otherDetails || "";
          }
        }
        updatedBookingDetails.images = propertyImages;
        updatedBookingDetails.otherDetails = propertyOtherDetails;

        const pdfPath = await generateSchedulePDF(updatedBookingDetails);
        const fileExists = await RNFS.exists(pdfPath);
        if (!fileExists) {
          Toast.show({
            type: "error",
            text1: t("pdfNotAvailable"),
            position: "bottom",
          });
          return;
        }
        const fileInfo = await RNFS.stat(pdfPath);
        if (fileInfo.size === 0) {
          throw new Error("PDF file is empty");
        }
        const fileName = `Booking_Invoice_${moment().format("YYYY-MM-DD_HH-mm")}.pdf`;
        const shareOptions = {
          title: t("sharePDF"),
          url: Platform.OS === "android" ? `file://${pdfPath}` : pdfPath,
          type: "application/pdf",
          filename: fileName,
          saveToFiles: true,
          mimeType: "application/pdf",
          fileSize: fileInfo.size,
          subject: "Booking Invoice",
          message: "Please find attached the booking invoice.",
          failOnCancel: false,
          showAppsToView: true,
          isBase64: false,
          dialogTitle: "Share PDF",
          forceDialog: true,
          chooserTitle: "Share PDF with",
        };
        await Share.open(shareOptions);
      } catch (error) {
        console.error("Error sharing PDF:", error);
        Toast.show({
          type: "error",
          text1: t("shareFailed"),
          position: "bottom",
        });
      }
    }
  };

  const renderPropertyRow = ({
    item,
  }: {
    item: { propertyId: string; propertyName: string; schedules: any[] };
  }) => {
    const randomColors = [
      "#FF8A65",
      "#4DB6AC",
      "#9575CD",
      "#FFD54F",
      "#81C784",
      "#FFB74D",
      "#F06292",
      "#64B5F6",
    ];

    return (
      <View style={styles.propertyRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("ApartmentDetails", {
              changeLocation: "",
              id: item.propertyId,
              source: "schedules",
            })
          }
        >
          <Text style={styles.propertyText}>{item.propertyName}</Text>
        </TouchableOpacity>
        <View style={styles.slotsContainer}>
          {[...Array(7)].map((_, i) => {
            const slotDate = addDays(
              startOfWeek(currentDate, { weekStartsOn: 5 }),
              i
            );
            // Find all bookings for this slot
            const bookingsForDay = item.schedules.filter((schedule: any) => {
              if (schedule.visitDates) {
                const [startStr, endStr] = schedule.visitDates.split(" - ");
                const startDate = moment(startStr, "MMM D, YYYY").startOf(
                  "day"
                );
                const endDate = moment(endStr, "MMM D, YYYY").endOf("day");
                const slotMoment = moment(slotDate);
                return (
                  slotMoment.isSameOrAfter(startDate) &&
                  slotMoment.isSameOrBefore(endDate)
                );
              }
              return false;
            });
            if (bookingsForDay.length === 2) {
              return (
                <View
                  key={i}
                  style={[styles.slot, { flexDirection: "row", padding: 0 }]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor:
                        randomColors[
                        item.schedules.indexOf(bookingsForDay[0]) %
                        randomColors.length
                        ],
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                    }}
                    activeOpacity={0.8}
                    onPress={async () => {
                      setSelectedSchedule(bookingsForDay[0]);
                      await fetchPropertyImages(bookingsForDay[0]);
                      setShowBookingDetailsModal(true);
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor:
                        randomColors[
                        item.schedules.indexOf(bookingsForDay[1]) %
                        randomColors.length
                        ],
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                    }}
                    activeOpacity={0.8}
                    onPress={async () => {
                      setSelectedSchedule(bookingsForDay[1]);
                      await fetchPropertyImages(bookingsForDay[1]);
                      setShowBookingDetailsModal(true);
                    }}
                  />
                </View>
              );
            }
            else {
              let isBooked = bookingsForDay.length > 0;
              let bookingColor = isBooked
                ? randomColors[
                item.schedules.indexOf(bookingsForDay[0]) %
                randomColors.length
                ]
                : colors.Neutral_01;
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  onPress={() => handleSlotClick(i, item)}
                  style={[styles.slot, { backgroundColor: bookingColor }]}
                />
              );
            }
          })}
        </View>
      </View>
    );
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
      <View style={styles.reportButtonsRow}>
        <View style={styles.reportButton}>
          <CustomButton
            title="Monthly Report"
            onPress={handleMonthlyReport}
            isLoading={isGeneratingMonthlyReport}
            disabled={isGeneratingYearlyReport}
          />
        </View>
        <View style={styles.reportButton}>
          <CustomButton
            title="Yearly Summary"
            onPress={handleYearlyReport}
            isLoading={isGeneratingYearlyReport}
            disabled={isGeneratingMonthlyReport}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.daysContainer}>
          {days.map((item, index) => {
            const today = new Date();
            const dateToCheck = addDays(
              startOfWeek(currentDate, { weekStartsOn: 5 }),
              index
            );
            const isToday =
              format(dateToCheck, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("AddSchedule", {
                    preselectedDate: dateToCheck.toISOString().split("T")[0],
                  })
                }
              >
                <View
                  style={[
                    styles.dayItem,
                    isToday && { backgroundColor: colors.Primary_01 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isToday ? colors.white : colors.PLACE_HOLDER },
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.numberText,
                      { color: isToday ? colors.white : colors.black },
                    ]}
                  >
                    {item.number}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ marginBottom: 40 }}>
          {groupedSchedules.length === 0 ? (
            <View style={styles.noSchedulesFound}>
              <Text style={styles.noSchedulesText}>
                {t("noSchedulesFound")}
              </Text>
            </View>
          ) : (
            <FlatList
              data={groupedSchedules}
              keyExtractor={(item) => item.propertyId}
              renderItem={renderPropertyRow}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
      <Modal visible={showCalendar} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
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
      <Modal
        visible={showBookingDetailsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBookingDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("bookingDetails")}</Text>
            <ScrollView
              style={styles.bookingDetailsContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>
                  {t("clientName")}:
                </Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.clientName}
                </Text>
              </View>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>{t("email")}:</Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.email}
                </Text>
              </View>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>
                  {t("phoneNumber")}:
                </Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.phoneNum}
                </Text>
              </View>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>
                  {t("visitDates")}:
                </Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.visitDates}
                </Text>
              </View>
              {selectedSchedule?.checkInTime && (
                <View style={styles.bookingDetailRow}>
                  <Text style={styles.bookingDetailLabel}>
                    {t("checkInTime")}:
                  </Text>
                  <Text style={styles.bookingDetailValue}>
                    {moment(selectedSchedule.checkInTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A')}
                  </Text>
                </View>
              )}
              {selectedSchedule?.checkOutTime && (
                <View style={styles.bookingDetailRow}>
                  <Text style={styles.bookingDetailLabel}>
                    {t("checkOutTime")}:
                  </Text>
                  <Text style={styles.bookingDetailValue}>
                    {moment(selectedSchedule.checkOutTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A')}
                  </Text>
                </View>
              )}
              {selectedSchedule?.numberOfVisitors && (
                <View style={styles.bookingDetailRow}>
                  <Text style={styles.bookingDetailLabel}>
                    {t("numberOfVisitors")}:
                  </Text>
                  <Text style={styles.bookingDetailValue}>
                    {selectedSchedule.numberOfVisitors}
                  </Text>
                </View>
              )}
              {selectedSchedule?.numberOfInfants && (
                <View style={styles.bookingDetailRow}>
                  <Text style={styles.bookingDetailLabel}>
                    {t("numberOfInfants")}:
                  </Text>
                  <Text style={styles.bookingDetailValue}>
                    {selectedSchedule.numberOfInfants}
                  </Text>
                </View>
              )}
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>{t("location")}:</Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.location?.address}
                </Text>
              </View>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>
                  {t("agreedPrice")}:
                </Text>
                <Text style={styles.bookingDetailValue}>
                  {selectedSchedule?.agreedPrice || "0"}
                </Text>
              </View>
              {selectedSchedule?.advanceAmount && (
                <View style={styles.bookingDetailRow}>
                  <Text style={styles.bookingDetailLabel}>
                    {t("advanceAmount")}:
                  </Text>
                  <Text style={styles.bookingDetailValue}>
                    {selectedSchedule?.advanceAmount || "0"}
                  </Text>
                </View>
              )}
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>
                  {t("balanceAmount")}:
                </Text>
                <Text style={styles.bookingDetailValue}>
                  {parseInt(selectedSchedule?.agreedPrice || "0") -
                    parseInt(selectedSchedule?.advanceAmount || "0")}
                </Text>
              </View>
              {Boolean(selectedSchedule?.notes) && (
                <View style={[styles.bookingDetailRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                  <Text style={styles.bookingDetailLabel}>{t("notes")}:</Text>
                  <Text style={[styles.bookingDetailValue, { width: '100%', marginTop: 4 }]}>
                    {selectedSchedule?.notes}
                  </Text>
                </View>
              )}
              
              {/* {propertyImages && propertyImages.length > 0 && (
                <View style={styles.gallerySection}>
                  <Text style={[styles.bookingDetailLabel, { marginTop: 15, marginBottom: 10, width: '100%' }]}>
                    {t("galleryImagesBefore")}
                  </Text>
                  <View style={styles.galleryGrid}>
                    {propertyImages.map((item: string, index: number) => (
                      <TouchableOpacity
                        key={`before-${index}`}
                        activeOpacity={0.8}
                        onPress={() => openImageView(index, "before")}
                        style={styles.imageWrapper}
                      >
                        <FastImage
                          source={{ uri: item }}
                          style={styles.galleryImage}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )} */}

              {/* Images After Booking */}
              {propertyImagesAfter && propertyImagesAfter.length > 0 && (
                <View style={styles.gallerySection}>
                  <Text style={[styles.bookingDetailLabel, { marginTop: 15, marginBottom: 10, width: '100%' }]}>
                    {t("galleryImagesAfter")}
                  </Text>
                  <View style={styles.galleryGrid}>
                    {propertyImagesAfter.map((item: string, index: number) => (
                      <TouchableOpacity
                        key={`after-${index}`}
                        activeOpacity={0.8}
                        onPress={() => openImageView(index, "after")}
                        style={styles.imageWrapper}
                      >
                        <FastImage
                          source={{ uri: item }}
                          style={styles.galleryImage}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Image Viewer - Add this right after the images sections, still inside ScrollView */}
              <ImageView
                images={
                  viewingGallery === "before"
                    ? propertyImages.map((url: string) => ({ uri: url }))
                    : propertyImagesAfter.map((url: string) => ({ uri: url }))
                }
                imageIndex={selectedImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                swipeToCloseEnabled={true}
                doubleTapToZoomEnabled={true}
              />



            </ScrollView>
            <View style={styles.modalButtons}>
              <View>
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="file-eye-outline"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={handleViewPDF}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
              <View >
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="download-box-outline"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={handleDownloadPDF}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
              <View >
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={handleSharePDF}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
              <View>
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={() => setShowDeleteModal(true)}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
              <View >
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={() => {
                    setShowBookingDetailsModal(false);
                    navigation.navigate("EditSchedule", { booking: selectedSchedule });
                  }}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
              <View >
                <CustomButton
                  icon={
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={24}
                      color={colors.Primary_01}
                    />
                  }
                  onPress={() => setShowBookingDetailsModal(false)}
                  backgroundColor={colors.white}
                  textColor={colors.Primary_01}
                  disabled={isDeleting}
                />
              </View>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("confirmDeleteBooking")}</Text>
            <View style={styles.modalButtons}>
              <View style={{ width: "48%" }}>
                <CustomButton
                  title={isDeleting ? t("deleting") : t("ok")}
                  onPress={handleDeleteSchedule}
                  backgroundColor={colors.Primary_01}
                  textColor={colors.white}
                  isLoading={isDeleting}
                />
              </View>
              <View style={{ width: "48%" }}>
                <CustomButton
                  title={t("cancel")}
                  onPress={() => setShowDeleteModal(false)}
                  backgroundColor={colors.Primary_01}
                  textColor={colors.white}
                  disabled={isDeleting}
                />
              </View>
            </View>
          </View>
        </View>
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
  reportButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  reportButton: {
    width: "48%",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  calendarModal: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    width: "100%",
    maxWidth: 400,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    height: "90%",
    maxHeight: 600,
  },
  modalTitle: {
    ...Typography.f_16_nunito_bold,
    color: colors.black,
    textAlign: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  noSchedulesFound: {
    alignItems: "center",
    marginTop: 40,
  },
  noSchedulesText: {
    ...Typography.f_14_nunito_extra_bold,
    color: colors.Primary_01,
  },
  bookingDetailsContainer: {
    width: "100%",
    marginVertical: 15,
  },
  bookingDetailRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  bookingDetailLabel: {
    ...Typography.f_14_nunito_bold,
    color: colors.DARK_GREEN,
    width: "40%",
  },
  bookingDetailValue: {
    ...Typography.f_14_nunito_medium,
    color: colors.black,
    flex: 1,
  },
  gallerySection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageWrapper: {
    width: "31%",
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
});

export default Scheduled;
