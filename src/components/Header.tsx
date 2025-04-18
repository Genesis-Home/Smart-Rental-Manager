import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "../assets/icons";
import { Typography } from "../utilities/constants/constant.style";
import Colors from "../utilities/constants/colors";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 10,
  },
});

export default Header;
