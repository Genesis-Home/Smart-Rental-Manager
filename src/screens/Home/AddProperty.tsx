import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";

const AddProperty: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>AddProperty</Text>
    </View>
  );
};

export default AddProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
