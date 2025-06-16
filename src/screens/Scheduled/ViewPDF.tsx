import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../utilities/constants/colors";
import { colors } from "../../utilities/constants";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import moment from "moment";

const ViewPDF: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ViewPDF">>();
  const visit = route.params.visit;

  return (
    <View style={styles.container}>
      <Text style={styles.invoiceTitle}>Invoice</Text>
      <View style={styles.header}>
        <Text style={styles.invoiceId}>Invoice ID: {visit?.scheduleId}</Text>
        <Text style={styles.invoiceDate}>
          Invoice Date: {moment().format("MMMM D, YYYY")}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Customer Information</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailValue}>{visit?.clientName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailValue}>{visit?.email}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Phone:</Text>
        <Text style={styles.detailValue}>{visit?.phoneNum}</Text>
      </View>
      <Text style={styles.sectionTitle}>Visit Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Property:</Text>
        <Text style={styles.detailValue}>{visit?.property}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Location:</Text>
        <Text style={styles.detailValue}> {visit?.location?.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Visit Dates:</Text>
        <Text style={styles.detailValue}> {visit?.visitDates}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Visit Time:</Text>
        <Text style={styles.detailValue}>{visit?.visitTime}</Text>
      </View>
      <Text style={styles.sectionTitle}>Financial Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Agreed Price:</Text>
        <Text style={styles.detailValue}>{visit?.agreedPrice}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Advance Amount:</Text>
        <Text style={styles.detailValue}>{visit?.advanceAmount || "0"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Balance Amount:</Text>
        <Text style={styles.detailValue}>
          {(parseInt(visit?.agreedPrice || "0") - parseInt(visit?.advanceAmount || "0"))}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total Amount:</Text>
        <Text style={styles.detailValue}>{visit?.agreedPrice}</Text>
      </View>
      <Text style={styles.generatedInfo}>
        Generated on {moment().format("MMMM D, YYYY h:mm A")}
      </Text>
      <Text style={styles.thankYou}>Thank you for choosing our services!</Text>
    </View>
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
    width: "60%",
  },
  invoiceDate: {
    fontSize: 12,
    color: "#555",
    width: "40%",
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
  },
});
