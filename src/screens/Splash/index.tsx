import React, { useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { useDispatch } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import Images from "../../assets/images/index";
import { colors } from "../../utilities/constants";

interface SplashProps {
  navigation: NavigationProp<any, any>;
}

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Signin");
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <Image
          resizeMode="contain"
          style={{ width: 300, height: 300 }}
          source={Images.Logo}
        />
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
