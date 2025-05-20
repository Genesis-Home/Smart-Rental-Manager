import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { BackIcon } from "../assets/icons";
import { Typography } from "../utilities/constants/constant.style";
import Colors from "../utilities/constants/colors";
import { HeaderProps } from "../types/types";

const Header: React.FC<HeaderProps> = ({ title, isAutomatedEmail = false }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleBackPress = () => {
    if (isAutomatedEmail) {
      navigation.navigate("Tabs", { screen: "Home" });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleBackPress}
        style={{ position: "absolute", left: 0 }}
      >
        <BackIcon />
      </TouchableOpacity>
      <Text style={[{ color: Colors.DARK_GREEN }, Typography.f_17_nunito_bold]}>
        {title}
      </Text>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});

export default Header;
