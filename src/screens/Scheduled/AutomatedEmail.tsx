import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Platform,
  PermissionsAndroid,
  Share as ShareRN,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import {
  Address,
  Email,
  Whatsapp,
  Share as ShareIcon,
  Copy,
} from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, VisitDetails } from "../../types/types";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import moment from "moment";
import { ScrollView } from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SAF from 'react-native-saf-x';

type AutomatedEmailParams = {
  visitDetails: VisitDetails;
  pdfPath?: string;
};

const AutomatedEmail: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, "AutomatedEmail">>();
  const visit = route.params?.visitDetails;
  const pdfPath = (route.params as AutomatedEmailParams)?.pdfPath;

  const navigation = useNavigation<NavigationProp<RootStackParamList, "Map">>();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${visit?.location.lat},${visit?.location.long}`;

  const visitMessage = `${t("visitDetails")}:

📅 ${t("visitData")}: ${visit?.visitDates}
⏰ ${t("checkInTime")}: ${visit?.checkInTime}
⏰ ${t("checkOutTime")}: ${visit?.checkOutTime}
👨‍👩‍👧‍👦 ${t("numberOfVisitors")}: ${visit?.numberOfVisitors}
👶 ${t("numberOfInfants")}: ${visit?.numberOfInfants}
🏠 ${t("propertyAddress")}: ${visit?.location.address}

💰 ${t("financialDetails")}:
${t("agreedPrice")}: ${visit?.agreedPrice}
${t("advanceAmount")}: ${visit?.advanceAmount || "0"}
${t("balanceAmount")}: ${(parseFloat(visit?.agreedPrice || "0") - parseFloat(visit?.advanceAmount || "0")).toFixed(2)}

