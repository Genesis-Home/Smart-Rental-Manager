import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header";
import Colors from "../../utilities/constants/colors";

const Home: React.FC = () => {
  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleMenuPress} />
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
