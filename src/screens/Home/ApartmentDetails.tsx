import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { Prev, Next, Heart, Address } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RouteParams } from "../../types/types";
import { fetchPropertyById } from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const { width } = Dimensions.get("window");

const ApartmentDetails: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [apartmentDetail, setApartmentDetail] = useState<any>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<FlatList>(null);
  const route =
    useRoute<
      RouteProp<{ ApartmentDetails: RouteParams }, "ApartmentDetails">
    >();

  const { id: apartmentID } = route?.params || {};

  const property = useAppSelector((state: any) => state.reducer.property);

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

  return (
    <View style={styles.container}>
      <Header title={t("AdFullView")} />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.carouselWrapper}>
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={apartmentDetail?.images}
              renderItem={({ item, index }) => (
                <Image
                  key={index}
                  source={{ uri: item }}
                  resizeMode="cover"
                  style={styles.carouselImage}
                />
              )}
              keyExtractor={(index) => index.toString()}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              ref={scrollRef}
            />
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
              {/* <TouchableOpacity
                activeOpacity={0.8}
                style={{ position: "absolute", bottom: 10, right: 10 }}
              >
                <Heart height={30} width={30} />
              </TouchableOpacity> */}
            </View>
          </View>
          <View style={styles.detailsWrapper}>
            <Text style={[styles.titleText, Typography.f_20_montserrat_bold]}>
              {apartmentDetail?.title}
            </Text>
            <Text
              style={[styles.descriptionText, Typography.f_14_nunito_medium]}
            >
              {apartmentDetail?.description}
            </Text>
            <View style={styles.addressRow}>
              <Address style={{ top: -3 }} />
              <Text style={[styles.addressText, Typography.f_14_nunito_medium]}>
                {apartmentDetail?.location
                  ? apartmentDetail.location
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
                    Revenue:
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
                  Revenue: {t("noRevenue")}
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
  },
  descriptionText: {
    color: Colors.black,
    lineHeight: 24,
    width: "70%",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressText: {
    color: Colors.DARK_GREEN,
    lineHeight: 24,
    marginBottom: 10,
  },
});
