/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function counter() {
  return (
    <View style={styles.container}>
      <Text>counter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
