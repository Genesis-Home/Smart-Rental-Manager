import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { AppIcon, Location, Notification, Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import Images from "../../assets/images";
import { Heart, Prev, Next, Address, Add } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { HomeScreenNavigationProp, Property } from "../../types/types";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: {
      en: "Modern Apartment",
      sp: "Apartamento Moderno",
    },
    description: {
      en: "A spacious living room with contemporary furnishings and decor.",
      sp: "Una sala de estar espaciosa con mobiliario y decoración contemporáneos.",
    },
    address: {
      en: "R592 Elm St, Springfield",
      sp: "R592 Elm St, Springfield",
    },
    images: [Images.Banner, Images.Banner, Images.Banner],
  },
  {
    id: "2",
    title: {
      en: "Luxury Penthouse",
      sp: "Ático de Lujo",
    },
    description: {
      en: "A stunning penthouse with panoramic views and elegant interiors.",
      sp: "Un impresionante ático con vistas panorámicas e interiores elegantes.",
    },
    address: {
      en: "12th Avenue, New York",
      sp: "12th Avenue, Nueva York",
    },
    images: [Images.Banner, Images.Banner, Images.Banner],
  },
];

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language === "sp" ? "sp" : "en";

  const [activeIndexes, setActiveIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const scrollRefs = useRef<{ [key: string]: FlatList<any> | null }>({});

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
        onPress={() => navigation.navigate("ApartmentDetails", { id: item.id })}
      >
        <View style={styles.carouselWrapper}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={item.images}
            renderItem={({ item: image, index }) => (
              <Image
                key={index}
                source={image}
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
          <View style={styles.carouselOverlay}>
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
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ position: "absolute", bottom: 10, right: 10 }}
            >
              <Heart height={30} width={30} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginVertical: 20, gap: 5 }}>
          <Text
            style={[Typography.f_20_montserrat_bold, { color: Colors.black }]}
          >
            {item.title[currentLanguage]}
          </Text>
          <Text
            style={[
              Typography.f_14_nunito_medium,
              { color: Colors.black, lineHeight: 24, width: "70%" },
            ]}
          >
            {item.description[currentLanguage]}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Address />
            <Text
              style={[
                Typography.f_14_nunito_medium,
                { color: Colors.DARK_GREEN, lineHeight: 24 },
              ]}
            >
              {item.address[currentLanguage]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <AppIcon />
        <View style={styles.iconWrapper}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Map")}
          >
            <Location />
          </TouchableOpacity> */}
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
          />
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={Images.ProfilePlaceholder}
            resizeMode="contain"
            style={styles.profileImage}
          />
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddProperty")}
        style={{ position: "absolute", bottom: 5, right: 0 }}
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
    width: "80%",
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.Neutral_01,
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
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
});
