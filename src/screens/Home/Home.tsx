import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  Keyboard,
  ActivityIndicator,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { AppIcon, Notification, Search, ShareIcon } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import Images from "../../assets/images";
import { Prev, Next, Address, Add } from "../../assets/icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { HomeScreenNavigationProp, Property } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { colors } from "../../utilities/constants";
import RNFS from "react-native-fs";
import FastImage from "react-native-fast-image";
import {
  downloadMultipleImagesForSharing,
  cleanupSharedImages,
  createFallbackShareMessage,
  testFileAccess,
  getFileInfo,
} from "../../utilities/imageDownloader";
import Toast from "react-native-toast-message";
import Share from "react-native-share";
import { fetchPropertiesByUserID, isLocationSet } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import { checkLocationPermission } from "../../services/locationServiceCheck";
import { PermissionsAndroid, Linking } from 'react-native';
import { generatePropertyPDF } from "../../services/pdfService";


const { width } = Dimensions.get("window");

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const user = useAppSelector((state: any) => state.reducer.user);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const properties = useAppSelector((state) => state.reducer.userProperties);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);

  const [activeIndexes, setActiveIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const scrollRefs = useRef<{ [key: string]: FlatList<any> | null }>({});

  const [isSharing, setIsSharing] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (user?.userId) {
        dispatch(fetchPropertiesByUserID(user.userId));
      } else {
        const customMessage = await getFirebaseErrorMessage(
          "User not authenticated"
        );
        Toast.show({
          type: "error",
          text1: customMessage,
          position: "bottom",
        });
        navigation.navigate("Signin");
      }
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Call initialize function
    initialize();

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [dispatch, user?.userId]);

  // Update filteredProperties when properties change
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    gpsenable()
    handleExportPermission()



  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) =>
        property.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };
  // const handleShare = async (item: Property) => {
  //   try {
  //     setIsSharing(item.id);

  //     const title = item.title || "No Title";
  //     const description = item.description || "No Description";
  //     const address = item.location?.address || "No location available";
  //     const lat = item.location?.lat;
  //     const lng = item.location?.long;

  //     const mapsUrl =
  //       lat && lng
  //         ? `https://www.google.com/maps?q=${lat},${lng}`
  //         : address !== "No location available"
  //           ? `https://www.google.com/maps/search/${encodeURIComponent(address)}`
  //           : "";

  //     // Build share message
  //     const baseMessage = `🏢 ${title}\n\n📝 Description: ${description}\n\n📍 Location: ${address}${mapsUrl ? `\n${mapsUrl}` : ""}`;

  //     // 1) Try to generate PDF with full formatted template
  //     let pdfPath: string | null = null;
  //     try {
  //       pdfPath = await generatePropertyPDF({
  //         id: item.id,
  //         title: item.title,
  //         description: item.description,
  //         location: item.location,
  //         images: item.images || [],
  //         otherDetails: item.otherDetails,
  //         notes: item.notes,
  //         imagesAfter: item.imagesAfter,

  //       });
  //     } catch (e) {
  //       pdfPath = null; // proceed with fallback
  //     }

  //     // 2) Download images if any
  //     let downloadedImagePaths: string[] = [];
  //     try {
  //       if (item.images && item.images.length > 0) {
  //         downloadedImagePaths = await downloadMultipleImagesForSharing(item.images);
  //       }
  //     } catch { }

  //     // 3) Prefer sharing PDF + images (multi-file). Fallback to message with URLs
  //     if (pdfPath || downloadedImagePaths.length > 0) {
  //       const urls: string[] = [];
  //       if (pdfPath) {
  //         urls.push(`file://${pdfPath}`);
  //       }
  //       for (const imgPath of downloadedImagePaths) {
  //         urls.push(Platform.OS === "android" ? `file://${imgPath}` : imgPath);
  //       }

  //       const shareOptions: any = {
  //         title,
  //         subject: title,
  //         message: baseMessage,
  //         urls,
  //         failOnCancel: false,
  //         showAppsToView: true,
  //         isBase64: false,
  //         dialogTitle: "Share Property",
  //         forceDialog: true,
  //         chooserTitle: "Share Property with",
  //       };

  //       await Share.open(shareOptions);
  //     } else {
  //       // Final fallback to text-only share with links
  //       const fallbackMessage = createFallbackShareMessage(
  //         title,
  //         description,
  //         address,
  //         item.images,
  //         mapsUrl
  //       );
  //       await Share.open({ title, message: fallbackMessage, failOnCancel: false });
  //     }

  //     // Clean up downloaded images after sharing
  //     if (downloadedImagePaths.length > 0) {
  //       try {
  //         await cleanupSharedImages(downloadedImagePaths);
  //       } catch (cleanupError) {
  //         console.error("Error cleaning up shared images:", cleanupError);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error sharing property:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Failed to share property",
  //       position: "bottom",
  //     });
  //   } finally {
  //     setIsSharing(null);
  //   }
  // };
  const handleShare = async (item: Property) => {
    try {
      setIsSharing(item.id);
      const title = item.title || "No Title";
      const description = item.description || "No Description";
      const address = item.location?.address || "No location available";
      const lat = item.location?.lat;
      const lng = item.location?.long;
      const mapsUrl =
        lat && lng
          ? `https://www.google.com/maps?q=${lat},${lng}`
          : address !== "No location available"
            ? `https://www.google.com/maps/search/${encodeURIComponent(address)}`
            : "";
  
      // Build share message
      const otherDetailsText = item.otherDetails ? `\n\n📋 Other Details: ${item.otherDetails}` : "";
      const baseMessage = `🏢 ${title}\n\n📝 Description: ${description}${otherDetailsText}\n\n📍 Location: ${address}${mapsUrl ? `\n${mapsUrl}` : ""}`;
  
      // 1) Try to generate PDF with full formatted template
      let pdfPath: string | null = null;
      try {
        pdfPath = await generatePropertyPDF({
          id: item.id,
          title: item.title,
          description: item.description,
          location: item.location,
          images: item.images || [],
          otherDetails: item.otherDetails,
        });
        console.log('PDF generated at:', pdfPath);
      } catch (e) {
        console.error('PDF generation failed:', e);
        pdfPath = null;
      }
  
      // 2) Download images if any
      let downloadedImagePaths: string[] = [];
      try {
        if (item.images && item.images.length > 0) {
          downloadedImagePaths = await downloadMultipleImagesForSharing(item.images);
          console.log('Downloaded images:', downloadedImagePaths.length);
        }
      } catch (e) {
        console.error('Image download failed:', e);
      }
  
      // 3) Share with proper file URIs and types
      if (pdfPath || downloadedImagePaths.length > 0) {
        // Build combined list (PDF + images) for apps that support multi-attach (e.g., Email)
        const allUrls: string[] = [];
        
        if (pdfPath) {
          const pdfUri = Platform.OS === 'android' ? `file://${pdfPath}` : pdfPath;
          const pdfExists = await RNFS.exists(pdfPath);
          if (pdfExists) {
            allUrls.push(pdfUri);
          } else {
            console.error('PDF missing before share:', pdfPath);
          }
        }

        for (const imgPath of downloadedImagePaths) {
          const exists = await RNFS.exists(imgPath);
          if (exists) {
            const imgUri = Platform.OS === 'android' ? `file://${imgPath}` : imgPath;
            allUrls.push(imgUri);
          } else {
            console.error('Image missing:', imgPath);
          }
        }

        if (allUrls.length === 0) {
          throw new Error('No files available to share');
        }

        const combinedShareOptions: any = {
          title: title,
          subject: title,
          message: baseMessage,
          urls: allUrls,
          // Do not force a single MIME type; let the target app decide
          failOnCancel: false,
          showAppsToView: true,
          saveToFiles: Platform.OS === 'ios',
        };

        console.log('Share options (combined):', JSON.stringify(combinedShareOptions, null, 2));

        try {
          await Share.open(combinedShareOptions);
          console.log('Share (combined) completed successfully');
        } catch (err: any) {
          // Some apps (notably WhatsApp) reject mixed/multi attachments.
          const message = typeof err?.message === 'string' ? err.message.toLowerCase() : '';
          const isLikelyWhatsAppRejection = message.includes('whatsapp') || message.includes('unsupported') || message.includes('unsupported type') || message.includes('not supported');

          if (isLikelyWhatsAppRejection) {
            // Attempt images-only to WhatsApp (if any), then PDF-only to WhatsApp (if available), back-to-back.
            const imageUrls: string[] = [];
            for (const u of allUrls) {
              if (u.toLowerCase().endsWith('.png') || u.toLowerCase().endsWith('.jpg') || u.toLowerCase().endsWith('.jpeg')) {
                imageUrls.push(u);
              }
            }

            // Try images to WhatsApp first (if present)
            if (imageUrls.length > 0) {
              try {
                const waImagesOnly: any = {
                  message: baseMessage,
                  urls: imageUrls,
                  type: 'image/*',
                  failOnCancel: false,
                  social: (Share as any).Social?.WHATSAPP,
                };
                console.log('Retrying share to WhatsApp with images-only');
                await Share.open(waImagesOnly);
              } catch (imgErr) {
                console.warn('Images-only share to WhatsApp failed, will still try PDF if available');
              }
            }

            // Then try PDF to WhatsApp (if available)
            if (pdfPath) {
              const pdfUri = Platform.OS === 'android' ? `file://${pdfPath}` : pdfPath;
              const waPdfOnly: any = {
                message: baseMessage,
                url: pdfUri,
                type: 'application/pdf',
                failOnCancel: false,
                social: (Share as any).Social?.WHATSAPP,
                useInternalStorage: Platform.OS === 'android',
              };
              console.log('Retrying share to WhatsApp with PDF-only');
              await Share.open(waPdfOnly);
              console.log('Share to WhatsApp (PDF-only) completed successfully');
            }
          } else {
            throw err;
          }
        }
      } else {
        // Final fallback to text-only share with links
        const fallbackMessage = createFallbackShareMessage(
          title,
          description,
          address,
          item.images,
          mapsUrl
        );
        await Share.open({ 
          title, 
          message: fallbackMessage, 
          failOnCancel: false 
        });
      }
  
      // Clean up downloaded images after a delay (give time for share to complete)
      if (downloadedImagePaths.length > 0) {
        setTimeout(async () => {
          try {
            await cleanupSharedImages(downloadedImagePaths);
            console.log('Cleanup completed');
          } catch (cleanupError) {
            console.error("Error cleaning up shared images:", cleanupError);
          }
        }, 2000); // 2 second delay
      }
    } catch (error) {
      console.error("Error sharing property:", error);
      Toast.show({
        type: "error",
        text1: "Failed to share property",
        text2: error instanceof Error ? error.message : 'Unknown error',
        position: "bottom",
      });
    } finally {
      setIsSharing(null);
    }
  };
  const handleScroll = (event: any, id: string) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndexes((prev) => ({ ...prev, [id]: index }));
  };

  const handlePrev = (id: string, imagesLength: number) => {
    const currentIndex = activeIndexes[id] ?? 0;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setActiveIndexes((prev) => ({ ...prev, [id]: newIndex }));
      scrollRefs.current[id]?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const handleNext = (id: string, imagesLength: number) => {
    const currentIndex = activeIndexes[id] ?? 0;
    if (currentIndex < imagesLength - 1) {
      const newIndex = currentIndex + 1;
      setActiveIndexes((prev) => ({ ...prev, [id]: newIndex }));
      scrollRefs.current[id]?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };


  const gpsenable = async () => {
    try {
      const position: any = await checkLocationPermission();
      const { latitude, longitude } = position.coords;
      const loc = [latitude, longitude];

      dispatch(isLocationSet(true, loc));



    } catch (error) {
      console.error("Error in GPS enabling or reverse geocoding:", error);
      dispatch(isLocationSet(false, []));
    }
  };

  const handleExportPermission = async () => {
    if (Platform.OS === "android" && Platform.Version < 30) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Toast.show({ type: "error", text1: t("permissionDenied") });
        return;
      }
    }
  }




  const renderItem = ({ item }: { item: Property }) => {
    const activeIndex = activeIndexes[item.id] ?? 0;
    return (
      <TouchableOpacity
        style={{ marginBottom: 5 }}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Home", {
            screen: "ApartmentDetails",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.carouselWrapper}>
          {item.images && item.images.length > 0 ? (
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={item.images}
              renderItem={({ item: image, index }) => (
                <FastImage
                  key={index}
                  source={{ uri: image }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.carouselImage}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              onScroll={(e) => handleScroll(e, item.id)}
              scrollEventThrottle={16}
              ref={(ref) => {
                scrollRefs.current[item.id] = ref;
              }}
            />
          ) : (
            <FastImage
              source={Images.NoPhoto}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.carouselImage}
            />
          )}
          <View style={styles.carouselOverlay}>
            {item.images.length > 1 && (
              <View style={styles.carouselControlWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handlePrev(item.id, item.images.length)}
                >
                  <Prev height={30} width={30} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleNext(item.id, item.images.length)}
                >
                  <Next height={30} width={30} />
                </TouchableOpacity>
              </View>
            )}
            {item.images.length > 1 && (
              <View style={styles.dotContainer}>
                {item.images.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === activeIndex ? styles.activeDot : null,
                    ]}
                  />
                ))}
              </View>
            )}
            <TouchableOpacity
              onPress={() => handleShare(item)}
              activeOpacity={0.8}
              disabled={isSharing === item.id}
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                height: 35,
                width: 35,
                backgroundColor: colors.Primary_01,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
              }}
            >
              {isSharing === item.id ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <ShareIcon height={20} width={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginVertical: 20, gap: 5 }}>
          <Text style={[Typography.f_20_nunito_bold, { color: Colors.black }]}>
            {item.title}
          </Text>
          <Text
            style={[
              Typography.f_14_nunito_medium,
              { color: Colors.black, lineHeight: 24 },
            ]}
          >
            {item.description}
          </Text>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Address style={{ top: 2 }} />
            <Text
              style={[
                Typography.f_14_nunito_medium,
                { color: Colors.DARK_GREEN, lineHeight: 24 },
              ]}
            >
              {item.location.address ? item.location.address : t("noLocation")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <AppIcon />
        <View style={styles.iconWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Notification")}
          >
            <Notification />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchAndProfile}>
        <View style={styles.searchContainer}>
          <Search />
          <TextInput
            placeholder={t("search")}
            placeholderTextColor={Colors.PLACE_HOLDER}
            style={[Typography.f_14_nunito_medium, styles.searchInputField]}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <View style={styles.profileImageContainer}>
          <FastImage
            source={
              user?.profilePhoto
                ? { uri: user.profilePhoto }
                : Images.ProfilePlaceholder
            }
            resizeMode={FastImage.resizeMode.cover}
            style={styles.profileImage}
          />
        </View>
      </View>
      {filteredProperties.length === 0 ? (
        <View style={styles.noPropertiesFound}>
          <Text style={styles.noPropertiesText}>{t("noApartmentsFound")}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}


      <TouchableOpacity
        onPress={async () => {
          try {
            if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              );

              if (granted) {
                navigation.navigate("AddProperty");
              } else {
                const permissionRequest = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (permissionRequest === PermissionsAndroid.RESULTS.GRANTED) {
                  navigation.navigate("AddProperty");
                } else {
                  Alert.alert(
                    t('locationRequired'),
                    t('locationEnableMessageAddProperty'),
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      {
                        text: t('openSettings'),
                        onPress: () => Linking.openSettings()
                      }
                    ]
                  );
                }
              }
            } else {
              // iOS optional
              navigation.navigate("AddProperty");
            }
          } catch (err) {
            console.warn(err);
          }
        }}
        style={{
          position: "absolute",
          bottom: keyboardVisible ? 40 : 5,
          right: 0,
        }}
        activeOpacity={0.8}
      >
        <Add />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
    paddingTop: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchAndProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  searchContainer: {
    width: "84%",
    backgroundColor: Colors.white,
    paddingHorizontal: 13,
    borderRadius: 5,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.Neutral_01,
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputField: {
    color: Colors.DARK_GREEN,
    flex: 1,
  },
  profileImageContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  carouselWrapper: {
    height: 250,
    marginTop: 10,
  },
  carouselImage: {
    width: width * 0.9,
    height: 250,
    borderRadius: 25,
  },
  carouselOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  carouselControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dotContainer: {
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    bottom: "5%",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor: Colors.Neutral_01,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.white,
  },
  noPropertiesFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPropertiesText: {
    ...Typography.f_14_nunito_extra_bold,
    color: colors.Primary_01,
  },
});
