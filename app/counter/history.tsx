/* eslint-disable react-hooks/rules-of-hooks */
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { countdownStorageKey } from ".";
import { PersistedCountdownState } from ".";
import { format } from "date-fns";
import { theme } from "../../theme";
import { getFromStorage } from "../../utils/storage";
const fullDateFormat = `LLL d yyyy,h:mm aaa`;

export default function history() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamps}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {format(item, fullDateFormat)}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
    />
  );
}
const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    marginHorizontal: 8,
    marginBottom: 8,
    alignItems: "center",
    backgroundColor: theme.colorLightGrey,
    padding: 12,
    borderRadius: 6,
  },
  listItemText: {
    fontSize: 18,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
