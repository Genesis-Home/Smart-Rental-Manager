import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors, DEFAULT_LANGUAGE } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import { Edit, Cross, AddPhoto } from "../../assets/icons";
import { EditPropertyProps } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import { updateProperty, fetchPropertyById } from "../../store/actions/action";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import {
  GooglePlacesAutocomplete,
  Language,
} from "react-native-google-places-autocomplete";
import { EnvConfig } from "../../config/envConfig";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Marker as MarkerIcon } from "../../assets/icons";
import Colors from "../../utilities/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImageView from "react-native-image-viewing";
import LocationPickerModal from "../../components/LocationPicker";
import axios from "axios";
import FormInput from "../../components/FormInput";

const validationSchema = Yup.object().shape({
  title: Yup.string().required(t("title") + " " + t("isRequired")),
  description: Yup.string().required(t("desc") + " " + t("isRequired")),
  otherDetails: Yup.string().required(t("otherDet") + " " + t("isRequired")),
  notes: Yup.string(),
  location: Yup.object().shape({
    address: Yup.string().required(t("location") + " " + t("isRequired")),
    lat: Yup.number().required(),
    long: Yup.number().required(),
  }),
});

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    containerC1: {
      paddingHorizontal: 15,
      paddingTop: 10,
      flexGrow: 1,
    },
    photoUploadSection: {
      paddingBottom: 10,
      marginTop: 10,
      backgroundColor: colors.lightGray,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    photoUploadLabel: {
      color: colors.black,
      ...Typography.f_16_nunito_medium,
    },
    photoUploadActionRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    photoTextLabel: {
      color: colors.black,
      marginLeft: 5,
      ...Typography.f_14_nunito_medium,
    },
    imageContainer: {
      position: "relative",
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    coverPhotoSection: {
      marginTop: 15,
    },
    coverPhotoContainer: {
      position: "relative",
      width: "100%",
      height: 200,
      borderRadius: 8,
      overflow: "hidden",
    },
    coverPhoto: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    gallerySection: {
      marginTop: 15,
    },
    removeButton: {
      position: "absolute",
      right: 10,
      top: 10,
      borderRadius: 15,
      padding: 5,
    },
    locationContainer: {
      marginVertical: 15,
    },
    locationLabel: {
      color: Colors.DARK_GREEN,
      ...Typography.f_16_nunito_medium,
    },
    clearButton: {
      position: "absolute",
      right: 5,
      backgroundColor: colors.white,
      top: 35,
      zIndex: 2,
    },
  });
};

