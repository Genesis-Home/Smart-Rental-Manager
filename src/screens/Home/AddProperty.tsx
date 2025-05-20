import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { Formik } from "formik";
import * as Yup from "yup";
import ImageView from "react-native-image-viewing";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  launchImageLibrary,
  ImagePickerResponse,
} from "react-native-image-picker";
import Toast from "react-native-toast-message";
import storage from "@react-native-firebase/storage";
import Header from "../../components/Header";
import CTAButton1 from "../../components/CTA_BUTTON1";
import FormInput from "../../components/FormInput";
import { AddPhoto, Cross, Marker as MarkerIcon } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { colors, DEFAULT_LANGUAGE } from "../../utilities/constants";
import { addProperty } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import {
  Event,
  AddressComponent,
  MarkerProps,
  AddPropertyProps,
  GooglePlaceData,
  GooglePlaceDetail,
  Location as LocationProp,
} from "../../types/types";
import Colors from "../../utilities/constants/colors";
import { Language } from "react-native-google-places-autocomplete";

const AddProperty: React.FC<AddPropertyProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.reducer.user);
  const styles = createStyles(colors);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [marker, setMarker] = useState<MarkerProps | null>({
    latitude: 30.4419,
    longitude: -84.2985,
  });
  const placesRef = useRef<any>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("title") + " " + t("isRequired")),
    description: Yup.string().required(t("desc") + " " + t("isRequired")),
    otherDetails: Yup.string().required(t("detail") + " " + t("isRequired")),
    location: Yup.string().required(t("location") + " " + t("isRequired")),
  });

  const handleImagePick = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 5,
        includeBase64: false,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
          return;
        }
        if (response.errorCode) {
          console.error("Image picker error:", response.errorMessage);
          const errorMessage = await getFirebaseErrorMessage(
            "Failed to select images"
          );
          Toast.show({
            type: "error",
            text1: errorMessage,
            position: "bottom",
          });
          return;
        }
        if (response.assets?.length) {
          console.log("Selected images:", response.assets);
          setIsUploading(true);
          const uploadedImages = await Promise.all(
            response.assets.map(async (img) => {
              const fileName = img.fileName || `image_${Date.now()}.jpg`;
              const uri = img.uri;

              if (!uri) {
                console.error("No URI found for image:", img);
                return null;
              }

              const reference = storage().ref(fileName);
              const task = reference.putFile(uri);

              try {
                await task;
                const downloadUrl = await reference.getDownloadURL();
                return downloadUrl;
              } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                Toast.show({
                  type: "error",
                  text1: "Image upload failed",
                  position: "bottom",
                });
                return null;
              }
            })
          );

          const validImages = uploadedImages.filter((image) => image !== null);
          setGalleryImages((prev) => [...prev, ...validImages]);
          setIsUploading(false);
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
            <Image
              style={styles.image}
              source={{ uri: item }}
              resizeMode="cover"
            />
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

  const clearInput = () => {
    setInputValue("");
    placesRef.current?.setAddressText("");
    setMarker(null);
  };

  const updateMapAndMarker = (lat: any, long: any) => {
    setMapRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarker({
      latitude: lat,
      longitude: long,
    });
  };

  const handleMapPress = async (event: Event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    clearInput();

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM`
      );

      const addressComponents =
        response.data.results[0]?.address_components || [];
      const formattedAddress =
        response.data.results[0]?.formatted_address || "";

      const location: LocationProp = {
        address: formattedAddress,
        lat: latitude,
        long: longitude,
      };

      updateMapAndMarker(location.lat, location.long);
      setInputValue(formattedAddress);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const onPlaceSelected = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!details) {
      console.error("Place details are undefined");
      return;
    }

    const location = {
      address: details.formatted_address || "",
      lat: details.geometry?.location?.lat || 0,
      long: details.geometry?.location?.lng || 0,
    };

    setFieldValue("location", location.address);
    updateMapAndMarker(location.lat, location.long);
    setInputValue(details.formatted_address);
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
          {isUploading ? (
            <ActivityIndicator
              size="large"
              color={colors.Primary_01}
              style={{ marginTop: 20 }}
            />
          ) : (
            renderImages()
          )}
          <ImageView
            images={galleryImages.map((url) => ({ uri: url }))}
            imageIndex={selectedIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
          <Formik
            initialValues={{
              title: "",
              description: "",
              otherDetails: "",
              images: [],
              location: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                const formData = {
                  ...values,
                  images: galleryImages,
                };

                if (user?.userId) {
                  dispatch(addProperty(formData, user.userId, navigation));
                  resetForm();
                  setGalleryImages([]);
                } else {
                  const errorMessage = await getFirebaseErrorMessage(
                    "User not authenticated"
                  );
                  Toast.show({
                    type: "error",
                    text1: errorMessage,
                  });
                  navigation.navigate("Signin");
                }
              } catch (error) {
                console.error("Form submission error:", error);
                const errorMessage = await getFirebaseErrorMessage(
                  "Failed to upload images. Please try again."
                );
                Toast.show({
                  type: "error",
                  text1: errorMessage,
                  position: "bottom",
                });
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
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
                <View style={{ gap: 8, marginTop: 10 }}>
                  <Text
                    style={[
                      Typography.f_16_nunito_medium,
                      { color: colors.black, paddingLeft: 3 },
                    ]}
                  >
                    {t("location")}
                  </Text>
                  <View style={styles.autocompleteContainer}>
                    <GooglePlacesAutocomplete
                      ref={placesRef}
                      placeholder={t("location")}
                      query={{
                        key: "AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM",
                        language: DEFAULT_LANGUAGE as Language,
                      }}
                      fetchDetails={true}
                      minLength={2}
                      onPress={(data, details) =>
                        onPlaceSelected(data, details, setFieldValue)
                      }
                      enablePoweredByContainer={false}
                      textInputProps={{
                        value: inputValue,
                        onChangeText: setInputValue,
                      }}
                      styles={{
                        textInput: {
                          ...Typography.f_12_nunito_medium,
                          color: Colors.black,
                          paddingHorizontal: 14,
                          borderWidth: 0.3,
                          borderColor: Colors.DARK_GRAY,
                          borderRadius: 8,
                          backgroundColor: Colors.white,
                          height: 40,
                          marginTop: 0,
                          marginLeft: 0,
                          marginRight: 0,
                        },
                        textInputContainer: {
                          backgroundColor: Colors.white,
                          borderTopWidth: 0,
                          borderBottomWidth: 0,
                        },
                        listView: {
                          backgroundColor: Colors.white,
                          borderWidth: 0.3,
                          borderColor: Colors.DARK_GRAY,
                          borderRadius: 8,
                          marginTop: 10,
                        },
                        description: {
                          ...Typography.f_14_nunito_medium,
                          color: "black",
                        },
                        separator: {
                          height: 0.5,
                          backgroundColor: Colors.DARK_GRAY,
                        },
                      }}
                    />
                    {inputValue ? (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearInput}
                      >
                        <Icon name="close" size={20} color={Colors.DARK_GRAY} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <MapView
                    style={{ height: 200, width: "100%" }}
                    provider={PROVIDER_GOOGLE}
                    region={mapRegion}
                    onPress={handleMapPress}
                  >
                    {marker && (
                      <Marker
                        coordinate={{
                          latitude: marker.latitude,
                          longitude: marker.longitude,
                        }}
                      >
                        <MarkerIcon />
                      </Marker>
                    )}
                  </MapView>
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
      color: colors.DARK_GREEN,
    },
    photoUploadActionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    photoTextLabel: {
      color: colors.DARK_GREEN,
    },
    imageContainer: {
      width: 100,
      height: 100,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    overlay: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 8,
      padding: 5,
    },
    overlayText: {
      color: Colors.white,
      ...Typography.f_16_nunito_bold,
    },
    submitButtonContainer: {
      marginTop: 20,
    },
    autocompleteContainer: {
      position: "relative",
      zIndex: 1000,
    },
    clearButton: {
      position: "absolute",
      right: 10,
      backgroundColor: Colors.white,
      top: 10,
    },
  });

export default AddProperty;
