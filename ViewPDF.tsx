import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface InvoiceData {
  invoiceId: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyName: string;
  propertyLocation: string;
  visitDates: string;
  visitTime: string;
  agreedPrice: number;
  advanceAmount: number;
  totalAmount: number;
  balanceAmount: number;
  generatedInfo: string;
}

interface ViewPDFProps {
  invoiceData: InvoiceData;
}

const ViewPDF: React.FC<ViewPDFProps> = ({ invoiceData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.invoiceTitle}>Invoice</Text>
      <View style={styles.header}>
        <Text style={styles.invoiceId}>Invoice ID: {invoiceData.invoiceId}</Text>
        <Text style={styles.invoiceDate}>Invoice Date: {invoiceData.invoiceDate}</Text>
      </View>

      <Text style={styles.sectionTitle}>Customer Information</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailValue}>{invoiceData.customerName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailValue}>{invoiceData.customerEmail}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Phone:</Text>
        <Text style={styles.detailValue}>{invoiceData.customerPhone}</Text>
      </View>

      <Text style={styles.sectionTitle}>Visit Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Property:</Text>
        <Text style={styles.detailValue}>{invoiceData.propertyName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Location:</Text>
        <Text style={styles.detailValue}>{invoiceData.propertyLocation}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Visit Dates:</Text>
        <Text style={styles.detailValue}>{invoiceData.visitDates}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Visit Time:</Text>
        <Text style={styles.detailValue}>{invoiceData.visitTime}</Text>
      </View>

      <Text style={styles.sectionTitle}>Financial Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Agreed Price:</Text>
        <Text style={styles.detailValue}>{invoiceData.agreedPrice}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Down Payment:</Text>
        <Text style={styles.detailValue}>{invoiceData.advanceAmount}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total Amount:</Text>
        <Text style={styles.detailValue}>{invoiceData.totalAmount}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Balance Amount:</Text>
        <Text style={styles.detailValue}>{invoiceData.balanceAmount}</Text>
      </View>

      <Text style={styles.generatedInfo}>{invoiceData.generatedInfo}</Text>
      <Text style={styles.thankYou}>Thank you for choosing our services!</Text>
    </View>
  )
}

export default ViewPDF

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  invoiceId: {
    fontSize: 12,
    color: '#555',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '40%', // Adjust as needed
  },
  detailValue: {
    fontSize: 14,
    width: '60%', // Adjust as needed
    textAlign: 'right',
  },
  generatedInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  thankYou: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#888',
  },
})