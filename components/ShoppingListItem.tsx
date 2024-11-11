/* eslint-disable prettier/prettier */
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { theme } from "../theme";
type Props = {
  name: string;
  isCompleted?: boolean;
};
export default function ShoppingListItem({ name, isCompleted }: Props) {
  const handleOnPress = () => {
    Alert.alert(
      `Are you sure to delete this ${name}`,
      "This item will disappear permanently",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => console.log("Deleted"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };
  return (
    <View
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedItemContainer : undefined,
      ]}
    >
      <View style={styles.row}>
        <Feather
          name={isCompleted ? "check-circle" : "circle"}
          size={24}
          color={isCompleted ? theme.colorGreen : theme.colorCerulean}
        />
        <Text
          style={[
            styles.itemText,
            ,
            isCompleted ? styles.completedItemText : undefined,
          ]}
        >
          {name}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleOnPress}
      >
        <AntDesign
          name="closecircle"
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "300",
    marginLeft: 8,
    flex: 1,
  },
  button: {
    padding: 8,
    borderRadius: 6,
  },
  completedItemContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  completedItemText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGrey,
    color: theme.colorGrey,
  },
});
