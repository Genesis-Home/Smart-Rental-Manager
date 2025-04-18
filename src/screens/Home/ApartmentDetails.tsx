import React, { useState, useRef } from "react";
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
import { BackIcon, Prev, Next, Heart, Address } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Images from "../../assets/images";

const carouselImages = [Images.Banner, Images.Banner, Images.Banner];
const { width } = Dimensions.get("window");

const ApartmentDetails: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<FlatList>(null);
  const currentLanguage = i18n.language === "sp" ? "sp" : "en";

  const apartmentDetail = {
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
    otherDetails: {
      en: 'The "Other Details" section includes key property information. First, the property type is specified, such as an apartment, house, or commercial space. The price range is clearly indicated, for example, from PKR 25,00,000 to PKR 50,00,000. The property size is mentioned, whether it’s 5 Marla, 10 Marla, or 1 Kanal. The "Available From" date is captured using a calendar input. Furnishing options are provided through a dropdown menu, offering choices like fully furnished, semi-furnished, or not furnished. The number of bedrooms and bathrooms are either input as numeric values or selected from a dropdown. If applicable, the floor number is listed as an optional field. Lastly, nearby landmarks are included, either as a text field or tag-style input to give potential buyers or renters a sense of the area surrounding the property.',
      sp: 'La sección "Otros Detalles" incluye información clave sobre la propiedad. Primero, se especifica el tipo de propiedad, como apartamento, casa o espacio comercial. El rango de precios se indica claramente, por ejemplo, de PKR 25,00,000 a PKR 50,00,000. Se menciona el tamaño de la propiedad, ya sea de 5 Marla, 10 Marla o 1 Kanal. La fecha de "Disponible Desde" se captura mediante un selector de calendario. Las opciones de mobiliario se ofrecen a través de un menú desplegable, con opciones como totalmente amueblado, semi amueblado o sin amueblar. El número de habitaciones y baños se introduce como valores numéricos o se selecciona desde un menú desplegable. Si aplica, el número de piso se incluye como un campo opcional. Por último, se agregan puntos de referencia cercanos, ya sea como un campo de texto o una entrada estilo etiqueta, para dar a los posibles compradores o arrendatarios una idea del área que rodea la propiedad.',
    },
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
    if (activeIndex < carouselImages.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      scrollRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={[styles.screenTitle, Typography.f_17_nunito_bold]}>
            {t("AdFullView")}
          </Text>
          <Text />
        </View>
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
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ position: "absolute", bottom: 10, right: 10 }}
              >
                <Heart height={30} width={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailsWrapper}>
            <Text style={[styles.titleText, Typography.f_20_montserrat_bold]}>
              {apartmentDetail.title[currentLanguage]}
            </Text>
            <Text
              style={[styles.descriptionText, Typography.f_14_nunito_medium]}
            >
              {apartmentDetail.description[currentLanguage]}
            </Text>
            <View style={styles.addressRow}>
              <Address />
              <Text style={[styles.addressText, Typography.f_14_nunito_medium]}>
                {apartmentDetail.address[currentLanguage]}
              </Text>
            </View>
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
            {apartmentDetail.otherDetails[currentLanguage]}
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
  },
  scrollContentContainer: {
    marginHorizontal: "5%",
    paddingBottom: 50,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 10,
  },
  screenTitle: {
    color: Colors.DARK_GREEN,
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
    paddingHorizontal:10
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
    gap: 5,
    borderBottomWidth: 1,
    borderColor: Colors.Neutral_01,
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
