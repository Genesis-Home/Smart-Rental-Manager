import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { colors } from "../../utilities/constants";
import { Logo } from "../../assets/icons";

interface SplashProps {
  navigation: NavigationProp<any, any>;
}

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Splash1");
    }, 500);
  }, [navigation]);

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <Logo />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.Primary_01,
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
  },
});

export default Splash;
