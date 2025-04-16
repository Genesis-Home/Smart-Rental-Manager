import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";

const ExportData: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>ExportData</Text>
    </View>
  );
};

export default ExportData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
