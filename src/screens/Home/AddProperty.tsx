import React, { useState, useRef, useEffect } from "react";
import { AppState, AppStateStatus } from 'react-native';
import { CommonActions } from "@react-navigation/native";


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
  PermissionsAndroid,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { Formik } from "formik";
import * as Yup from "yup";
import ImageView from "react-native-image-viewing";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/MaterialIcons";
import { EnvConfig } from "../../config/envConfig";
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
import { addProperty, isLocationSet } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import {
  Event,
  MarkerProps,
  AddPropertyProps,
  GooglePlaceData,
  GooglePlaceDetail,
  Location as LocationProp,
} from "../../types/types";
import Colors from "../../utilities/constants/colors";
import { Language } from "react-native-google-places-autocomplete";
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { checkLocationPermission } from "../../services/locationServiceCheck";

const AddProperty: React.FC<AddPropertyProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.reducer.user);
  const currentLocation = useSelector((state: any) => state.reducer.savedCords);
  const styles = createStyles(colors);
  const [isUploading, setIsUploading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isCoverPhotoUploading, setIsCoverPhotoUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const isLocation = useSelector((state: any) => state.reducer.isLocation);
  const [isLocationErr, setisLocationErr] = useState(false);
  

  const [initialLocation, setInitialLocation] = useState<{
    address: string;
    lat: number;
    long: number;
  } | null>(null);
  const [lastSelectedLocation, setLastSelectedLocation] = useState<{
    address: string;
    lat: number;
    long: number;
  } | null>(null);
  const [isInitialLocationSet, setIsInitialLocationSet] = useState(false);
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
  const mapRef = useRef<MapView>(null);
  const [viewingCoverPhoto, setViewingCoverPhoto] = useState(false);

  useEffect(() => {
    setisLocationErr(isLocation);
  }, [isLocation]);
  useEffect(() => {
    gpsenable()

  }, []);
  console.log(currentLocation , 'current location')

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        try {
          // await checkLocationPermission();
           navigation.dispatch(
                  CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] })
                );
        } catch (error) {
          console.log('Location fetch failed:', error);
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);




  const gpsenable = async () => {
    try {
      const position: any = await checkLocationPermission();
      const { latitude, longitude } = position.coords;
      const loc = [latitude, longitude];
      console.log(loc, "Location");

      dispatch(isLocationSet(true, loc));


      setMarker({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setInitialLocation(loc as any);
      setLastSelectedLocation(loc as any);




      const response = await axios.get(
        `${EnvConfig.googleMaps.geocodeUrl}?latlng=${latitude},${longitude}&key=${EnvConfig.googleMaps.apiKey}`
      );


      console.log(response.data, "response.data");

      if (response.data.status === "OK") {
        setIsLocationLoading(false);
        const formattedAddress = response.data.results[0]?.formatted_address || "";
        const location = {
          address: formattedAddress,
          lat: latitude,
          long: longitude,
        };

        console.log(location, "location");
        setInitialLocation(location);
        setLastSelectedLocation(location);
        setInputValue(formattedAddress);
        if (placesRef.current) {
          placesRef.current.setAddressText(formattedAddress);
        }
        setIsInitialLocationSet(true);
      }
    } catch (error) {
      console.error("Error in GPS enabling or reverse geocoding:", error);
      setIsLocationLoading(false);
      dispatch(isLocationSet(false, []));
    }
  };



  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("title") + " " + t("isRequired")),
    description: Yup.string().required(t("desc") + " " + t("isRequired")),
    otherDetails: Yup.string().required(t("detail") + " " + t("isRequired")),
    location: Yup.object().shape({
      address: Yup.string().required(t("location") + " " + t("isRequired")),
      lat: Yup.number().required(),
      long: Yup.number().required(),
    }),
  });

  const handleCoverPhotoPick = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
        includeBase64: false,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log("User cancelled cover photo picker");
          return;
        }
        if (response.errorCode) {
          console.error("Cover photo picker error:", response.errorMessage);
          const errorMessage = await getFirebaseErrorMessage(
            "Failed to select cover photo"
          );
          Toast.show({
            type: "error",
            text1: errorMessage,
            position: "bottom",
          });
          return;
        }
        if (response.assets?.length) {
          console.log("Selected cover photo:", response.assets[0]);
          setIsCoverPhotoUploading(true);
          const img = response.assets[0];
          const fileName = img.fileName || `cover_photo_${Date.now()}.jpg`;
          const uri = img.uri;

          if (!uri) {
            console.error("No URI found for cover photo:", img);
            setIsCoverPhotoUploading(false);
            return;
          }

          const reference = storage().ref(fileName);
          const task = reference.putFile(uri);

          try {
            await task;
            const downloadUrl = await reference.getDownloadURL();
            setCoverPhoto(downloadUrl);
            setIsCoverPhotoUploading(false);
          } catch (uploadError) {
            console.error("Cover photo upload error:", uploadError);
            Toast.show({
              type: "error",
              text1: "Cover photo upload failed",
              position: "bottom",
            });
            setIsCoverPhotoUploading(false);
          }
        }
      }
    );
  };

  const handleGalleryImagesPick = async () => {
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
          console.log("User cancelled gallery images picker");
          return;
        }
        if (response.errorCode) {
          console.error("Gallery images picker error:", response.errorMessage);
          const errorMessage = await getFirebaseErrorMessage(
            "Failed to select gallery images"
          );
          Toast.show({
            type: "error",
            text1: errorMessage,
            position: "bottom",
          });
          return;
        }
        if (response.assets?.length) {
          console.log("Selected gallery images:", response.assets);
          setIsGalleryUploading(true);
          const uploadedImages = await Promise.all(
            response.assets.map(async (img) => {
              const fileName = img.fileName || `gallery_image_${Date.now()}.jpg`;
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
          setIsGalleryUploading(false);
        }
      }
    );
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const openImageView = (index: number, isCoverPhoto: boolean = false) => {
    setSelectedIndex(index);
    setIsVisible(true);
    setViewingCoverPhoto(isCoverPhoto);
  };

  const renderImages = () => {
    return (
      <View>
        {/* Cover Photo Section */}
        {coverPhoto && (
          <View style={styles.coverPhotoSection}>
            <Text
              style={[
                Typography.f_16_nunito_medium,
                { color: colors.black, marginBottom: 10 },
              ]}
            >
              {t("coverPhoto")}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openImageView(0, true)}
              style={styles.coverPhotoContainer}
            >
              <Image
                style={styles.coverPhoto}
                source={{ uri: coverPhoto }}
                resizeMode="cover"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRemoveCoverPhoto}
              >
                <Cross />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Gallery Images Section */}
        {galleryImages.length > 0 && (
          <View style={styles.gallerySection}>
            <Text
              style={[
                Typography.f_16_nunito_medium,
                { color: colors.black, marginBottom: 10 },
              ]}
            >
              {t("galleryImages")}
            </Text>
            <FlatList
              data={galleryImages}
              numColumns={3}
              columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => openImageView(index, false)}
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
                    onPress={() => handleRemoveGalleryImage(index)}
                  >
                    <Cross />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
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

  const handleMapPress = async (
    event: Event,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    clearInput();

    try {
      const response = await axios.get(
        `${EnvConfig.googleMaps.geocodeUrl}?latlng=${latitude},${longitude}&key=${EnvConfig.googleMaps.apiKey}`
      );





      const formattedAddress =
        response.data.results[0]?.formatted_address || "";

      const location: LocationProp = {
        address: formattedAddress,
        lat: latitude,
        long: longitude,
      };

      setLastSelectedLocation(location);
      updateMapAndMarker(location.lat, location.long);
      setInputValue(formattedAddress);
      setFieldValue("location", location);
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

    setLastSelectedLocation(location);
    setFieldValue("location", location);
    updateMapAndMarker(location.lat, location.long);
    setInputValue(details.formatted_address);
  };

  return (
    <>

      <View style={[styles.mainContainer, styles.platformMarginTop]}>

        {isLocationLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.Primary_01} />
          </View>
        ) : (
          <>

            {
              (
                <>
                  <View style={styles.contentContainer}>

                    <Header title={t("addProperty")} />


                    


                    <ScrollView
                      contentContainerStyle={styles.scrollContainer}
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
                          <AddPhoto />
                          <Text
                            style={[styles.photoTextLabel, Typography.f_14_nunito_bold]}
                          >
                            {t("coverPhoto")}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Cover Photo Section */}
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
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => openImageView(0, true)}
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
                          </View>
                        )
                      )}

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleGalleryImagesPick}
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
                            {t("galleryImages")}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Gallery Images Section */}
                      {isGalleryUploading ? (
                        <ActivityIndicator
                          size="large"
                          color={colors.Primary_01}
                          style={{ marginTop: 20 }}
                        />
                      ) : (
                        galleryImages.length > 0 && (
                          <View style={styles.gallerySection}>
                            <Text
                              style={[
                                Typography.f_16_nunito_medium,
                                { color: colors.black, marginBottom: 10 },
                              ]}
                            >
                              {t("galleryImages")}
                            </Text>
                            <FlatList
                              data={galleryImages}
                              numColumns={3}
                              columnWrapperStyle={{ gap: 7, paddingBottom: 12 }}
                              renderItem={({ item, index }) => (
                                <TouchableOpacity
                                  key={index}
                                  activeOpacity={0.8}
                                  onPress={() => openImageView(index, false)}
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
                                    onPress={() => handleRemoveGalleryImage(index)}
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
                          viewingCoverPhoto && coverPhoto
                            ? [{ uri: coverPhoto }]
                            : galleryImages.map((url) => ({ uri: url }))
                        }
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
                          location: initialLocation || { address: "", lat: 0, long: 0 },
                        }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
                          try {
                            // Combine cover photo and gallery images with cover photo at index 0
                            const allImages = coverPhoto ? [coverPhoto, ...galleryImages] : galleryImages;

                            const formData = {
                              ...values,
                              images: allImages,
                            };

                            if (user?.userId) {
                              dispatch(addProperty(formData, user.userId, navigation));
                              resetForm();
                              setCoverPhoto(null);
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
                            <View style={{ gap: 8, marginTop: 10  }}>
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
                                    key: `${EnvConfig.googleMaps.apiKey}`,
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
                                      paddingLeft: 15,
                                      borderWidth: 0.3,
                                      borderColor: Colors.DARK_GRAY,
                                      borderRadius: 5,
                                      backgroundColor: Colors.white,
                                      height: 45,
                                      marginTop: 0,
                                      marginLeft: 0,
                                      marginRight: 0,
                                    },
                                    textInputContainer: {
                                      backgroundColor: Colors.white,
                                      borderTopWidth: 0,
                                      borderBottomWidth: 0,
                                      // zIndex: 1,
                                    },
                                    listView: {
                                      backgroundColor: 'red',
                                      borderWidth: 0.3,
                                      borderColor: Colors.DARK_GRAY,
                                      borderRadius: 8,
                                      marginTop: 10,
                                      // position: "relative",
                                      // top: "100%",
                                      // left: 0,
                                      // right: 0,
                                      zIndex: 1000,
                                      elevation:5,
                                      // elevation: 3,
                                      // shadowColor: "#000",
                                      // shadowOffset: { width: 0, height: 2 },
                                      // shadowOpacity: 0.25,
                                      // shadowRadius: 3.84,
                                    },
                                    // row: {
                                    //   backgroundColor: Colors.white,
                                    //   padding: 13,
                                    //   height: "auto",
                                    //   minHeight: 44,
                                    // },
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
                                    <Icon
                                      name="close"
                                      size={20}
                                      color={Colors.DARK_GRAY}
                                    />
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                              <View>
                                <MapView
                                  ref={mapRef}
                                  style={{ height: 200, width: "100%" }}
                                  provider={PROVIDER_GOOGLE}
                                  region={mapRegion}
                                  onPress={(event) =>
                                    handleMapPress(event, setFieldValue)
                                  }
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
                                  // onPress={async () => {
                                  //   if (!isInitialLocationSet) {
                                  //     // If initial location is not set, get current location
                                  //     Geolocation.getCurrentPosition(
                                  //       async (position) => {
                                  //         const { latitude, longitude } = position.coords;
                                  //         mapRef.current?.animateToRegion(
                                  //           {
                                  //             latitude,
                                  //             longitude,
                                  //             latitudeDelta: 0.01,
                                  //             longitudeDelta: 0.01,
                                  //           },
                                  //           1000
                                  //         );

                                  //         setMarker({ latitude, longitude });

                                  //         try {
                                  //           const response = await axios.get(
                                  //             `${EnvConfig.googleMaps.geocodeUrl}?latlng=${latitude},${longitude}&key=${EnvConfig.googleMaps.apiKey}`
                                  //           );

                                  //           if (response.data.status === "OK") {
                                  //             const formattedAddress =
                                  //               response.data.results[0]
                                  //                 ?.formatted_address || "";
                                  //             const location = {
                                  //               address: formattedAddress,
                                  //               lat: latitude,
                                  //               long: longitude,
                                  //             };
                                  //             setInitialLocation(location);
                                  //             setLastSelectedLocation(location);
                                  //             setInputValue(formattedAddress);
                                  //             if (placesRef.current) {
                                  //               placesRef.current.setAddressText(
                                  //                 formattedAddress
                                  //               );
                                  //             }
                                  //             setIsInitialLocationSet(true);
                                  //           }
                                  //         } catch (error) {
                                  //           console.error(
                                  //             "Error reverse geocoding:",
                                  //             error
                                  //           );
                                  //         }
                                  //       },
                                  //       (error) => console.log(error),
                                  //       {
                                  //         enableHighAccuracy: true,
                                  //         timeout: 20000,
                                  //         maximumAge: 1000,
                                  //       }
                                  //     );
                                  //   } else if (lastSelectedLocation) {
                                  //     // If initial location is set, recenter to last selected location
                                  //     mapRef.current?.animateToRegion(
                                  //       {
                                  //         latitude: lastSelectedLocation.lat,
                                  //         longitude: lastSelectedLocation.long,
                                  //         latitudeDelta: 0.01,
                                  //         longitudeDelta: 0.01,
                                  //       },
                                  //       1000
                                  //     );

                                  //     setMarker({
                                  //       latitude: lastSelectedLocation.lat,
                                  //       longitude: lastSelectedLocation.long,
                                  //     });
                                  //     setInputValue(lastSelectedLocation.address);
                                  //     if (placesRef.current) {
                                  //       placesRef.current.setAddressText(
                                  //         lastSelectedLocation.address
                                  //       );
                                  //     }
                                  //   }
                                  // }}

                               
onPress={async () => {
  // Move map to fixed coordinate
  mapRef.current?.animateToRegion(
    {
      latitude: currentLocation[0],
      longitude: currentLocation[1],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    1000
  );

  // Set marker at fixed coordinate
  setMarker({
    latitude: currentLocation[0],
    longitude: currentLocation[1],
  });

  // Reverse geocoding for address (optional)
  try {
    const response = await axios.get(
      `${EnvConfig.googleMaps.geocodeUrl}?latlng=${currentLocation[0]},${currentLocation[1]}&key=${EnvConfig.googleMaps.apiKey}`
    );

    if (response.data.status === "OK") {
      const formattedAddress = response.data.results[0]?.formatted_address || "";
      const location = {
        address: formattedAddress,
        lat: currentLocation[0],
        long:currentLocation[1],
      };

      setInitialLocation(location);
      setLastSelectedLocation(location);
      setInputValue(formattedAddress);

      if (placesRef.current) {
        placesRef.current.setAddressText(formattedAddress);
      }
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
  }
}}
                                  style={{
                                    position: "absolute",
                                    top: "5%",
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
                </>
              )
            }
          </>



        )}
      </View>
    </>
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
    coverPhotoSection: {
      // marginVertical: 20,
    },
    coverPhotoContainer: {
      position: "relative",
    },
    coverPhoto: {
      width: "100%",
      height: 200,
      borderRadius: 8,
    },
    removeButton: {
      position: "absolute",
      right: 10,
      top: 10,
      // backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 15,
      padding: 5,
    },
    coverPhotoPlaceholder: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: Colors.DARK_GRAY,
      borderStyle: "dashed",
      borderRadius: 8,
      padding: 10,
    },
    placeholderText: {
      color: Colors.DARK_GRAY,
    },
    gallerySection: {
      // marginVertical: 20,
    },
    galleryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    addGalleryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    addGalleryText: {
      color: Colors.DARK_GREEN,
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
      flex:1,
    },
    clearButton: {
      position: "absolute",
      right: 10,
      backgroundColor: Colors.white,
      top: 10,
    },
    galleryPlaceholder: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: Colors.DARK_GRAY,
      borderStyle: "dashed",
      borderRadius: 8,
      padding: 20,
      marginTop: 10,
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
    locationError: {
      flex: 1,
      width: '50%',
      marginHorizontal: '25%',
      justifyContent: 'center',
      alignItems: 'center',
      height: "100%"
    },
  });

export default AddProperty;
