import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { Prev, Next, Address } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import getFirebaseErrorMessage from "../../services/firebaseErrorHandler";
import { RootStackParamList } from "../../types/types";
import {
  fetchPropertyById,
  deletePropertyById,
} from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import Images from "../../assets/images";
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";

const { width } = Dimensions.get("window");

type ApartmentDetailsRouteParams = {
  id: string;
};

const ApartmentDetails: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [apartmentDetail, setApartmentDetail] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<FlatList>(null);
  const route =
    useRoute<
      RouteProp<
        { ApartmentDetails: ApartmentDetailsRouteParams },
        "ApartmentDetails"
      >
    >();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { id: apartmentID } = route?.params || {};

  const property = useAppSelector((state: any) => state.reducer.property);
  const user = useAppSelector((state: any) => state.reducer.user);

  useEffect(() => {
    if (apartmentID) {
      dispatch(fetchPropertyById(apartmentID));
    }
  }, [apartmentID, dispatch]);

  useEffect(() => {
    if (property) {
      setApartmentDetail(property);
    }
  }, [property]);

  const handleLogoutConfirm = async () => {
    setShowDeleteModal(false);
    if (user?.userId) {
      await dispatch(deletePropertyById(apartmentID, user.userId));
      navigation.goBack();
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

  const handleLogoutCancel = () => {
    setShowDeleteModal(false);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      scrollRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleNext = () => {
    if (activeIndex < apartmentDetail?.images.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      scrollRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const openImageView = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title={t("AdFullView")} />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.carouselWrapper}>
            {apartmentDetail?.images.length > 0 ? (
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={apartmentDetail?.images}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => openImageView(index)}
                  >
                    <FastImage
                      key={index}
                      source={{ uri: item }}
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.carouselImage}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(index) => index.toString()}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={scrollRef}
              />
            ) : (
              <FastImage
                source={Images.NoPhoto}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.carouselImage}
              />
            )}

            <View style={styles.carouselOverlay}>
              {apartmentDetail?.images.length > 1 && (
                <>
                  <View style={styles.carouselControlWrapper}>
                    <TouchableOpacity activeOpacity={0.8} onPress={handlePrev}>
                      <Prev height={30} width={30} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
                      <Next height={30} width={30} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dotContainer}>
                    {apartmentDetail?.images.map((idx: any) => (
                      <View
                        key={idx}
                        style={[
                          styles.dot,
                          idx === activeIndex ? styles.activeDot : null,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>

          <ImageView
            images={
              apartmentDetail?.images.map((url: string) => ({ uri: url })) || []
            }
            imageIndex={selectedImageIndex}
            visible={isImageViewVisible}
            onRequestClose={() => setIsImageViewVisible(false)}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
          />

          <View style={styles.detailsWrapper}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.titleText, Typography.f_20_nunito_bold]}>
                {apartmentDetail?.title}
              </Text>
              {user?.userId === apartmentDetail?.createdBy && (
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginRight: 10,
                      backgroundColor: Colors.Primary_01,
                      padding: 8,
                      borderRadius: 8,
                    }}
                    onPress={() =>
                      navigation.navigate("EditProperty", { id: apartmentID })
                    }
                  >
                    <MaterialIcons name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: Colors.Primary_01,
                      padding: 8,
                      borderRadius: 8,
                    }}
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <MaterialIcons name="delete" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text
              style={[styles.descriptionText, Typography.f_14_nunito_medium]}
            >
              {apartmentDetail?.description}
            </Text>
            <View style={styles.addressRow}>
              <Address style={{ top: 2 }} />
              <Text style={[styles.addressText, Typography.f_14_nunito_medium]}>
                {apartmentDetail?.location?.address
                  ? apartmentDetail.location.address
                  : t("noLocation")}
              </Text>
            </View>
            {apartmentDetail?.revenue !== undefined &&
            apartmentDetail?.revenue !== null ? (
              apartmentDetail.revenue > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={[
                      Typography.f_14_nunito_bold,
                      { color: Colors.black },
                    ]}
                  >
                    {t("Revenue")}:
                  </Text>
                  <Text
                    style={[
                      Typography.f_14_nunito_medium,
                      { color: Colors.black },
                    ]}
                  >
                    {String(apartmentDetail.revenue)}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    Typography.f_14_nunito_medium,
                    { color: Colors.black, marginBottom: 10 },
                  ]}
                >
                  {t("Revenue")}: {t("noRevenue")}
                </Text>
              )
            ) : (
              <Text
                style={[
                  Typography.f_14_nunito_medium,
                  { color: Colors.black, marginBottom: 10 },
                ]}
              >
                Revenue: {t("noRevenueAvailable")}
              </Text>
            )}
          </View>
          <Text style={[Typography.f_16_nunito_bold, { color: Colors.black }]}>
            {t("otherDet")}
          </Text>
          <Text
            style={[
              Typography.f_14_nunito_medium,
              { color: Colors.PLACE_HOLDER, marginTop: 10 },
            ]}
          >
            {apartmentDetail?.otherDetails}
          </Text>
        </View>
        <Modal
          transparent={true}
          visible={showDeleteModal}
          animationType="fade"
          onRequestClose={handleLogoutCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t("confirmDelete")}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleLogoutConfirm}
                >
                  <Text style={styles.modalButtonText}>{t("ok")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleLogoutCancel}
                >
                  <Text style={styles.modalButtonText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default ApartmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  scrollContentContainer: {
    paddingBottom: 50,
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
  detailsWrapper: {
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: Colors.Neutral_01,
    gap: 5,
  },
  titleText: {
    color: Colors.black,
    width: "70%",
  },
  descriptionText: {
    color: Colors.black,
    lineHeight: 24,
  },
  addressRow: {
    flexDirection: "row",
    gap: 5,
  },
  addressText: {
    color: Colors.DARK_GREEN,
    lineHeight: 24,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    ...Typography.f_16_nunito_bold,
    color: Colors.DARK_GREEN,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: Colors.Primary_01,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    ...Typography.f_14_nunito_medium,
    color: Colors.white,
  },
});
