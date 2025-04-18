import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import { BackIcon } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";
import CTAButton1 from "../../components/CTA_BUTTON1";

interface CreateContactProps {
  navigation: any;
}

const CreateContact: React.FC<CreateContactProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = () => {
    const formData = {
      name,
      email,
      phoneNum,
      notes,
    };

    console.log("Form Data:", formData);
  };

  return (
    <View style={[styles.mainContainer, styles.platformMarginTop]}>
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={[styles.headerText, Typography.f_17_nunito_bold]}>
              {t("createContact")}
            </Text>
            <Text />
          </View>
          <View style={styles.textInputSection}>
            <View style={{ gap: 8 }}>
              <Text
                style={[
                  Typography.f_16_nunito_medium,
                  { color: Colors.black, paddingLeft: 3 },
                ]}
              >
                {t("name")}
              </Text>
              <TextInput
                placeholder={t("name")}
                placeholderTextColor={Colors.PLACE_HOLDER}
                style={styles.textInput}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text
                style={[
                  Typography.f_16_nunito_medium,
                  { color: Colors.black, paddingLeft: 3 },
                ]}
              >
                {t("emailAddress")}
              </Text>
              <TextInput
                placeholder={t("emailAddress")}
                placeholderTextColor={Colors.PLACE_HOLDER}
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text
                style={[
                  Typography.f_16_nunito_medium,
                  { color: Colors.black, paddingLeft: 3 },
                ]}
              >
                {t("phoneNum")}
              </Text>
              <TextInput
                placeholder={t("phoneNum")}
                placeholderTextColor={Colors.PLACE_HOLDER}
                style={styles.textInput}
                value={phoneNum}
                onChangeText={setPhoneNum}
              />
            </View>
            <TextInput
              placeholder={t("note")}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor={Colors.PLACE_HOLDER}
              style={styles.textInputMultiline}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          <View style={styles.createBTnContainer}>
            <CTAButton1 title={t("create")} submitHandler={handleCreate} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    platformMarginTop: {
      marginTop: Platform.OS === "ios" ? 50 : 0,
    },
    contentContainer: {
      flex: 8,
    },
    scrollContainer: {
      marginHorizontal: "5%",
      paddingBottom: 50,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 40,
      marginBottom: 25,
    },
    headerText: {
      color: Colors.DARK_GREEN,
    },
    textInputSection: {
      marginVertical: 15,
      gap: 20,
    },
    textInput: {
      borderColor: colors.black,
      borderRadius: 5,
      borderWidth: 0.3,
      paddingHorizontal: 10,
      paddingVertical: 15,
      color: Colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
    },
    textInputMultiline: {
      borderColor: colors.black,
      borderRadius: 5,
      borderWidth: 0.3,
      paddingHorizontal: 10,
      paddingVertical: 15,
      color: Colors.DARK_GREEN,
      height: 120,
      ...Typography.f_14_nunito_medium,
    },
    createBTnContainer: {
      marginTop: 10,
    },
  });

export default CreateContact;
