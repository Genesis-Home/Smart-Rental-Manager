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

const { width } = Dimensions.get("window");

const carouselImages = [Images.Banner, Images.Banner, Images.Banner];

const data = [
  {
    id: "1",
    title: "Modern Apartment",
    description:
      "A spacious living room with contemporary furnishings and decor.",
    address: "R592 Elm St, Springfield",
  },
  {
    id: "2",
    title: "Luxury Penthouse",
    description:
      "A stunning penthouse with panoramic views and elegant interiors.",
    address: "12th Avenue, New York",
  },
];

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      scrollRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const handleNext = () => {
    if (activeIndex < carouselImages.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      scrollRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }: { item: (typeof data)[0] }) => (
    <View>
      <View style={styles.carouselWrapper}>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={carouselImages}
          renderItem={({ item, index }) => (
            <Image
              key={index}
              source={item}
              resizeMode="cover"
              style={styles.carouselImage}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
        />
        <View style={styles.carouselOverlay}>
          <View style={styles.carouselControlWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={handlePrev}>
              <Prev height={30} width={30} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
              <Next height={30} width={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.carouselBottomWrapper}>
            <Text />
            <View style={styles.dotContainer}>
              {carouselImages.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    idx === activeIndex ? styles.activeDot : null,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Heart height={30} width={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Apartment Details */}
      <View style={{ marginVertical: 20, gap: 5 }}>
        <Text
          style={[Typography.f_20_montserrat_bold, { color: Colors.black }]}
        >
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Address />
          <Text
            style={[
              Typography.f_14_nunito_medium,
              { color: Colors.DARK_GREEN, lineHeight: 24 },
            ]}
          >
            {item.address}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <AppIcon />
        <View style={styles.iconWrapper}>
          <Location />
          <Notification />
        </View>
      </View>
      <View style={styles.searchAndProfile}>
        <View style={styles.searchContainer}>
          <Search />
          <TextInput
            placeholder="Search"
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
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  carouselControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  carouselBottomWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    bottom: "5%",
  },
  dotContainer: {
    flexDirection: "row",
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
