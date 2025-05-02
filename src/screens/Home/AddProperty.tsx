import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { Formik } from "formik";
import * as Yup from "yup";
import ImageView from "react-native-image-viewing";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import storage from "@react-native-firebase/storage";

// UI components
import Header from "../../components/Header";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import { AddPhoto, Cross } from "../../assets/icons";
import Images from "../../assets/images";
import Colors from "../../utilities/constants/colors";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";

// Redux action
import { addProperty } from "../../store/actions/action";

const AddProperty: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.reducer.user);

  console.log(user, "USER");

  const styles = createStyles(colors);

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("title") + " " + t("isRequired")),
    description: Yup.string().required(t("desc") + " " + t("isRequired")),
    otherDetails: Yup.string().required(t("detail") + " " + t("isRequired")),
  });

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 5,
        includeBase64: false,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
          return;
        }
        if (response.errorCode) {
          console.error("Image picker error:", response.errorMessage);
          Toast.show({
            type: "error",
            text1: "Failed to select images",
            position: "bottom",
          });
          return;
        }
        if (response.assets?.length) {
          console.log("Selected images:", response.assets);
          const newImages = response.assets.map((img) => ({
            uri: img.uri,
            type: img.type || "image/jpeg",
            name: img.fileName || `image_${Date.now()}.jpg`,
          }));
          setGalleryImages((prev) => [...prev, ...newImages]);
        }
      }
    );
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const openImageView = (index: number) => {
    setSelectedIndex(index);
    setIsVisible(true);
  };

  const renderImages = () => {
    const maxVisibleImages = 6;
    const visibleImages = galleryImages.slice(0, maxVisibleImages);
    const remainingCount = galleryImages.length - maxVisibleImages;

    return (
      <FlatList
        data={visibleImages}
        numColumns={3}
        columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => openImageView(index)}
            style={styles.imageContainer}
          >
            <Image style={styles.image} source={item} resizeMode="cover" />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ position: "absolute", right: 0, padding: 10 }}
              onPress={() => handleRemoveImage(index)}
            >
              <Cross />
            </TouchableOpacity>
            {index === maxVisibleImages - 1 && remainingCount > 0 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{`+${remainingCount}`}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    );
  };

  const uploadImages = async (images: any[]) => {
    try {
      const uploadedURLs = await Promise.all(
        images.map(async (img, index) => {
          const imageUri = img.uri;
          const filename = `properties/${
            user.userId
          }_${Date.now()}_${index}.jpg`;
          const reference = storage().ref(filename);

          await reference.putFile(imageUri);
          const downloadURL = await reference.getDownloadURL();
          return downloadURL;
        })
      );
      return uploadedURLs;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  return (
    <View style={[styles.mainContainer, styles.platformMarginTop]}>
      <View style={styles.contentContainer}>
        <Header title={t("addProperty")} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleImagePick}
            style={styles.photoUploadSection}
          >
            <Text
              style={[
                styles.photoUploadLabel,
                Typography.f_14_nunito_extra_bold,
              ]}
            >
              {t("PhotoUpload")}
            </Text>
            <View style={styles.photoUploadActionRow}>
              <AddPhoto />
              <Text
                style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
              >
                {t("photo")}
              </Text>
            </View>
          </TouchableOpacity>

          {renderImages()}

          <ImageView
            images={galleryImages.map((img) => ({ uri: img.uri }))}
            imageIndex={selectedIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />

          <Formik
            initialValues={{
              title: "",
              description: "",
              otherDetails: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                if (galleryImages.length === 0) {
                  Toast.show({
                    type: "error",
                    text1: "Please select at least one image",
                    position: "bottom",
                  });
                  return;
                }

                dispatch({ type: "IS_LOADER", payload: true });

                // Upload images first
                const imageURLs = await uploadImages(galleryImages);

                const formData = {
                  ...values,
                  images: imageURLs,
                };

                if (user?.userId) {
                  dispatch(addProperty(formData, user.userId));
                  resetForm();
                  setGalleryImages([]);
                } else {
                  Toast.show({
                    type: "error",
                    text1: "User not authenticated",
                  });
                }
              } catch (error) {
                console.error("Form submission error:", error);
                Toast.show({
                  type: "error",
                  text1: "Failed to upload images. Please try again.",
                  position: "bottom",
                });
              } finally {
                dispatch({ type: "IS_LOADER", payload: false });
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <FormInput
                  label={t("addTitle")}
                  placeholder={`${t("addTitle")}...`}
                  value={values.title}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  error={touched.title && errors.title}
                />
                <FormInput
                  label={t("addDes")}
                  placeholder={`${t("addDes")}...`}
                  value={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  error={touched.description && errors.description}
                  multiline
                />
                <FormInput
                  label={t("otherDet")}
                  placeholder={t("otherDet")}
                  value={values.otherDetails}
                  onChangeText={handleChange("otherDetails")}
                  onBlur={handleBlur("otherDetails")}
                  error={touched.otherDetails && errors.otherDetails}
                  multiline
                />

                <View style={{ gap: 8, marginTop: 15 }}>
                  <Text
                    style={[
                      Typography.f_16_nunito_medium,
                      { color: Colors.black, paddingLeft: 3 },
                    ]}
                  >
                    {t("location")}
                  </Text>
                  <Image
                    source={Images.map}
                    style={{ width: "100%", height: 130 }}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.submitButtonContainer}>
                  <CTAButton1
                    title={t("submit")}
                    submitHandler={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>
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
      marginHorizontal: "5%",
    },
    contentContainer: {
      flex: 8,
    },
    scrollContainer: {
      paddingBottom: 50,
    },
    photoUploadSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    photoUploadLabel: {
      color: Colors.DARK_GREEN,
    },
    photoUploadActionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    photoTextLabel: {
      color: Colors.Primary_01,
    },
    submitButtonContainer: {
      marginTop: 20,
    },
    imageContainer: {
      width: "32%",
      aspectRatio: 1,
      marginBottom: 8,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors.Primary_01,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.Primary_01,
    },
    overlayText: {
      color: colors.white,
      ...Typography.f_16_nunito_medium,
    },
  });

export default AddProperty;
