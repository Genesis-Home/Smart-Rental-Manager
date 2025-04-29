import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Add, Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Contact, CreateContactScreenNavigationProp } from "../../types/types";

const contacts: Contact[] = [
  {
    id: "1",
    name: "Frank Williams",
    email: "frank-williams@gmail.com",
    phone: "+92 123456789",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+92 987654321",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+92 1122334455",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+92 1122334455",
  },
];

const Profile: React.FC = () => {
  const navigation = useNavigation<CreateContactScreenNavigationProp>();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const renderContactItem = ({ item, index }: ListRenderItemInfo<Contact>) => (
    <View
      style={[
        styles.contactView,
        index === contacts.length - 1 && styles.lastItemMarginBottom,
      ]}
    >
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("name")}</Text>
        <Text style={styles.contactValue}>{item.name}</Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("Email")}</Text>
        <Text style={styles.contactValue}>{item.email}</Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("phoneNum")}</Text>
        <Text style={styles.contactValue}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.profileContainer}>
      <Header title={t("contact")} />
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
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("createContact")}
        activeOpacity={0.8}
        style={{ position: "absolute", bottom: 10, right: 0 }}
      >
        <Add />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  flatListContainer: {
    marginTop: 20,
  },
  contactView: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.Neutral_01,
    marginBottom: 15,
    gap: 15,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactLabel: {
    color: Colors.black,
    ...Typography.f_14_nunito_medium,
    flex: 1,
  },
  contactValue: {
    color: Colors.black,
    ...Typography.f_14_nunito_medium,
    marginBottom: 5,
    flex: 1.5,
  },
  lastItemMarginBottom: {
    marginBottom: 30,
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
