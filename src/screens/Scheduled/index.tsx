import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import Colors from "../../utilities/constants/colors";
import { Typography } from "../../utilities/constants/constant.style";
import { colors } from "../../utilities/constants";
import { AddPhoto } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ScheduledScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Day = {
  day: string;
  number: number;
};

const Scheduled: React.FC = () => {
  const navigation = useNavigation<ScheduledScreenNavigationProp>();
  const { t } = useTranslation();

  const days: Day[] = [
    { day: t("days.Fr"), number: 11 },
    { day: t("days.Sa"), number: 12 },
    { day: t("days.Su"), number: 11 },
    { day: t("days.Su"), number: 13 },
    { day: t("days.Mo"), number: 14 },
    { day: t("days.Tu"), number: 15 },
    { day: t("days.We"), number: 16 },
    { day: t("days.Th"), number: 17 },
    { day: t("days.Fr"), number: 11 },
  ];

  const properties = t("properties", { returnObjects: true }) as string[];

  const renderDay: ListRenderItem<Day> = ({ item }) => (
    <View style={styles.dayItem}>
      <Text style={styles.dayText}>{item.day}</Text>
      <Text style={styles.numberText}>{item.number}</Text>
    </View>
  );

  const renderProperty: ListRenderItem<string> = ({ item }) => (
    <View style={styles.propertyRow}>
      <Text style={styles.propertyText}>{item}</Text>
      <View style={styles.slotsContainer}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={styles.slot} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container} >
      <Header title={t("schedulePropertyVisit")} />
        <TouchableOpacity
          onPress={() => navigation.navigate("AddSchedule")}
          activeOpacity={0.8}
          style={{ position: "absolute", right: 0, top: 35 }}
        >
          <AddPhoto height={30} width={30} />
        </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={days}
          keyExtractor={(_, index) => `day-${index}`}
          horizontal
          contentContainerStyle={styles.daysContainer}
          renderItem={renderDay}
          showsHorizontalScrollIndicator={false}
        />
        <View style={{ marginBottom: 40 }}>
          <FlatList
            data={properties}
            keyExtractor={(_, index) => `property-${index}`}
            renderItem={renderProperty}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: "5%",
  },
  daysContainer: {
    marginBottom: 10,
    marginTop: 30,
  },
  dayItem: {
    width: 38,
    height: 40,
    backgroundColor: Colors.Neutral_01,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 10,
  },
  dayText: {
    ...Typography.f_12_nunito_bold,
    color: Colors.PLACE_HOLDER,
  },
  numberText: {
    ...Typography.f_12_nunito_bold,
    color: Colors.black,
  },
  propertyRow: {
    marginBottom: 15,
  },
  propertyText: {
    ...Typography.f_14_nunito_bold,
    color: Colors.black,
    marginBottom: 5,
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slot: {
    width: 35,
    height: 35,
    backgroundColor: colors.Neutral_01,
    borderRadius: 4,
  },
});

export default Scheduled;
