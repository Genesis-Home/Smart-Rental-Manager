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
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import ImageView from "react-native-image-viewing";
import { AddPhoto } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Images from "../../assets/images";
import { launchImageLibrary } from "react-native-image-picker";
import Header from "../../components/Header";
import { Cross } from "../../assets/icons";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";

interface AddPropertyProps {
  navigation: any;
}

const AddProperty: React.FC<AddPropertyProps> = () => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("title") + " " + t("isRequired")),
    description: Yup.string().required(t("desc") + " " + t("isRequired")),
    otherDetails: Yup.string().required(t("detail") + " " + t("isRequired")),
  });

  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const [galleryImages, setGalleryImages] = useState<any[]>([
    Images.GalleryImage1,
    Images.GalleryImage2,
    Images.GalleryImage3,
    Images.GalleryImage4,
    Images.GalleryImage5,
    Images.GalleryImage6,
    Images.GalleryImage6,
  ]);

  const openImageView = (index: number) => {
    setSelectedIndex(index);
    setIsVisible(true);
  };

  const handleImagePick = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1 },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("Image Picker Error:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const pickedImage = response.assets[0];
          setGalleryImages((prev) => [...prev, { uri: pickedImage.uri }]);
        }
      }
    );
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
            images={galleryImages.map((img) => ({
              uri: img.uri ? img.uri : Image.resolveAssetSource(img).uri,
            }))}
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
            onSubmit={(values) => {
              const formData = {
                ...values,
                images: galleryImages.map((img) =>
                  img.uri ? img.uri : Image.resolveAssetSource(img).uri
                ),
              };
              console.log("Form Data:", formData);
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

                <View style={{ gap: 8 }}>
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
