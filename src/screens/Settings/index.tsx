import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";

const Settings: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
