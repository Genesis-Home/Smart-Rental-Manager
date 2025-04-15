import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Images from "../assets/images";
import Colors from "../utilities/constants/colors";

interface HeaderProps {
  onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.header}>
      <Image
        resizeMode="cover"
        style={styles.logo}
        source={Images.HorizontalLogo}
      />
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={0.8}
        onPress={onMenuPress}
      >
        <Icon name="menu" size={30} color={Colors.Primary_01} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Colors.white,
    shadowColor: Colors.Neutral_01,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 50,
  },
  menuButton: {
    padding: 8,
  },
});
