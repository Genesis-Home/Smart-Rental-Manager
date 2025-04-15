import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../utilities/constants/colors";
import { Logo1 } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { colors } from "../../utilities/constants";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";

type Splash1ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash1"
>;

const Splash1: React.FC = () => {
  const navigation = useNavigation<Splash1ScreenNavigationProp>();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo1 />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.titleText, Typography.f_32_nunito_semi_bold]}>
          {t("welcome")}
        </Text>
        <Text style={[styles.subText, Typography.f_16_nunito_medium]}>
          {t("trackVisits")}
        </Text>
        <View style={styles.buttonWrapper}>
          <CTAButton1
            submitHandler={() => navigation.navigate("Signin")}
            title={t("signIn")}
          />
          <CTAButton1
            submitHandler={() => navigation.navigate("Signup")}
            backgroundColor={colors.white}
            textColor={colors.Primary_01}
            title={t("signup")}
          />
        </View>
      </View>
    </View>
  );
};

export default Splash1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 30,
  },
  logoContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  titleText: {
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    lineHeight: 24,
    paddingTop: 10,
  },
  buttonWrapper: {
    marginTop: 40,
    gap: 20,
  },
});
