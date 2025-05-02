import React, { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../utilities/constants";
import { Logo } from "../../assets/icons";
import { SplashProps } from "../../types/types";
import { getItem } from "../../services/assynsStorage";

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
      const user = await getItem("user", null);
      if (user) {
        navigation.navigate("Tabs");
      } else {
        navigation.navigate("Splash1");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigation.navigate("Splash1");
    }
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
