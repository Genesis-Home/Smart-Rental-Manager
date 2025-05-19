import React, { useState, useRef, useCallback } from "react";
import screenResolution from "../../utilities/constants/screenResolution";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import { Marker as MarkerIcon, Search } from "../../assets/icons";
import { View, Text } from "react-native";
import Header from "../../components/Header";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../../utilities/constants/colors";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/hooks";
import { Typography } from "../../utilities/constants/constant.style";

const Map = () => {
  const regionTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const placesRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.4419,
    longitude: -84.2985,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  //  const handlePlaceSelect = useCallback(
  //   async (data, details = null) => {
  //     const {northeast, southwest} = details?.geometry?.viewport;
  //     const latitudeDelta = Math.abs(northeast.lat - southwest.lat);
  //     const longitudeDelta = Math.abs(northeast.lng - southwest.lng);
  //     const {lat, lng} = details?.geometry?.location;

  //     try {
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM`,
  //       );

  //       if (response.data.status === 'OK') {
  //         const addressComponents = response.data.results[0].address_components;
  //         let city = '';

  //         for (let component of addressComponents) {
  //           if (component.types.includes('locality')) {
  //             city = component.long_name;
  //             break;
  //           }
  //         }
  //         setCity(city);
  //       } else {
  //         console.error('Geocoding failed:', response.data.status);
  //       }
  //     } catch (error) {
  //       console.error('Error with reverse geocoding:', error);
  //     }

  //     setMapRegion({
  //       latitude: lat,
  //       longitude: lng,
  //       latitudeDelta,
  //       longitudeDelta,
  //     });
  //   },
  //   [dispatch],
  // );

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
        showsUserLocation={true}
        showsMyLocationButton={true}
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
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM",
            language: "en",
            location:
              mapRegion.latitude && mapRegion.longitude
                ? `${mapRegion.latitude},${mapRegion.longitude}`
                : "30.4419,-84.2985", // fallback default
            radius: 10000,
          }}
          fetchDetails={true}
          minLength={2}
          enablePoweredByContainer={false}
          // renderRow={(rowData) => {
          //   console.log("Suggestion:", rowData);
          //   // آپ اپنی مرضی کا UI یہاں return کریں یا default description:r
          //   return (
          //     <View>
          //       <Text>{rowData.description}</Text>
          //     </View>
          //   );
          // }}
          renderLeftButton={() => (
            <View style={{ alignSelf: "center", paddingLeft: 10 }}>
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
              marginTop: 10,
              paddingVertical: 5,
            },
            textInput: {
              backgroundColor: Colors.white,
              borderRadius: 25,
              ...Typography.f_16_nunito_medium,
              color: Colors.DARK_GRAY,
              left: -8,
              // top: 2,
            },
            textInputContainer: {
              backgroundColor: Colors.white,
              borderRadius: 50,
              borderTopWidth:0,
              borderBottomWidth:0
              // paddingVertical:5
            },
            listView: {
              backgroundColor: Colors.white,
              borderRadius: 10,
              position: "absolute",
              top: "100%",
              marginTop: 20,
              paddingHorizontal: 20,
              width: "100%",
              // height: 100,
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