const EditProperty: React.FC<EditPropertyProps> = ({
  navigation,
}): React.ReactElement | null => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const user = useAppSelector((state: any) => state.reducer.user);
  const property = useAppSelector((state: any) => state.reducer.property);
  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImagesBefore, setGalleryImagesBefore] = useState<string[]>([]);
  const [galleryImagesAfter, setGalleryImagesAfter] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [isCoverPhotoUploading, setIsCoverPhotoUploading] = useState(false);
  const [isGalleryBeforeUploading, setIsGalleryBeforeUploading] = useState(false);
  const [isGalleryAfterUploading, setIsGalleryAfterUploading] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewingWhich, setViewingWhich] = useState<"cover" | "before" | "after">("cover");
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState([
    property?.location?.lat || 0,
    property?.location?.long || 0
  ]);

  const lastLocationRef = useRef([property?.location?.lat || 0, property?.location?.long || 0]);

  const [editLocation, setEditLocation] = useState<any[]>([]);



  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    address: string;
    lat: number;
    long: number;
  } | null>(null);

  const placesRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const setFieldValueRef = useRef<any>(null); // Add this ref
  const styles = createStyles(colors);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [id]);
  useEffect(() => {

    if (property && property.location) {
      const { lat, long, address } = property.location;
      setInputText(address || "");
      setMarker({ latitude: lat, longitude: long });
      setMapRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setCurrentLocation({ address, lat, long });
      if (placesRef.current) {
        placesRef.current.setAddressText(address);
      }
      if (property.images && property.images.length > 0) {
        setCoverPhoto(property.images[0]);
      }
      // Prefer dedicated fields if available; fallback to legacy images array
      if (property.imagesBefore && property.imagesBefore.length > 0) {
        setGalleryImagesBefore(property.imagesBefore);
      } else if (property.images && property.images.length > 1) {
        setGalleryImagesBefore(property.images.slice(1));
      }
      if (property.imagesAfter && property.imagesAfter.length > 0) {
        setGalleryImagesAfter(property.imagesAfter);
      } else {
        setGalleryImagesAfter([]);
      }
      setEditLocation([lat, long])
    }
  }, [property]);








  const handleCoverPhotoPick = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
        includeBase64: true,
        selectionLimit: 1,
      },
      async (response) => {
        if (response.assets && response.assets.length > 0) {
          setIsCoverPhotoUploading(true);
          const asset = response.assets[0];
          if (asset.uri) {
            try {
              const fileName = asset.uri.substring(
                asset.uri.lastIndexOf("/") + 1
              );
              const reference = storage().ref(fileName);
              await reference.putFile(asset.uri);
              const url = await reference.getDownloadURL();
              setCoverPhoto(url);
            } catch (error) {
              console.error("Cover photo upload error:", error);
              const errorMessage = await getFirebaseErrorMessage(
                "Failed to upload cover photo. Please try again."
              );
              Toast.show({
                type: "error",
                text1: errorMessage,
                position: "bottom",
              });
            } finally {
              setIsCoverPhotoUploading(false);
            }
          }
        }
      }
    );
  };

  const handleGalleryImagesPick = (which: "before" | "after") => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
        includeBase64: true,
        selectionLimit: 0,
      },
      async (response) => {
        if (response.assets && response.assets.length > 0) {
          which === "before" ? setIsGalleryBeforeUploading(true) : setIsGalleryAfterUploading(true);
          const uploadPromises = response.assets.map(async (asset) => {
            if (asset.uri) {
              const fileName = asset.uri.substring(
                asset.uri.lastIndexOf("/") + 1
              );
              const reference = storage().ref(fileName);
              await reference.putFile(asset.uri);
              return await reference.getDownloadURL();
            }
            return null;
          });

          try {
            const urls = await Promise.all(uploadPromises);
            const validUrls = urls.filter((url): url is string => url !== null);
            if (which === "before") {
              setGalleryImagesBefore((prev) => [...prev, ...validUrls]);
            } else {
              setGalleryImagesAfter((prev) => [...prev, ...validUrls]);
            }
          } catch (error) {
            console.error("Gallery images upload error:", error);
            const errorMessage = await getFirebaseErrorMessage(
              "Failed to upload gallery images. Please try again."
            );
            Toast.show({
              type: "error",
              text1: errorMessage,
              position: "bottom",
            });
          } finally {
            which === "before" ? setIsGalleryBeforeUploading(false) : setIsGalleryAfterUploading(false);
          }
        }
      }
    );
  };

  const handleRemoveImage = (index: number, which: "before" | "after") => {
    if (which === "before") {
      setGalleryImagesBefore((prev) => prev.filter((_, i) => i !== index));
    } else {
      setGalleryImagesAfter((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };

  const openImageView = (index: number, which: "cover" | "before" | "after" = "cover") => {
    setSelectedIndex(index);
    setIsVisible(true);
    setViewingWhich(which);
  };

  const renderImages = () => {
    return (
      <FlatList
        data={galleryImagesBefore}
        numColumns={3}
        columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => openImageView(index, "before")}
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
              onPress={() => handleRemoveImage(index, "before")}
            >
              <Cross />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    );
  };

  const updateMapLocation = useCallback((lat: number, long: number) => {
    const newRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setMapRegion(newRegion);
    setMarker({ latitude: lat, longitude: long });
    setMapKey((prev) => prev + 1);
  }, []);

  const handleRecenter = useCallback(() => {
    if (currentLocation) {
      updateMapLocation(currentLocation.lat, currentLocation.long);
    }
  }, [currentLocation, updateMapLocation]);

  const handleClearInput = () => {
    setInputText("");
    placesRef.current?.setAddressText("");
    setMarker(null);
    setCurrentLocation(null);
    setMapRegion({
      latitude: 30.4419,
      longitude: -84.2985,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View
        style={[
          styles.mainContainer,
          { marginTop: Platform.OS === "ios" ? 50 : 0 },
        ]}
      >
        <View style={{ flex: 8 }}>
          <View style={{ marginHorizontal: "5%" }}>
            <Header title={t("editProperty")} />
          </View>
          <ScrollView
            contentContainerStyle={styles.containerC1}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCoverPhotoPick}
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
                <Edit />
                <Text
                  style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
                >
                  {t("coverPhoto")}
                </Text>
              </View>
            </TouchableOpacity>

            {isCoverPhotoUploading ? (
              <ActivityIndicator
                size="large"
                color={colors.Primary_01}
                style={{ marginTop: 20 }}
              />
            ) : (
              coverPhoto && (
                <View style={styles.coverPhotoSection}>
                  <Text
                    style={[
                      Typography.f_16_nunito_medium,
                      { color: colors.black, marginBottom: 10 },
                    ]}
                  >
                    {t("coverPhoto")}
                  </Text>
                  {coverPhoto && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => openImageView(0, "cover")}
                      style={styles.coverPhotoContainer}
                    >
                      <Image
                        style={styles.coverPhoto}
                        source={{ uri: coverPhoto }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.removeButton}
                        onPress={handleRemoveCoverPhoto}
                      >
                        <Cross />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                </View>
              )
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleGalleryImagesPick("before")}
              style={[styles.photoUploadSection, { marginTop: 15 }]}
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
                <Edit />
                <Text
                  style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
                >
                  {t("galleryImagesBefore")}
                </Text>
              </View>
            </TouchableOpacity>

            {isGalleryBeforeUploading ? (
              <ActivityIndicator
                size="large"
                color={colors.Primary_01}
                style={{ marginTop: 20 }}
              />
            ) : (
              galleryImagesBefore.length > 0 && (
                <View style={styles.gallerySection}>
                  <Text
                    style={[
                      Typography.f_16_nunito_medium,
                      { color: colors.black, marginBottom: 10 },
                    ]}
                  >
                    {t("galleryImagesBefore")}
                  </Text>
                  {renderImages()}
                </View>
              )
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleGalleryImagesPick("after")}
              style={[styles.photoUploadSection, { marginTop: 15 }]}
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
                <Edit />
                <Text
                  style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
                >
                  {t("galleryImagesAfter")}
                </Text>
              </View>
            </TouchableOpacity>

            {isGalleryAfterUploading ? (
              <ActivityIndicator
                size="large"
                color={colors.Primary_01}
                style={{ marginTop: 20 }}
              />
            ) : (
              galleryImagesAfter.length > 0 && (
                <View style={styles.gallerySection}>
                  <Text
                    style={[
                      Typography.f_16_nunito_medium,
                      { color: colors.black, marginBottom: 10 },
                    ]}
                  >
                    {t("galleryImagesAfter")}
                  </Text>
                  <FlatList
                    data={galleryImagesAfter}
                    numColumns={3}
                    columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => openImageView(index, "after")}
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
                          onPress={() => handleRemoveImage(index, "after")}
                        >
                          <Cross />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )
            )}
            <ImageView
              images={
                viewingWhich === "cover" && coverPhoto
                  ? [{ uri: coverPhoto }]
                  : viewingWhich === "before"
                    ? galleryImagesBefore.map((url) => ({ uri: url }))
                    : galleryImagesAfter.map((url) => ({ uri: url }))
              }
              imageIndex={selectedIndex}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
            {property && (
              <Formik
                initialValues={{
                  title: property.title || "",
                  description: property.description || "",
                  otherDetails: property.otherDetails || "",
                  notes: property.notes || "",
                  location: property.location || { address: "", lat: 0, long: 0 },
                  createdBy: property.createdBy,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  try {
                    // ✅ Check if all required image sets are present
                    if (!coverPhoto) {
                      Toast.show({
                        type: "error",
                        text1: "Please upload a cover photo before submitting.",
                        position: "bottom",
                      });
                      return;
                    }

                    if (!galleryImagesBefore || galleryImagesBefore.length === 0) {
                      Toast.show({
                        type: "error",
                        text1: "Please upload images before booking.",
                        position: "bottom",
                      });
                      return;
                    }

                    if (!galleryImagesAfter || galleryImagesAfter.length === 0) {
                      Toast.show({
                        type: "error",
                        text1: "Please upload images after booking.",
                        position: "bottom",
                      });
                      return;
                    }
                    const allImages = coverPhoto
                      ? [coverPhoto, ...galleryImagesBefore, ...galleryImagesAfter]
                      : [...galleryImagesBefore, ...galleryImagesAfter];

                    const formData = {
                      ...values,
                      images: allImages,
                      imagesBefore: galleryImagesBefore,
                      imagesAfter: galleryImagesAfter,
                    };

                    if (user?.userId) {
                      dispatch(updateProperty(id, formData, navigation));
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
                      "Failed to update property. Please try again."
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
                }) => {
                  // Store the setFieldValue function in the ref
                  setFieldValueRef.current = setFieldValue;

                  return (
                    <>
                      <FormInput
                        label={t("title")}
                        placeholder={t("title")}
                        value={values.title}
                        onChangeText={handleChange("title")}
                        onBlur={handleBlur("title")}
                        error={
                          touched.title && errors.title
                            ? String(errors.title)
                            : undefined
                        }
                      />

                      <FormInput
                        label={t("description")}
                        placeholder={t("description")}
                        value={values.description}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        error={
                          touched.description && errors.description
                            ? String(errors.description)
                            : undefined
                        }
                        multiline
                        numberOfLines={4}
                      />

                      <FormInput
                        label={t("otherDet")}
                        placeholder={t("otherDet")}
                        value={values.otherDetails}
                        onChangeText={handleChange("otherDetails")}
                        onBlur={handleBlur("otherDetails")}
                        error={
                          touched.otherDetails && errors.otherDetails
                            ? String(errors.otherDetails)
                            : undefined
                        }
                        multiline
                        numberOfLines={4}
                      />
                      <FormInput
                        label={t("notes")}
                        placeholder={t("notes")}
                        value={(values as any).notes}
                        onChangeText={handleChange("notes")}
                        onBlur={handleBlur("notes")}
                        multiline
                        numberOfLines={4}
                      />
                      <View style={styles.locationContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text
                            style={[
                              styles.locationLabel,
                              Typography.f_14_nunito_semi_bold,
                            ]}
                          >
                            {t("location")}
                          </Text>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setModalVisible(true)}

                          >

                            <View style={styles.photoUploadActionRow}>
                              <AddPhoto />
                              <Text
                                style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
                              >
                                {t("changeLocation")}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View>
                          <MapView
                            key={mapKey}
                            ref={mapRef}
                            style={{ height: 200, width: "100%", marginTop: 10 }}
                            provider={PROVIDER_GOOGLE}
                            region={mapRegion}
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
                      </View>

                      <View style={{ marginVertical: 40 }}>
                        <CTAButton1
                          title={t("save")}
                          submitHandler={handleSubmit}
                        />
                      </View>
                    </>
                  );
                }}
              </Formik>
            )}
          </ScrollView>

          <LocationPickerModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
            }}
            onLocationSelected={async (loc: any) => {
              const location = [loc.lat, loc.lng];
              setLastLocation(location);
              updateMapLocation(location[0], location[1]);

              const response = await axios.get(
                `${EnvConfig.googleMaps.geocodeUrl}?latlng=${location[0]},${location[1]}&key=${EnvConfig.googleMaps.apiKey}`
              );

              if (response.data.status === "OK") {
                const formattedAddress = response.data.results[0]?.formatted_address || "";

                setInputText(formattedAddress || "");
                setCurrentLocation({
                  address: formattedAddress,
                  lat: location[0],
                  long: location[1]
                });

                if (setFieldValueRef.current) {
                  setFieldValueRef.current("location", {
                    address: formattedAddress,
                    lat: location[0],
                    long: location[1],
                  });


                }
              }

              setMarker({ latitude: location[0], longitude: location[1] });
            }}
            apiKey={EnvConfig.googleMaps.apiKey}
            isEditMode={true}
            lastLocation={lastLocation}
            editRecenterLocation={editLocation}

          />

        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProperty;