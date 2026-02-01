import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import Images from "../../assets/images";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";
import { Down, DropRight, Signout } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { appLanguages } from "../../utilities/languageData/data";
import i18n from "i18next";
import { SettingNavigationProp } from "../../types/types";
import CTAButton1 from "../../components/CTA_BUTTON1";
import { logoutUser } from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setItem } from "../../services/assynsStorage";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SettingNavigationProp>();
  const user = useAppSelector((state: any) => state.reducer.user);
  console.log(user, "user");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const currentLang = i18n.language;
    const langObj = appLanguages.find((lang) => lang.code === currentLang);
    return langObj ? langObj.name : "English";
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handlePress = (option: string) => {
    if (option === "language") {
      setShowLanguageDropdown(!showLanguageDropdown);
    } else {
      setShowLanguageDropdown(false);
      setSelectedOption(option);
      if (option === "notification") {
        navigation.navigate("Notification");
      } else if (option === "myads") {
        navigation.navigate("MyAds");
      } else if (option === "editProfile") {
        navigation.navigate("EditProfile");
      } else if (option === "termsConditions") {
        navigation.navigate("TermsAndConditions");
      } else if (option === "privacyPolicy") {
        navigation.navigate("PrivacyPolicy");
      } else if (option === "signOut") {
        setShowLogoutModal(true);
      }
    }
  };

  const handleLanguageSelect = async (langCode: string, langName: string) => {
    i18n.changeLanguage(langCode);
    await setItem("languagecode", langCode);
    setCurrentLanguage(langName);
    setShowLanguageDropdown(false);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    dispatch(logoutUser(navigation));
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      <Header title={t("setting")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <Image
            source={
              user?.profilePhoto ? { uri: user.profilePhoto } : Images.ProfilePlaceholder
            }
            resizeMode="cover"
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>
              {user?.ownerName ?? "Frank Williams"}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email ?? "frank-williams@em"}
            </Text>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "editProfile"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("editProfile")}
          >
            <Text style={styles.optionText}>{t("editProfile")}</Text>
            <DropRight />
          </TouchableOpacity>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "myads"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("myads")}
          >
            <Text style={styles.optionText}>{t("myads")}</Text>
            <DropRight />
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "notification"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("notification")}
          >
            <Text style={styles.optionText}>{t("notification")}</Text>
            <DropRight />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionButton,
                {
                  borderColor: showLanguageDropdown
                    ? colors.Primary_01
                    : colors.Neutral_01,
                  borderBottomLeftRadius: showLanguageDropdown ? 0 : 4,
                  borderBottomRightRadius: showLanguageDropdown ? 0 : 4,
                },
              ]}
              onPress={() => handlePress("language")}
            >
              <Text style={styles.optionText}>{currentLanguage}</Text>
              {showLanguageDropdown ? <Down /> : <DropRight />}
            </TouchableOpacity>
            {showLanguageDropdown && (
              <View style={styles.languageDropdown}>
                {appLanguages.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    style={styles.languageOption}
                    onPress={() => handleLanguageSelect(lang.code, lang.name)}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        {
                          fontWeight:
                            currentLanguage === lang.name ? "bold" : "normal",
                        },
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "termsConditions"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("termsConditions")}
          >
            <Text style={styles.optionText}>{t("termsConditions")}</Text>
            <DropRight />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "privacyPolicy"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("privacyPolicy")}
          >
            <Text style={styles.optionText}>{t("privacyPolicy")}</Text>
            <DropRight />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === "signOut"
                    ? colors.Primary_01
                    : colors.Neutral_01,
              },
            ]}
            onPress={() => handlePress("signOut")}
          >
            <Text style={styles.signOutText}>{t("signOut")}</Text>
            <Signout />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("confirmLogout")}</Text>
            <View style={styles.modalButtons}>
              <View style={{ width: "30%" }}>
                <CTAButton1
                  title={t("ok")}
                  submitHandler={handleLogoutConfirm}
                  btnStyle={{ height: 40 }}
                />
              </View>
              <View style={{ width: "30%" }}>
                <CTAButton1
                  title={t("cancel")}
                  submitHandler={handleLogoutCancel}
                  btnStyle={{ height: 40 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  profileContainer: {
    marginVertical: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  profileName: {
    ...Typography.f_17_nunito_extra_bold,
    color: Colors.DARK_GREEN,
  },
  profileEmail: {
    ...Typography.f_12_nunito_medium,
    color: colors.PLACE_HOLDER,
  },
  optionsContainer: {
    gap: 15,
    marginBottom: 40,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 13,
    height:45
  },
  optionText: {
    ...Typography.f_12_nunito_medium,
    color: colors.DARK_GREEN,
  },
  signOutText: {
    ...Typography.f_12_nunito_medium,
    color: colors.Error_Red,
  },
  languageDropdown: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.Primary_01,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.Neutral_01,
  },
  languageText: {
    ...Typography.f_14_nunito_medium,
    color: colors.DARK_GREEN,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    ...Typography.f_16_nunito_bold,
    color: colors.DARK_GREEN,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
});
