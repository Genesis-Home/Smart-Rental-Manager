import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header";
import Colors from "../../utilities/constants/colors";

const HomeUser: React.FC = () => {
  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleMenuPress} />
      <Text>HomeUser</Text>
    </View>
  );
};

export default HomeUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
