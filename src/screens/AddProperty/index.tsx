import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "../../utilities/constants/constant.style";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { Marker } from "react-native-maps";

type MarkerProps = {
  latitude: number;
  longitude: number;
};

type AddPropertyProps = {
  navigation: any;
};

const AddProperty: React.FC<AddPropertyProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.reducer.user);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
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
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [marker, setMarker] = useState<MarkerProps | null>({
    latitude: 30.4419,
    longitude: -84.2985,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const updateMapAndMarker = (lat: number, long: number) => {
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
    setIsLoadingLocation(false);
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          setIsLoadingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Get address from coordinates
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const formattedAddress = address
          ? `${address.street}, ${address.city}, ${address.region}, ${address.country}`
          : "";

        setInitialLocation({
          address: formattedAddress,
          lat: latitude,
          long: longitude,
        });
        setLastSelectedLocation({
          address: formattedAddress,
          lat: latitude,
          long: longitude,
        });
        updateMapAndMarker(latitude, longitude);
        setIsInitialLocationSet(true);
      } catch (error) {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <View style={[styles.mainContainer, { marginTop: Platform.OS === "ios" ? 50 : 0 }]}>
      <View style={styles.contentContainer}>
        <Header title={t("addProperty")} />
        {isLoadingLocation ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.Primary_01} />
            <Text style={[styles.loaderText, Typography.f_14_nunito_medium]}>
              {t("gettingLocation")}
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* ... rest of the form content ... */}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: "5%",
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    color: Colors.DARK_GREEN,
    textAlign: 'center',
  },
  // ... rest of the styles ...
});

export default AddProperty; 