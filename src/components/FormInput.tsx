import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors } from "../utilities/constants";
import { Typography } from "../utilities/constants/constant.style";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../utilities/constants/screenResolution";
import { FormInputProps } from "../types/types";

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  showToggle,
  onToggleSecure,
  secureTextEntry,
  ...rest
}) => {
  const showError = typeof error === "string" ? error : undefined;

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, rest.multiline && styles.multilineInput]}
          placeholderTextColor={colors.PLACE_HOLDER}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        {showToggle && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onToggleSecure}
            style={styles.eyeIcon}
          >
            <Feather
              name={secureTextEntry ? "eye" : "eye-off"}
              style={styles.eyeIconStyle}
            />
          </TouchableOpacity>
        )}
      </View>
      {showError && <Text style={styles.errorText}>{showError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    color: colors.DARK_GREEN,
    ...Typography.f_14_nunito_medium,
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderColor: colors.black,
  },
  input: {
    flex: 1,
    height: 45,
    color: colors.DARK_GREEN,
    ...Typography.f_12_nunito_medium,
  },
  errorText: {
    color: colors.Error_Red,
    marginVertical: 5,
    ...Typography.f_14_nunito_medium,
  },
  eyeIcon: {
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIconStyle: {
    fontSize: RFValue(20, screenResolution.screenHeight),
    color: colors.DARK_GREEN,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});

export default FormInput;
