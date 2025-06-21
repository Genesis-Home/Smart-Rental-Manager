import React, { useState, useRef, useCallback, useEffect } from "react";
import screenResolution from "../../utilities/constants/screenResolution";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import { Marker as MarkerIcon, Search } from "../../assets/icons";
import { View } from "react-native";
import Header from "../../components/Header";
import {
  GooglePlacesAutocomplete,
  Language,
} from "react-native-google-places-autocomplete";
import Colors from "../../utilities/constants/colors";
import { useTranslation } from "react-i18next";
import { Typography } from "../../utilities/constants/constant.style";
import { DEFAULT_LANGUAGE } from "../../utilities";
import { GooglePlaceData, GooglePlaceDetail } from "../../types/types";
import axios from "axios";
import { MapScreenRouteProp } from "../../types/types";
import { EnvConfig } from "../../config/envConfig";

const Map = ({ route }: { route: MapScreenRouteProp }) => {
  const regionTimeout = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const placesRef = useRef<GooglePlacesAutocomplete | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (route.params?.location) {
      const { lat, long } = route.params.location;
      setMapRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [route.params?.location]);

  const handlePlaceSelect = useCallback(
    async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (!details) return;

      const { viewport } = details.geometry;

      if (!viewport || !viewport.northeast || !viewport.southwest) {
        console.error("Viewport or necessary properties are missing");
        return;
      }

      const { northeast, southwest } = viewport;
      const latitudeDelta = Math.abs(northeast.lat - southwest.lat);
      const longitudeDelta = Math.abs(northeast.lng - southwest.lng);
      const { lat, lng } = details.geometry.location;

      try {
        const response = await axios.get(
          `${EnvConfig.googleMaps.geocodeUrl}?latlng=${lat},${lng}&key=${EnvConfig.googleMaps.apiKey}`
        );

        if (response.data.status === "OK") {
          const addressComponents = response.data.results[0].address_components;
          let city = "";

          for (let component of addressComponents) {
            if (component.types.includes("locality")) {
              city = component.long_name;
              break;
            }
          }
          setCity(city);
        } else {
          console.error("Geocoding failed:", response.data.status);
        }
      } catch (error) {
        console.error("Error with reverse geocoding:", error);
      }

      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta,
        longitudeDelta,
      });
    },
    []
  );

  const clearInput = async () => {
    setCity("");
    placesRef.current?.setAddressText("");
  };

  const handleRegionChange = useCallback((region: Region) => {
    if (regionTimeout.current) {
      clearTimeout(regionTimeout.current);
    }

    regionTimeout.current = setTimeout(() => {
      setMapRegion(region);
    }, 500);
  }, []);

  

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{
          height: screenResolution.screenHeight,
          width: screenResolution.screenWidth,
        }}
        region={mapRegion}
        onRegionChange={handleRegionChange}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
          }}
        >
          <MarkerIcon />
        </Marker>
      </MapView>
      <View style={{ position: "absolute", width: "90%", alignSelf: "center" }}>
        <Header title={t("location")} />
        <GooglePlacesAutocomplete
          ref={placesRef}
          onFail={(error) => console.log("Google Places Error:", error)}
          predefinedPlaces={[]}
          textInputProps={{
            placeholderTextColor: Colors.DARK_GRAY,
          }}
          placeholder={t("search")}
          onPress={handlePlaceSelect}
          query={{
           key: EnvConfig.googleMaps.apiKey,
            language: DEFAULT_LANGUAGE as Language,
            location:
              mapRegion.latitude && mapRegion.longitude
                ? `${mapRegion.latitude},${mapRegion.longitude}`
                : "30.4419,-84.2985",
            radius: 10000,
          }}
          fetchDetails={true}
          minLength={2}
          enablePoweredByContainer={false}
          renderLeftButton={() => (
            <View style={{ alignSelf: "center", paddingLeft: 10 }}>
              <Search />
            </View>
          )}
          renderRightButton={() => null}
          styles={{
            container: {
              backgroundColor: Colors.white,
              borderRadius: 50,
              marginTop: 10,
              paddingVertical: 5,
              zIndex: 1,
            },
            textInput: {
              backgroundColor: Colors.white,
              borderRadius: 25,
              ...Typography.f_16_nunito_medium,
              color: Colors.DARK_GRAY,
              left: -8,
            },
            textInputContainer: {
              backgroundColor: Colors.white,
              borderRadius: 50,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              zIndex: 1,
            },
            listView: {
              backgroundColor: Colors.white,
              borderRadius: 10,
              position: "absolute",
              top: "100%",
              marginTop: 20,
              paddingHorizontal: 20,
              width: "100%",
              zIndex: 1000,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            row: {
              backgroundColor: Colors.white,
              padding: 13,
              height: 'auto',
              minHeight: 44,
            },
            description: {
              ...Typography.f_14_nunito_medium,
              color: Colors.black,
            },
            separator: {
              height: 0.5,
              backgroundColor: Colors.DARK_GRAY,
            },
          }}
        />
      </View>
    </>
  );
};

export default Map;
