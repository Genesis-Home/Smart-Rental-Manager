import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
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
import { useTranslation } from "react-i18next";


interface LocationPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelected: (location: {
        lat: number;
        lng: number;
    }) => void;
    apiKey: string;
    userLocation?: any;
    lastLocation: any
    isEditMode?: boolean;
    editRecenterLocation?: any

}



const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
    visible,
    onClose,
    onLocationSelected,
    apiKey,
    userLocation,
    lastLocation,
    isEditMode,
    editRecenterLocation,
}) => {
    const [region, setRegion] = useState<Region | null>(null);
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

    const placesRef = useRef<any | null>(null);
    const mapRef = useRef<MapView | null>(null);
    const hasOpenedBeforeRef = useRef(false);




    useEffect(() => {
        if (!visible) return;

        let locationToUse: { latitude: number; longitude: number } | null = null;

        if (isEditMode && Array.isArray(lastLocation) && lastLocation.length === 2) {
            // Edit mode: show last saved location
            locationToUse = {
                latitude: lastLocation[0],
                longitude: lastLocation[1],
            };
        } else if (!hasOpenedBeforeRef.current && userLocation?.latitude && userLocation?.longitude) {
            // First time opening: show user current location
            locationToUse = userLocation;
        } else if (Array.isArray(lastLocation) && lastLocation.length === 2) {
            // Subsequent openings: show last selected location
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
            setSelectedLocation({ lat: locationToUse.latitude, lng: locationToUse.longitude });
        }

        hasOpenedBeforeRef.current = true;
    }, [visible, userLocation, lastLocation, isEditMode]);





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
        setSelectedLocation({ lat: location.lat, lng: location.lng });
    };


    const { t } = useTranslation();






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

                            onPress={(e) => {
                                const coordinate = e.nativeEvent.coordinate;
                                setRegion({
                                    ...coordinate,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                });
                                setMarker(coordinate);
                                setSelectedLocation({ lat: coordinate.latitude, lng: coordinate.longitude });
                            }}
                            onPoiClick={(e) => {
                                const coordinate = e.nativeEvent.coordinate;
                                setRegion({
                                    ...coordinate,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                });
                                setMarker(coordinate);
                                setSelectedLocation({ lat: coordinate.latitude, lng: coordinate.longitude });
                            }}

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
                                placeholder={t("search")}
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
                                        alignSelf: 'center',
                                        width: '100%',
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
                                        color: '#000',
                                        fontSize: 16,
                                    },
                                }}
                            />
                        </View>


                        <TouchableOpacity activeOpacity={0.8} style={styles.closeBtn} onPress={() => {
                            if (selectedLocation) {
                                onLocationSelected(selectedLocation);
                            }
                            onClose();
                        }}>
                            <Icon name="checkmark" size={24} color={colors.white} />
                        </TouchableOpacity>




                    </View>

                    <TouchableOpacity


                        onPress={() => {
                            const locationToUse =
                                isEditMode && editRecenterLocation
                                    ? {
                                        latitude: editRecenterLocation[0],
                                        longitude: editRecenterLocation[1],
                                    }
                                    : userLocation;

                            if (mapRef.current && locationToUse) {
                                const newRegion = {
                                    latitude: locationToUse.latitude,
                                    longitude: locationToUse.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                };
                                mapRef.current.animateToRegion(newRegion, 1000);
                                setRegion(newRegion);
                                setMarker({
                                    latitude: locationToUse.latitude,
                                    longitude: locationToUse.longitude,
                                });

                                onLocationSelected({ lat: locationToUse.latitude, lng: locationToUse.longitude });

(placesRef.current as any)?.setAddressText('');



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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },

    closeBtn: {
        backgroundColor: colors.Primary_01,
        padding: 8,
        borderRadius: 30,
        elevation: 5,
        // borderWidth: 0.5,
        // borderColor: colors.DARK_GREEN,
    },
    recenterBtn: {
        position: "absolute",
        bottom: 30,
        right: 20,
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