🗺️ ${t("mapLink")}: ${googleMapsUrl}
`;

  const handleWhatsappShare = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(visitMessage)}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: "info",
        text1: t("whatsappNotInstall"),
        position: "bottom",
      });
    });
  };

  const handleShareApp = async () => {
    try {
      await ShareRN.share({
        message: visitMessage,
      });
    } catch (error) {
      Toast.show({ type: "error", text1: t("shareErr"), position: "bottom" });
    }
  };

  const handleCopyData = () => {
    Clipboard.setString(visitMessage);
    Toast.show({ type: "success", text1: t("copyMsg"), position: "bottom" });
  };

  const handleDownloadPDF = async () => {
    if (!pdfPath) {
      Toast.show({
        type: "error",
        text1: t("pdfNotAvailable"),
        position: "bottom",
      });
      return;
    }

    try {
      if (Platform.OS === "android") {
        if (Platform.Version < 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: t("storagePermissionTitle"),
              message: t("storagePermissionMessage"),
              buttonNeutral: t("askMeLater"),
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Toast.show({
              type: "error",
              text1: t("permissionDenied"),
              position: "bottom",
            });
            return;
          }
          // For Android < 11, file is already in Downloads
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
          Toast.show({
            type: "success",
            text1: t("pdfDownloaded"),
            text2: t("fileSavedToDownloads"),
            position: "bottom",
          });
          return;
        } else {
          // Android 11+ (SDK 30+): Use SAF to show Save As dialog and write PDF
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
          // Read PDF as base64
          const fileName = pdfPath.split("/").pop() || `Booking_Invoice.pdf`;
          const pdfBase64 = await RNFS.readFile(pdfPath, 'base64');
          // Show SAF Save As dialog and write file
          const fileDetail = await SAF.createDocument(pdfBase64, {
            mimeType: 'application/pdf',
            initialName: fileName,
            encoding: 'base64'
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
          return;
        }
      } else if (Platform.OS === "ios") {
        // iOS: Use Share dialog
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
        return;
      }
    } catch (error) {
      console.error("PDF download error:", error);
      Toast.show({
        type: "error",
        text1: t("pdfDownloadFailed"),
        position: "bottom",
      });
    }
  };

  const handleSharePDF = async () => {
    if (!pdfPath) {
      Toast.show({
        type: "error",
        text1: t("pdfNotAvailable"),
        position: "bottom",
      });
      return;
    }

    try {
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

      const fileName = `Booking_Invoice_${moment().format(
        "YYYY-MM-DD_HH-mm"
      )}.pdf`;

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

      const result = await Share.open(shareOptions);
      console.log("Share result:", result);
    } catch (error) {
      console.error("PDF share error:", error);
      Toast.show({
        type: "error",
        text1: t("shareFailed"),
        position: "bottom",
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Tabs", { screen: "Scheduled" });
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <View style={styles.screenWrapper}>
      <Header title={t("AutomatedEmail")} isAutomatedEmail />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Email style={styles.emailIconStyle} />

        <Text style={styles.confirmationMessage}>{t("visitConfirmed")}</Text>

        <View style={styles.visitDetailsWrapper}>
          <Text style={styles.sectionTitle}>{t("visitDetails")}</Text>

          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("visitData")}: </Text>
            {visit?.visitDates}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("checkInTime")}: </Text>
            {visit?.checkInTime}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("checkOutTime")}: </Text>
            {visit?.checkOutTime}
          </Text>

          {visit?.numberOfVisitors && (
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("numberOfVisitors")}: </Text>
              {visit.numberOfVisitors}
            </Text>
          )}

          {visit?.numberOfInfants && (
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("numberOfInfants")}: </Text>
              {visit.numberOfInfants}
            </Text>
          )}

          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("propertyAddress")}: </Text>
            {visit?.location?.address}
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            {t("financialDetails")}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("agreedPrice")}: </Text>
            {visit?.agreedPrice}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("advanceAmount")}: </Text>
            {visit?.advanceAmount || "0"}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("balanceAmount")}: </Text>
            {(parseInt(visit?.agreedPrice || "0") - parseInt(visit?.advanceAmount || "0"))}
          </Text>
        </View>

        <View style={styles.mapLinkWrapper}>
          <Address />
          <Text
            onPress={() =>
              navigation.navigate("Map", { location: visit.location })
            }
            style={styles.googleMapsText}
          >
            {t("openInGoogleMaps")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop:30
          }}
        >
          <View style={{ width: "32%" }}>
            <CTAButton1
              title={t("viewPdf")}
              submitHandler={()=>navigation.navigate('ViewPDF',{visit:visit})}
              backgroundColor={Colors.Primary_01}
              textColor={Colors.white}
            />
          </View>
          <View style={{ width: "32%" }}>
            <CTAButton1
              title={t("downloadPDF")}
              submitHandler={handleDownloadPDF}
              backgroundColor={Colors.Primary_01}
              textColor={Colors.white}
            />
          </View>
          <View style={{ width: "32%" }}>
            <CTAButton1
              title={t("sharePDF")}
              submitHandler={handleSharePDF}
              backgroundColor={Colors.Primary_01}
              textColor={Colors.white}
            />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <CTAButton1
            title={t("Whatsapp")}
            submitHandler={handleWhatsappShare}
            icon={<Whatsapp />}
          />
          <CTAButton1
            title={t("ShareApp")}
            submitHandler={handleShareApp}
            backgroundColor={Colors.white}
            textColor={Colors.Primary_01}
            icon={<ShareIcon />}
          />
          <CTAButton1
            title={t("Copydata")}
            submitHandler={handleCopyData}
            backgroundColor={Colors.white}
            textColor={Colors.black}
            icon={<Copy />}
            borderColor={Colors.black}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AutomatedEmail;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  emailIconStyle: {
    alignSelf: "center",
    marginTop: 20,
  },
  confirmationMessage: {
    ...Typography.f_14_nunito_bold,
    color: Colors.black,
    textAlign: "center",
    marginTop: 15,
  },
  visitDetailsWrapper: {
    marginTop: 30,
    gap: 5,
  },
  sectionTitle: {
    ...Typography.f_14_nunito_bold,
    color: Colors.black,
  },
  detailRow: {
    ...Typography.f_14_nunito_regular,
    color: Colors.black,
  },
  detailLabel: {
    ...Typography.f_14_nunito_bold,
  },
  mapLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  googleMapsText: {
    ...Typography.f_14_nunito_semi_bold,
    color: Colors.Primary_01,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 15,
    marginBottom:40
  },
});
