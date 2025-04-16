import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useSelector } from "react-redux";
import { Typography } from "../utilities/constants/constant.style";
import { colors } from "../utilities/constants";

interface CTAButton1Props {
  title: string;
  submitHandler: () => void;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

const CTAButton1: React.FC<CTAButton1Props> = ({
  title,
  submitHandler,
  icon,
  backgroundColor,
  textColor,
}) => {
  const isLoader = useSelector((state: any) => state.reducer.isLoader);

  const styles = createStyles(colors, backgroundColor, textColor);

  return (
    <TouchableOpacity
      onPress={submitHandler}
      activeOpacity={0.8}
      style={styles.CRAButton1}
    >
      {!isLoader ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon && icon}
          <Text style={[styles.CRAButton1_Text, Typography.f_16_nunito_semi_bold]}>
            {title}
          </Text>
        </View>
      ) : (
        <ActivityIndicator color={"white"} />
      )}
    </TouchableOpacity>
  );
};

export default CTAButton1;

const createStyles = (
  colors: any,
  backgroundColor?: string,
  textColor?: string
): { CRAButton1: ViewStyle; CRAButton1_Text: TextStyle } => {
  return StyleSheet.create({
    CRAButton1: {
      backgroundColor: backgroundColor || colors.Primary_01,
      borderRadius: 5,
      height: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.Primary_01,
    },
    CRAButton1_Text: {
      textAlign: "center",
      color: textColor || colors.white,
    },
  });
};
