import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "./screenResolution";

export const Typography = StyleSheet.create({
  f_32_nunito_semi_bold: {
    fontFamily: "Nunito-SemiBold",
    fontSize: RFValue(32, screenResolution.screenHeight),
  },
  f_16_nunito_medium: {
    fontFamily: "Nunito-Medium",
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_14_nunito_medium: {
    fontFamily: "Nunito-Medium",
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_12_nunito_medium: {
    fontFamily: "Nunito-Medium",
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_20_nunito_bold: {
    fontFamily: "Nunito-Bold",
    fontSize: RFValue(20, screenResolution.screenHeight),
  },
  f_17_nunito_bold: {
    fontFamily: "Nunito-Bold",
    fontSize: RFValue(17, screenResolution.screenHeight),
  },
  f_16_nunito_regular: {
    fontFamily: "Nunito-Regular",
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_16_nunito_semi_bold: {
    fontFamily: "Nunito-SemiBold",
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_16_nunito_bold: {
    fontFamily: "Nunito-Bold",
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_14_nunito_extra_bold: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_17_nunito_extra_bold: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: RFValue(17, screenResolution.screenHeight),
  },
  f_14_nunito_bold: {
    fontFamily: "Nunito-Bold",
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_12_nunito_bold: {
    fontFamily: "Nunito-Bold",
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_14_nunito_regular: {
    fontFamily: "Nunito-Regular",
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_14_nunito_semi_bold: {
    fontFamily: "Nunito-SemiBold",
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
});
