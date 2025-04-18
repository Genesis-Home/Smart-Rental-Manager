import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import ImageView from "react-native-image-viewing";
import { AddPhoto, BackIcon } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Images from "../../assets/images";
import { launchImageLibrary } from "react-native-image-picker";

interface AddPropertyProps {
  navigation: any;
}

const AddProperty: React.FC<AddPropertyProps> = ({ navigation }) => {
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

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

  const handleSubmit = () => {
    const formData = {
      title,
      description,
      otherDetails,
      images: galleryImages.map((img) =>
        img.uri ? img.uri : Image.resolveAssetSource(img).uri
      ),
    };

    console.log("Form Data:", formData);
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
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={[styles.headerText, Typography.f_17_nunito_bold]}>
              {t("addProperty")}
            </Text>
            <Text />
          </View>
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
          <View style={styles.textInputSection}>
            <TextInput
              placeholder={t("addTitle")}
              placeholderTextColor={Colors.PLACE_HOLDER}
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder={t("addDes")}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor={Colors.PLACE_HOLDER}
              style={styles.textInputMultiline}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              placeholder={t("otherDet")}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor={Colors.PLACE_HOLDER}
              style={styles.textInputMultiline}
              value={otherDetails}
              onChangeText={setOtherDetails}
            />
          </View>
          <View style={styles.submitButtonContainer}>
            <CTAButton1 title={t("submit")} submitHandler={handleSubmit} />
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
      marginHorizontal: "6%",
      paddingBottom: 50,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 40,
      marginBottom: 10,
    },
    headerText: {
      color: Colors.DARK_GREEN,
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
    submitButtonContainer: {
      marginTop: 10,
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
