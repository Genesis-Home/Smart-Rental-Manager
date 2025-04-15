import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "../../components/Header";
import Colors from "../../utilities/constants/colors";

const Search: React.FC = () => {
  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleMenuPress} />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
