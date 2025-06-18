import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { Search, ShareIcon } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import Images from "../../assets/images";
import { Prev, Next, Address } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { HomeScreenNavigationProp, Property } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Header from "../../components/Header";
import { colors } from "../../utilities/constants";
import { fetchPropertiesByUserID } from "../../store/actions/action";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import Toast from "react-native-toast-message";
import { downloadMultipleImagesForSharing, cleanupSharedImages, createFallbackShareMessage, testFileAccess, getFileInfo } from "../../utilities/imageDownloader";
import Share from "react-native-share";

const { width } = Dimensions.get("window");

const MyAds: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useAppSelector((state: any) => state.reducer.user);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const userProperties = useAppSelector(
    (state) => state.reducer.userProperties
  );


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

    initialize();
  }, [dispatch, user?.userId]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(userProperties);

  const [activeIndexes, setActiveIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const scrollRefs = useRef<{ [key: string]: FlatList<any> | null }>({});

  const [isSharing, setIsSharing] = useState<string | null>(null);

  useEffect(() => {
    setFilteredProperties(userProperties);
  }, [userProperties]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProperties(userProperties);
    } else {
      const filtered = userProperties.filter((property) =>
        property.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

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

      let downloadedImagePaths: string[] = [];

      // If there are images, download them and include in share
      if (item.images && item.images.length > 0) {
        try {
          console.log('Starting image download for property:', title);
          downloadedImagePaths = await downloadMultipleImagesForSharing(item.images);
          
          if (downloadedImagePaths.length > 0) {
            console.log('Successfully downloaded images:', downloadedImagePaths);
            
            // Test file access before sharing
            const firstImagePath = downloadedImagePaths[0];
            const fileAccessible = await testFileAccess(firstImagePath);
            
            if (!fileAccessible) {
              console.error('File is not accessible:', firstImagePath);
              throw new Error('Downloaded file is not accessible');
            }
            
            const fileInfo = await getFileInfo(firstImagePath);
            console.log('File info for sharing:', fileInfo);
            
            // Create share options with actual images
            const shareOptions = {
              title: title,
              message: `🏢 *${title}*\n\n📝 *Description:*\n${description}\n\n📍 *Location:*\n${address}\n${
                mapsUrl ? `${mapsUrl}` : ""
              }`,
              url: Platform.OS === "android" ? `file://${firstImagePath}` : firstImagePath,
              type: "image/jpeg",
              filename: `property_${title.replace(/\s+/g, '_')}.jpg`,
              saveToFiles: true,
              isNew: true,
              mimeType: "image/jpeg",
              subject: title,
              failOnCancel: false,
              showAppsToView: true,
              isBase64: false,
              dialogTitle: "Share Property",
              forceDialog: true,
              chooserTitle: "Share Property with",
            };

            console.log('Sharing with options:', shareOptions);
            await Share.open(shareOptions);
            console.log('Share completed successfully');
          } else {
            console.log('No images downloaded, falling back to URL sharing');
            // Fallback to sharing URLs if image download fails
            const fallbackMessage = createFallbackShareMessage(title, description, address, item.images, mapsUrl);
            await Share.open({
              title: title,
              message: fallbackMessage,
              failOnCancel: false,
            });
          }
        } catch (downloadError) {
          console.error("Error downloading images for sharing:", downloadError);
          // Fallback to sharing without images if download fails
          const fallbackMessage = createFallbackShareMessage(title, description, address, item.images, mapsUrl);
          await Share.open({
            title: title,
            message: fallbackMessage,
            failOnCancel: false,
          });
        }
      } else {
        console.log('No images to share');
        // No images to share
        await Share.open({
          title: title,
          message: `🏢 *${title}*\n\n📝 *Description:*\n${description}\n\n📍 *Location:*\n${address}\n${
            mapsUrl ? `${mapsUrl}` : ""
          }`,
          failOnCancel: false,
        });
      }
      
      // Clean up downloaded images after sharing
      if (downloadedImagePaths.length > 0) {
        try {
          await cleanupSharedImages(downloadedImagePaths);
        } catch (cleanupError) {
          console.error("Error cleaning up shared images:", cleanupError);
        }
      }
    } catch (error) {
      console.error("Error sharing property:", error);
      Toast.show({
        type: "error",
        text1: "Failed to share property",
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

  const renderItem = ({ item }: { item: Property }) => {
    const activeIndex = activeIndexes[item.id] ?? 0;
    return (
      <TouchableOpacity
        style={{ marginBottom: 5 }}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Tabs", {
            screen: "Home",
            params: {
              screen: "ApartmentDetails",
              params: { id: item.id },
            },
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
                <Image
                  key={index}
                  source={{ uri: image }}
                  resizeMode="cover"
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
            <Image
              source={Images.NoPhoto}
              resizeMode="cover"
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
                backgroundColor: Colors.Primary_01,
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
              { color: Colors.black, lineHeight: 24, width: "70%" },
            ]}
          >
            {item.description}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Address style={{ top: 3 }} />
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

  return (
    <View style={styles.mainContainer}>
      <View style={{ marginTop: -30 }}>
        <Header title={t("myads")} />
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
          <Image
            source={
              user?.profilePhoto
                ? { uri: user.profilePhoto }
                : Images.ProfilePlaceholder
            }
            resizeMode="cover"
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
    </View>
  );
};

export default MyAds;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
    paddingTop: 30,
  },
  searchAndProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  searchContainer: {
    width: "80%",
    backgroundColor: Colors.white,
    paddingHorizontal: 13,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Neutral_01,
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
    height:45
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
