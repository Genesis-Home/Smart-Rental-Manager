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
  Modal,
} from "react-native";
import Colors from "../../utilities/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Add, Search } from "../../assets/icons";
import { Typography } from "../../utilities/constants/constant.style";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Contact, CreateContactScreenNavigationProp } from "../../types/types";
import {
  fetchContactsByUserID,
  deleteContact,
} from "../../store/actions/action";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import CTAButton1 from "../../components/CTA_BUTTON1";

const Profile: React.FC = () => {
  const navigation = useNavigation<CreateContactScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.reducer.contacts);
  const user = useAppSelector((state: any) => state.reducer.user);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

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

  const handleDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (contactToDelete && user?.userId) {
      dispatch(deleteContact(contactToDelete, user.userId));
    }
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const renderRightActions = (contactId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(contactId)}
      >
        <Icon name="delete" size={24} color={Colors.Error_Red} />
      </TouchableOpacity>
    );
  };

  const renderContactItem = ({ item, index }: ListRenderItemInfo<Contact>) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      rightThreshold={40}
    >
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
       {item.notes &&(
         <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>{t("note")}</Text>
          <Text style={styles.contactValue}>{item.notes}</Text>
        </View>
       )}
      </View>
    </Swipeable>
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
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("confirmDeleteContact")}</Text>
            <View style={styles.modalButtons}>
              <View style={{ width: "48%" }}>
                <CTAButton1
                  title={t("ok")}
                  submitHandler={handleDeleteConfirm}
                  btnStyle={{ height: 40 }}
                />
              </View>
              <View style={{ width: "48%" }}>
                <CTAButton1
                  title={t("cancel")}
                  submitHandler={handleDeleteCancel}
                  btnStyle={{ height: 40 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    paddingHorizontal: 13,
    borderRadius: 5,
    borderWidth: 1,
    height:45,
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
  deleteButton: {
    backgroundColor: Colors.Primary_01,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "80%",
    borderRadius: 8,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    ...Typography.f_16_nunito_bold,
    color: Colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: Colors.Primary_01,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    ...Typography.f_14_nunito_medium,
    color: Colors.white,
  },
});

export default Profile;
