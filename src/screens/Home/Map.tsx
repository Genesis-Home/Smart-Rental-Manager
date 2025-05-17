import React, { useState, useCallback, useRef } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import Colors from "../../utilities/constants/colors";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import AntDesign from "react-native-vector-icons/AntDesign";
import { RFValue } from "react-native-responsive-fontsize";
import screenResolution from "../../utilities/constants/screenResolution";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { DEFAULT_LANGUAGE } from "../../utilities";
import axios from "axios";

interface GeocodeResponse {
  status: string;
  results: {
    address_components: { long_name: string; types: string[] }[];
  }[];
}

const Map: React.FC = () => {
  const { t } = useTranslation();
  const placesRef = useRef(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 40.41347712579202,
    longitude: -3.706052240765947,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [city, setCity] = useState<string>("");

  const handleRegionChange = useCallback((region: Region) => {
    setMapRegion(region);
  }, []);

  const handlePlaceSelect = useCallback(
    async (data: any, details: GooglePlaceDetail | null) => {
      console.log("handlePlaceSelect called", { data, details });
      if (
        !details?.geometry?.location ||
        details.geometry.location.lat == null ||
        details.geometry.location.lng == null
      ) {
        Alert.alert("Location details not found. Please select a valid place.");
        return;
      }
      const { northeast, southwest } = details.geometry.viewport;
      const latitudeDelta = Math.abs(northeast.lat - southwest.lat);
      const longitudeDelta = Math.abs(northeast.lng - southwest.lng);
      const { lat, lng } = details.geometry.location;

      try {
        const response = await axios.get<GeocodeResponse>(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM`
        );
        console.log(response, "response");
        if (response.data.status === "OK") {
          const addressComponents = response.data.results[0].address_components;
          let cityName = "";

          for (let component of addressComponents) {
            if (component.types.includes("locality")) {
              cityName = component.long_name;
              break;
            }
          }
          // setCity(cityName);
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

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ height: "100%", width: "100%" ,zIndex:-1}}
        region={mapRegion}
        onRegionChange={handleRegionChange}
      />
      <View style={{ position: "absolute", width: "90%", alignSelf: "center" }}>
        <Header title={t("location")} />
        <GooglePlacesAutocomplete
          ref={placesRef}
          onFail={(error) => console.log("Google Places Error:", error)}
          predefinedPlaces={[]}
          textInputProps={{
            placeholderTextColor: "black",
            value: city,
            onChangeText: setCity,
          }}
          placeholder={t("search")}
          onPress={handlePlaceSelect}
          query={{
            key: "AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM",
            language: "en",
          }}
          fetchDetails={true}
          minLength={2}
          enablePoweredByContainer={false}
          renderLeftButton={() => (
            <View style={{ alignSelf: "center" }}>
              <Search />
            </View>
          )}
          // renderRightButton={() => {
          //   if (typeof city === "string" && city.length > 0) {
          //     return (
          //       <TouchableOpacity
          //         // onPress={clearInput}
          //         style={{ alignSelf: "center", top: 8 }}
          //       >
          //         <AntDesign
          //           name={"close"}
          //           color={"red"}
          //           size={RFValue(20, screenResolution.screenHeight)}
          //         />
          //       </TouchableOpacity>
          //     );
          //   }
          //   return null;
          // }}
          styles={{
            container: {
              backgroundColor: Colors.white,
              borderRadius: 50,
              paddingHorizontal: 10,
              marginTop: 10,
            },
            textInput: {
              backgroundColor: Colors.white,
              borderRadius: 25,
              ...Typography.f_16_nunito_medium,
              color: Colors.black,
            },
            listView: {
              backgroundColor: Colors.white,
              borderRadius: 10,
              position: "absolute",
              top: "100%",
              marginTop: 10,
              paddingHorizontal: 20,
              width: "100%",
              height: 100,
            },
            description: {
              ...Typography.f_14_nunito_medium,
              color: "black",
            },
            separator: {
              height: 0.5,
              backgroundColor: Colors.gray,
            },
          }}
        />
      </View>
    </>
  );
};

export default Map;
