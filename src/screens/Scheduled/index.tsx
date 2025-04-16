import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";

const Scheduled: React.FC = () => {

  return (
    <View style={styles.container}>
      <Text>Scheduled</Text>
    </View>
  );
};

export default Scheduled;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
