import React, { useState, useEffect, useRef } from "react";
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
import { colors } from "../../utilities/constants";
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
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { EnvConfig } from "../../config/envConfig";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Marker as MarkerIcon } from "../../assets/icons";
import axios from "axios";

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

const EditProperty: React.FC<EditPropertyProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const user = useAppSelector((state: any) => state.reducer.user);
  const property = useAppSelector((state: any) => state.reducer.property);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const placesRef = useRef<any>(null);
  const styles = createStyles(colors);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [id]);

  useEffect(() => {
    if (property) {
      setGalleryImages(property.images || []);
      if (property.location) {
        setMarker({
          latitude: property.location.lat,
          longitude: property.location.long,
        });
        setMapRegion({
          latitude: property.location.lat,
          longitude: property.location.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        if (placesRef.current && property.location.address) {
          placesRef.current.setAddressText(property.location.address);
        }
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

  const handleMapPress = async (
    event: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    try {
      const response = await axios.get(
        `${EnvConfig.googleMaps.geocodeUrl}?latlng=${latitude},${longitude}&key=${EnvConfig.googleMaps.apiKey}`
      );

      const formattedAddress =
        response.data.results[0]?.formatted_address || "";

      const location = {
        address: formattedAddress,
        lat: latitude,
        long: longitude,
      };

      setMarker({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setFieldValue("location", location);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
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
        <Header title={t("editProperty")} />
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
                <View style={styles.containerc1_c2}>
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
                        Typography.f_14_nunito_bold,
                      ]}
                    >
                      {t("location")}
                    </Text>
                    <GooglePlacesAutocomplete
                      ref={placesRef}
                      placeholder={t("location")}
                      onPress={(data, details) => {
                        if (details) {
                          const location = {
                            address: details.formatted_address || "",
                            lat: details.geometry?.location?.lat || 0,
                            long: details.geometry?.location?.lng || 0,
                          };
                          setFieldValue("location", location);
                          setMarker({
                            latitude: location.lat,
                            longitude: location.long,
                          });
                          setMapRegion({
                            latitude: location.lat,
                            longitude: location.long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                          });
                        }
                      }}
                      query={{
                        key: EnvConfig.googleMaps.apiKey,
                        language: "en",
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
                          marginTop: 0,
                          marginLeft: 0,
                          marginRight: 0,
                        },
                        textInputContainer: {
                          backgroundColor: colors.white,
                          borderTopWidth: 0,
                          borderBottomWidth: 0,
                        },
                        listView: {
                          backgroundColor: colors.white,
                          borderWidth: 0.3,
                          borderColor: colors.DARK_GRAY,
                          borderRadius: 8,
                          marginTop: 10,
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
                  </View>

                  <MapView
                    style={{ height: 200, width: "100%", marginTop: 10 }}
                    provider={PROVIDER_GOOGLE}
                    region={mapRegion}
                    onPress={(event) => handleMapPress(event, setFieldValue)}
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

                  <View style={{ marginTop: 40 }}>
                    <CTAButton1
                      title={t("save")}
                      submitHandler={handleSubmit}
                    />
                  </View>
                </View>
              )}
            </Formik>
          )}
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
      marginHorizontal: "5%",
    },
    containerC1: {
      paddingBottom: 50,
    },
    containerc1_c2: {
      width: "100%",
      marginTop: 10,
    },
    photoUploadSection: {
      marginTop: 20,
      paddingVertical: 15,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
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
      width: "30%",
      aspectRatio: 1,
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    locationContainer: {
      marginTop: 20,
    },
    locationLabel: {
      color: colors.DARK_GREEN,
      marginBottom: 10,
    },
  });

export default EditProperty;
