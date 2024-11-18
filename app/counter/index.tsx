/* eslint-disable react-hooks/rules-of-hooks */
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { useEffect, useState, useRef } from "react";
import { isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, setToStorage } from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
export const countdownStorageKey = "key-countdown";
export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};
type CountdownStatus = {
  isOverDue: boolean;
  Distance: ReturnType<typeof intervalToDuration>;
};
export default function counter() {
  const frequency = 14 * 24 * 60 * 60 * 1000;
  const ConfettiRef = useRef<any>();
  const [Status, setStatus] = useState<CountdownStatus>({
    isOverDue: false,
    Distance: {},
  });
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);
  const lastCompletedAt = countdownState?.completedAtTimestamps[0];
  useEffect(() => {
    const timeIntervalID = setInterval(() => {
      const timestamp = lastCompletedAt
        ? lastCompletedAt + frequency
        : Date.now();
      const isOverDue = isBefore(timestamp, Date.now());
      const Distance = intervalToDuration(
        isOverDue
          ? {
              end: Date.now(),
              start: timestamp,
            }
          : {
              start: Date.now(),
              end: timestamp,
            }
      );
      setStatus({ isOverDue, Distance });
    }, 1000);
    return () => {
      clearInterval(timeIntervalID);
    };
  }, [lastCompletedAt]);
  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    ConfettiRef?.current?.start();
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Car wash overdue!",
        },
        trigger: {
          seconds: frequency / 1000,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings"
      );
    }

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId
      );
    }
    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };

    setCountdownState(newCountdownState);
    await setToStorage(countdownStorageKey, newCountdownState);
  };

  return (
    <View
      style={[
        styles.container,
        Status.isOverDue ? styles.LateContainer : undefined,
      ]}
    >
      {!Status.isOverDue ? (
        <Text style={[styles.Heading]}>Next car wash is due</Text>
      ) : (
        <Text style={[styles.Heading, styles.whiteText]}>
          Next car wash is due
        </Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          textStyle={Status.isOverDue ? styles.whiteText : undefined}
          number={Status.Distance?.days ?? 0}
        />
        <TimeSegment
          unit="Hour"
          textStyle={Status.isOverDue ? styles.whiteText : undefined}
          number={Status.Distance?.hours ?? 0}
        />
        <TimeSegment
          unit="Minutes"
          textStyle={Status.isOverDue ? styles.whiteText : undefined}
          number={Status.Distance?.minutes ?? 0}
        />
        <TimeSegment
          unit="Seconds"
          textStyle={Status.isOverDue ? styles.whiteText : undefined}
          number={Status.Distance?.seconds ?? 0}
        />
      </View>
      <TouchableOpacity onPress={scheduleNotification} style={styles.button}>
        <Text style={styles.buttonText}>I've done the thing!</Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={ConfettiRef}
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
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
  LateContainer: {
    backgroundColor: theme.colorRed,
  },
  Heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  whiteText: {
    color: theme.colorWhite,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
});
