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
} from "react-native";
import { t } from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors, DEFAULT_LANGUAGE } from "../../utilities/constants";
import { Typography } from "../../utilities/constants/constant.style";
import CTAButton1 from "../../components/CTA_BUTTON1";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import { Edit, Cross } from "../../assets/icons";
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
import axios from "axios";
import Colors from "../../utilities/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const validationSchema = Yup.object().shape({
  title: Yup.string().required(t("title") + " " + t("isRequired")),
  description: Yup.string().required(t("desc") + " " + t("isRequired")),
  otherDetails: Yup.string().required(t("otherDet") + " " + t("isRequired")),
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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
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
        setGalleryImages(property.images);
      }
    }
  }, [property]);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
        includeBase64: true,
        selectionLimit: 0,
      },
      async (response) => {
        if (response.assets && response.assets.length > 0) {
          setIsUploading(true);
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
            setGalleryImages((prev) => [...prev, ...validUrls]);
          } catch (error) {
            console.error("Image upload error:", error);
            const errorMessage = await getFirebaseErrorMessage(
              "Failed to upload images. Please try again."
            );
            Toast.show({
              type: "error",
              text1: errorMessage,
              position: "bottom",
            });
          } finally {
            setIsUploading(false);
          }
        }
      }
    );
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const renderImages = () => {
    return (
      <FlatList
        data={galleryImages}
        numColumns={3}
        columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
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
              <Edit />
              <Text
                style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
              >
                {t("editPhotos")}
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
          {property && (
            <Formik
              initialValues={{
                title: property.title || "",
                description: property.description || "",
                otherDetails: property.otherDetails || "",
                location: property.location || { address: "", lat: 0, long: 0 },
                createdBy: property.createdBy,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const formData = {
                    ...values,
                    images: galleryImages,
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
              }) => (
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
                  <View style={styles.locationContainer}>
                    <Text
                      style={[
                        styles.locationLabel,
                        Typography.f_14_nunito_semi_bold,
                      ]}
                    >
                      {t("location")}
                    </Text>
                      <GooglePlacesAutocomplete
                      ref={placesRef}
                      placeholder={t("location")}
                      fetchDetails={true}
                      enablePoweredByContainer={false}
                      textInputProps={{
                        value: inputText,
                        onChangeText: setInputText,
                      }}
                      minLength={2}
                      onPress={(data, details) => {
                        if (details?.geometry?.location) {
                          const location = {
                            address: details.formatted_address || "",
                            lat: details.geometry.location.lat,
                            long: details.geometry.location.lng,
                          };

                          setInputText(details.formatted_address || "");
                          setFieldValue("location", location);
                          setCurrentLocation(location);
                          updateMapLocation(location.lat, location.long);
                        }
                      }}
                      query={{
                        key: EnvConfig.googleMaps.apiKey,
                        language: DEFAULT_LANGUAGE as Language,
                      }}
                      styles={{
                        textInput: {
                          ...Typography.f_12_nunito_medium,
                          color: colors.black,
                          paddingHorizontal: 14,
                          borderWidth: 0.3,
                          borderColor: colors.DARK_GRAY,
                          borderRadius: 8,
                          backgroundColor: colors.white,
                          height: 40,
                          marginLeft: 0,
                          marginRight: 0,
                        },
                        textInputContainer: {
                          backgroundColor: colors.white,
                          borderTopWidth: 0,
                          borderBottomWidth: 0,
                          zIndex: 1,
                        },
                        listView: {
                          backgroundColor: colors.white,
                          borderWidth: 0.3,
                          borderColor: colors.DARK_GRAY,
                          borderRadius: 8,
                          marginTop: 10,
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          elevation: 3,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                        },
                        row: {
                          backgroundColor: colors.white,
                          padding: 13,
                          height: "auto",
                          minHeight: 44,
                        },
                        description: {
                          ...Typography.f_14_nunito_medium,
                          color: "black",
                        },
                        separator: {
                          height: 0.5,
                          backgroundColor: colors.DARK_GRAY,
                        },
                      }}
                    />
                    {inputText ? (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearInput}
                      >
                        <Icon name="close" size={18} color={Colors.DARK_GRAY} />
                      </TouchableOpacity>
                    ) : null}
                    <View >
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
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleRecenter}
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 10,
                          backgroundColor: Colors.white,
                          padding: 12,
                          borderRadius: 30,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          zIndex: 1000,
                        }}
                      >
                        <MaterialIcons
                          name="my-location"
                          size={24}
                          color={Colors.Error_Red}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginVertical: 40 }}>
                    <CTAButton1
                      title={t("save")}
                      submitHandler={handleSubmit}
                    />
                  </View>
                </>
              )}
            </Formik>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default EditProperty;
