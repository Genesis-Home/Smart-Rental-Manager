import React, { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../utilities/constants";
import { Logo } from "../../assets/icons";
import { SplashProps } from "../../types/types";
import { useAppDispatch } from "../../store/hooks";
import { getCurrentUser } from "../../store/actions/action";

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
      const user = await dispatch(getCurrentUser(navigation));
      if (user) {
        navigation.navigate("Tabs");
      } else {
        navigation.navigate("Splash1");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigation.navigate("Splash1");
    }
  }, [navigation, dispatch]);

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
    backgroundColor: colors.white,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Splash;
