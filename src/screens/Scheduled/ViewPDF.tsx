import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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

const ViewPDF: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ViewPDF">>();
  const { t } = useTranslation();
  const visit = route.params.visit;
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState("");

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
        setNotes(data?.notes || "");
        setSavedNotes(data?.notes || "");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const saveNotes = async () => {
    try {
      const docId = visit?.scheduleId || visit?.id;
      if (!docId) {
        console.error("No scheduleId or id found in visit object!", visit);
        Toast.show({
          type: "error",
          text1: "No scheduleId or id found!",
          position: "bottom",
        });
        return;
      }
      console.log('Saving notes:', notes, 'to docId:', docId);
      await firestore().collection("schedules").doc(docId).update({
        notes: notes,
      });

      // Reload notes from Firestore for latest value
      await loadNotes();

      setIsEditing(false);

      Toast.show({
        type: "success",
        text1: t("notesSavedSuccessfully"),
        position: "bottom",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      Toast.show({
        type: "error",
        text1: t("failedToSaveNotes"),
        position: "bottom",
      });
    }
  };

  const handleEditNotes = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setNotes(savedNotes);
    setIsEditing(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView style={styles.container}>
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
        {isEditing ? (
          <View style={[styles.notesContainer, { paddingBottom: 25 }]}>
            <Text style={styles.notesLabel}>{t("notes")}</Text>
            <TextInput
              style={styles.notesTextInput}
              placeholder={t("notes")}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.PLACE_HOLDER}
            />
            <View style={styles.notesButtons}>
              <TouchableOpacity style={styles.notesButton} onPress={saveNotes}>
                <Text style={styles.notesButtonText}>{t("save")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.notesButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.notesButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>{t("notes")}</Text>
            <Text style={styles.notesText}>
              {notes || t("noNotesAdded")}
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditNotes}>
              <Text style={styles.editButtonText}>{t("editNotes")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.generatedInfo}>
          {t("generatedOn")} {moment().format("MMMM D, YYYY h:mm A")}
        </Text>
        <Text style={styles.thankYou}>{t("thankYouMessage")}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  notesTextInput: {
    width: "100%",
    color: Colors.black,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: Colors.white,
  },
  notesButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  notesButton: {
    padding: 10,
    backgroundColor: colors.Primary_01,
    borderRadius: 5,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
  },
  notesButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButton: {
    borderColor: Colors.Primary_01,
    borderWidth: 0.5,
  },
  notesText: {
    fontSize: 14,
    color: Colors.black,
  },
  editButton: {
    padding: 10,
    backgroundColor: colors.Primary_01,
    borderRadius: 5,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});
