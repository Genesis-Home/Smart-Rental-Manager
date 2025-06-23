import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/Ionicons";
import { Marker as MarkerIcon, Search } from "../assets/icons";
import Colors from "../utilities/constants/colors";
import { Typography } from "../utilities/constants/constant.style";
import { colors } from "../utilities/constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


interface LocationPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelected: (location: {
        lat: number;
        lng: number;
    }) => void;
    apiKey: string;
    userLocation: any;
    lastLocation:any
}



const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
    visible,
    onClose,
    onLocationSelected,
    apiKey,
    userLocation,
    lastLocation,
}) => {
    const [region, setRegion] = useState<Region | null>(null);
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const regionTimeout = useRef<NodeJS.Timeout | null>(null);

    const placesRef = useRef<GooglePlacesAutocomplete | null>(null);
    const mapRef = useRef<MapView | null>(null);
const hasOpenedBeforeRef = useRef(false);




    // useEffect(() => {
    //     if (visible && userLocation) {
    //         const newRegion = {
    //             latitude: userLocation.latitude,
    //             longitude: userLocation.longitude,
    //             latitudeDelta: 0.01,
    //             longitudeDelta: 0.01,
    //         };
    //         setRegion(newRegion);
    //         setMarker({
    //             latitude: userLocation.latitude,
    //             longitude: userLocation.longitude,
    //         });
    //     }
    // }, [visible, userLocation]);

useEffect(() => {
    if (!visible) return; // Modal band ho to kuch mat karo

    let locationToUse: { latitude: number; longitude: number } | null = null;

    if (!hasOpenedBeforeRef.current && userLocation?.latitude && userLocation?.longitude) {
        // First time: use current location
        locationToUse = userLocation;
    } else if (Array.isArray(lastLocation) && lastLocation.length === 2) {
        // Next time: use last selected location
        locationToUse = {
            latitude: lastLocation[0],
            longitude: lastLocation[1],
        };
    }

    if (
        locationToUse &&
        typeof locationToUse.latitude === "number" &&
        typeof locationToUse.longitude === "number"
    ) {
        const newRegion = {
            latitude: locationToUse.latitude,
            longitude: locationToUse.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarker({
            latitude: locationToUse.latitude,
            longitude: locationToUse.longitude,
        });
    }

    hasOpenedBeforeRef.current = true;
}, [userLocation, lastLocation]); 




   const handleSelect = (details: any) => {
  if (!details?.geometry?.location) {
    console.warn("Invalid location details");
    return;
  }

  const location = details.geometry.location;

  const newRegion = {
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Animate map movement
  if (mapRef.current) {
    mapRef.current.animateToRegion(newRegion, 1000);
  }

  setMarker({ latitude: location.lat, longitude: location.lng });
  onLocationSelected({ lat: location.lat, lng: location.lng });
};







    const handleRegionChange = useCallback((region: Region) => {
        if (regionTimeout.current) {
            clearTimeout(regionTimeout.current);
        }

        regionTimeout.current = setTimeout(() => {
            setRegion(region);
        }, 500);
    }, []);


    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.container}>
                    {/* Map */}
                    {region && (
                       <MapView
  provider={PROVIDER_GOOGLE}
  style={styles.map}
  ref={mapRef}
  initialRegion={region || {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  onPress={(data: any) => handleSelect(data)}
>
                            <Marker
                                coordinate={marker as any}
                            >
                                <MarkerIcon />
                            </Marker>
                        </MapView>
                    )}

                    {/* Close Button */}

                    <View style={styles.headerWrapper}>

                        <View style={styles.searchWrapper}>
                            <GooglePlacesAutocomplete
                                ref={placesRef}
                                placeholder="Search for a location"
                                fetchDetails
                                onPress={(data, details = null) => {

                                    if (details && details.geometry && details.geometry.location) {
                                        handleSelect(details);
                                    } else {
                                        console.warn("Location details not available yet.");
                                    }
                                }}

                                query={{
                                    key: apiKey,
                                    language: "en",
                                }}
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
                                        paddingVertical: 5,
                                        zIndex: 10,
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
                                        zIndex: 10,
                                    },
                                    listView: {
                                        backgroundColor: Colors.white,
                                        borderRadius: 10,
                                        position: "absolute",
                                        top: "100%",
                                        marginTop: 20,
                                        paddingHorizontal: 20,
                                        paddingVertical: 25,
                                        width: "100%",
                                        zIndex: 1000,
                                        elevation: 3,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                    },

                                    row: {
                                        backgroundColor: Colors.white,
                                        padding: 13,
                                        height: 44,
                                        flexDirection: 'row',
                                    },
                                    description: {
                                        color: '#000', // 👈 this sets the text color to black
                                        fontSize: 16,
                                    },
                                }}
                            />
                        </View>


                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Icon name="close" size={24} color="#333" />
                        </TouchableOpacity>

                        


                    </View>

                    <TouchableOpacity
                            onPress={() => {
                                if (mapRef.current && userLocation) {
                                    const newRegion = {
                                        latitude: userLocation.latitude,
                                        longitude: userLocation.longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    };
                                    mapRef.current.animateToRegion(newRegion, 1000);
                                    setRegion(newRegion);
                                    setMarker({
                                        latitude: userLocation.latitude,
                                        longitude: userLocation.longitude,
                                    });
                                }
                            }}
                            style={styles.recenterBtn}
                        >
                            <MaterialIcons
                                    name="my-location"
                                    size={24}
                                    color={Colors.Error_Red}
                                  />
                        </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default LocationPickerModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000030",
        justifyContent: "flex-end",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },

    headerWrapper: {
        position: "absolute",
        top: Platform.OS === "ios" ? 60 : 30,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 20,
    },

    searchWrapper: {
        flex: 1,
        marginRight: 10,
    },

    closeBtn: {
        backgroundColor: "#f0f0f0",
        padding: 8,
        borderRadius: 30,
        elevation: 5,
        borderWidth: 0.5,
        borderColor: colors.DARK_GRAY,
    },
    recenterBtn: {
  position: "absolute",      // Add this
  bottom: 30,                // Distance from bottom
  right: 20,                 // Distance from right
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 25,
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},


});
