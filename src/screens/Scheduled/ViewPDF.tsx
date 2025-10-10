import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../utilities/constants/colors";
import { colors } from "../../utilities/constants";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";

const ViewPDF: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ViewPDF">>();
  const { t } = useTranslation();
  const visit = route.params.visit;
  console.log("ViewPDF visit.images:", visit.images);
  console.log("ViewPDF visit.imagesAfter:", visit.imagesAfter);
  console.log("ViewPDF visit param:", visit);
  
  const [notes, setNotes] = useState("");
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewingGallery, setViewingGallery] = useState<"before" | "after">("before");

  useEffect(() => {
    if (visit?.scheduleId) {
      loadNotes();
    }
  }, [visit?.scheduleId]);

  useFocusEffect(
    React.useCallback(() => {
      if (visit?.scheduleId || visit?.id) {
        loadNotes();
      }
    }, [visit?.scheduleId, visit?.id])
  );

  const loadNotes = async () => {
    try {
      const docId = visit?.scheduleId || visit?.id;
      if (!docId) {
        console.error("No scheduleId or id found in visit object!", visit);
        return;
      }
      const scheduleDoc = await firestore()
        .collection("schedules")
        .doc(docId)
        .get();

      if (scheduleDoc.exists) {
        const data = scheduleDoc.data();
        console.log("ViewPDF data:", data);
        setNotes(data?.notes || "");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const openImageView = (index: number, gallery: "before" | "after" = "before") => {
    setSelectedImageIndex(index);
    setViewingGallery(gallery);
    setIsImageViewVisible(true);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, marginHorizontal: '5%' }}
      contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.invoiceTitle}>{t("invoice")}</Text>
      <View style={styles.header}>
        <Text style={styles.invoiceId}>
          {t("invoiceId")}: {visit?.scheduleId}
        </Text>
        <Text style={styles.invoiceDate}>
          {t("invoiceDate")}: {moment().format("MMMM D, YYYY")}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>{t("customerInformation")}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("name")}:</Text>
        <Text style={styles.detailValue}>{visit?.clientName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("email")}:</Text>
        <Text style={styles.detailValue}>{visit?.email}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("phoneNum")}:</Text>
        <Text style={styles.detailValue}>{visit?.phoneNum}</Text>
      </View>
      <Text style={styles.sectionTitle}>{t("visitDetails")}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("propertyName")}:</Text>
        <Text style={styles.detailValue}>{visit?.property}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("location")}:</Text>
        <Text style={styles.detailValue}> {visit?.location?.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("visitDates")}:</Text>
        <Text style={styles.detailValue}> {visit?.visitDates}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("checkInTime")}:</Text>
        <Text style={styles.detailValue}>{visit?.checkInTime ? moment(visit.checkInTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A') : ''}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("checkOutTime")}:</Text>
        <Text style={styles.detailValue}>{visit?.checkOutTime ? moment(visit.checkOutTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A') : ''}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("otherDet")}:</Text>
        <Text style={styles.detailValue}>{visit.otherDetails}</Text>
      </View>
      <Text style={styles.sectionTitle}>{t("financialDetails")}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("agreedPrice")}:</Text>
        <Text style={styles.detailValue}>{visit?.agreedPrice}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("advanceAmount")}:</Text>
        <Text style={styles.detailValue}>{visit?.advanceAmount || "0"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t("balanceAmount")}:</Text>
        <Text style={styles.detailValue}>
          {parseInt(visit?.agreedPrice || "0") -
            parseInt(visit?.advanceAmount || "0")}
        </Text>
      </View>

      {/* Images Before Booking */}
      {/* {visit?.images && visit.images.length > 1 && (
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>{t("galleryImagesBefore")}</Text>
          <View style={styles.galleryGrid}>
            {visit.images.slice(1).map((item: string, index: number) => (
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
      {visit?.imagesAfter && visit.imagesAfter.length > 0 && (
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>{t("galleryImagesAfter")}</Text>
          <View style={styles.galleryGrid}>
            {visit.imagesAfter.map((item: string, index: number) => (
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

      <ImageView
        images={
          viewingGallery === "before"
            ? visit?.images?.slice(1).map((url: string) => ({ uri: url })) || []
            : visit?.imagesAfter?.map((url: string) => ({ uri: url })) || []
        }
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />

      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>{t("notes")}</Text>
        <Text style={styles.notesText}>
          {notes || t("noNotesAdded")}
        </Text>
      </View>

      <Text style={styles.generatedInfo}>
        {t("generatedOn")} {moment().format("MMMM D, YYYY h:mm A")}
      </Text>
      <Text style={styles.thankYou}>{t("thankYouMessage")}</Text>
    </KeyboardAwareScrollView>
  );
};

export default ViewPDF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.Primary_01,
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  invoiceId: {
    fontSize: 12,
    color: "#555",
    width: "55%",
  },
  invoiceDate: {
    fontSize: 12,
    color: "#555",
    width: "35%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
    color: Colors.black,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    width: "60%",
    color: Colors.black,
  },
  generatedInfo: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  thankYou: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    color: "#888",
    paddingBottom: 100,
  },
  detailsForCustomerSection: {
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  notesContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
  },
  notesLabel: {
    ...Typography.f_16_nunito_bold,
    color: Colors.black,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: Colors.black,
  },
  gallerySection: {
    marginTop: 5,
    marginBottom: 5,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  imageWrapper: {
    width: '31%',
    marginRight: '2.5%',
    marginBottom: 8,
  },
  galleryList: {
    paddingVertical: 5,
  },
  galleryImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});