/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
export default function counter() {
  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    console.log(result);
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hello im the notification",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings",
      );
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={scheduleNotification} style={styles.button}>
        <Text style={styles.buttonText}>Request Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
