import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  TextInput,
  Keyboard,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Add, Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Contact, CreateContactScreenNavigationProp } from "../../types/types";
import { fetchContactsByUserID } from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Profile: React.FC = () => {
  const navigation = useNavigation<CreateContactScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.reducer.contacts);
  const user = useAppSelector((state: any) => state.reducer.user);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchContactsByUserID(user?.userId));
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [dispatch]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderContactItem = ({ item, index }: ListRenderItemInfo<Contact>) => (
    <View
      style={[
        styles.contactView,
        index === filteredContacts.length - 1 && styles.lastItemMarginBottom,
      ]}
    >
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("name")}</Text>
        <Text style={styles.contactValue}>{item.name}</Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("Email")}</Text>
        <Text style={styles.contactValue}>{item.emailAddress}</Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{t("phoneNum")}</Text>
        <Text style={styles.contactValue}>{item.phoneNumber}</Text>
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
      {filteredContacts.length === 0 ? (
        <View style={styles.noContactsFound}>
          <Text style={styles.noContactsText}>{t("noContactsFound")}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("createContact")}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          bottom: keyboardVisible ? 40 : 5,
          right: 0,
        }}
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
    marginTop: 20,
  },
  searchInputField: {
    color: Colors.DARK_GREEN,
    flex: 1,
  },
  noContactsFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContactsText: {
    ...Typography.f_14_nunito_extra_bold,
    color: Colors.Primary_01,
  },
});
