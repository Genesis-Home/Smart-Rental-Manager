import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, TextInput } from "react-native";
import Colors from "../../utilities/constants/colors";
import Images from "../../assets/images";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";

const Map: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  console.log(search, "search");
  return (
    <ImageBackground
      style={styles.container}
      source={Images.map1}
      resizeMode="cover"
    >
      <View style={{ marginHorizontal: "5%" }}>
        <Header title={t("location")} />
        <View style={styles.searchContainer}>
          <Search />
          <TextInput
            placeholder={t("search")}
            placeholderTextColor={Colors.PLACE_HOLDER}
            style={[Typography.f_14_nunito_medium, styles.searchInputField]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.Neutral_01,
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    marginTop: 20,
  },
  searchInputField: {
    color: Colors.DARK_GREEN,
    flex: 1,
  },
});
