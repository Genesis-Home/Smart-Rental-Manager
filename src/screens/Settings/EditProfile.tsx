import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import Images from "../../assets/images";
import { Edit } from "../../assets/icons";
import { EditProfileProps } from "../../types/types";
import { updateUser } from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  agencyName: Yup.string().required(t("agencyNameRequired")),
  ownerName: Yup.string().required(t("ownerNameRequired")),
  email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
});

const EditProfile: React.FC<EditProfileProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = useAppSelector((state: any) => state.reducer.user);
  const styles = createStyles(colors);

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
          return;
        }

        if (response.errorCode) {
          console.error("Image picker error:", response.errorMessage);
          Toast.show({
            type: "error",
            text1: "Failed to select image. Please try again.",
            position: "bottom",
          });
          return;
        }

        if (response.assets && response.assets[0]?.uri) {
          const imageUri = response.assets[0].uri;
          setIsUploading(true);

          try {
            const fileName = `profile_${Date.now()}_${imageUri.substring(imageUri.lastIndexOf("/") + 1)}`;
            const reference = storage().ref(fileName);
            await reference.putFile(imageUri);
            const downloadUrl = await reference.getDownloadURL();
            setProfileImage(downloadUrl);
          } catch (error) {
            console.error("Image upload error:", error);
            Toast.show({
              type: "error",
              text1: "Failed to upload image. Please try again.",
              position: "bottom",
            });
            // Keep the existing profile photo if upload fails
            setProfileImage(user?.profilePhoto || null);
          } finally {
            setIsUploading(false);
          }
        }
      }
    );
  };

  const handleSubmitForm = (values: any) => {
    const credentials = {
      agencyName: values.agencyName,
      ownerName: values.ownerName,
      email: values.email,
      // Only include profilePhoto if a new image was selected
      ...(profileImage && { profilePhoto: profileImage })
    };

    if (credentials && user?.userId) {
      dispatch(updateUser(credentials, user.userId, navigation));
    }
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { marginTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <View style={{ flex: 8 }}>
        <Header title={t("editProfile")} />
        <ScrollView
          contentContainerStyle={styles.containerC1}
          showsVerticalScrollIndicator={false}
        >
          {isUploading ? (
            <ActivityIndicator
              size="large"
              color={colors.Primary_01}
              style={{ marginTop: 20 }}
            />
          ) : (
            <TouchableOpacity
              onPress={selectImage}
              activeOpacity={0.8}
              style={{ alignItems: "center", marginTop: 20 }}
            >
              <Image
                source={
                  profileImage || user?.profilePhoto
                    ? { uri: profileImage || user.profilePhoto }
                    : Images.ProfilePlaceholder 
                }
                resizeMode="cover"
                style={{ height: 90, width: 90, borderRadius: 50 }}
              />

              <Edit
                style={{ position: "absolute", bottom: "10%", right: "38%" }}
              />
            </TouchableOpacity>
          )}

          <Formik
            initialValues={{
              agencyName: user?.agencyName,
              ownerName: user?.ownerName,
              email: user?.email,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.containerc1_c2}>
                <FormInput
                  label={t("agencyName")}
                  placeholder={t("agencyName")}
                  value={values.agencyName}
                  onChangeText={handleChange("agencyName")}
                  onBlur={() => handleBlur("agencyName")}
                  error={
                    touched.agencyName && errors.agencyName
                      ? String(errors.agencyName)
                      : undefined
                  }
                />
                <FormInput
                  label={t("ownerName")}
                  placeholder={t("ownerName")}
                  value={values.ownerName}
                  onChangeText={handleChange("ownerName")}
                  onBlur={() => handleBlur("ownerName")}
                  error={
                    touched.ownerName && errors.ownerName
                      ? String(errors.ownerName)
                      : undefined
                  }
                />
                <FormInput
                  label={t("emailAddress")}
                  placeholder={t("emailAddress")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={() => handleBlur("email")}
                  editable={false}
                  error={
                    touched.email && errors.email
                      ? String(errors.email)
                      : undefined
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={{ marginTop: 40 }}>
                  <CTAButton1 title={t("save")} submitHandler={handleSubmit} />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      marginHorizontal: "5%",
    },
    containerC1: {
      paddingBottom: 50,
    },
    containerc1_c2: {
      width: "100%",
      marginTop: 10,
    },
    label: {
      flexDirection: "row",
      top: 3,
      color: colors.DARK_GREEN,
      ...Typography.f_14_nunito_medium,
    },
  });
};

export default EditProfile;
