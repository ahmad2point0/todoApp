import {
  StyleSheet,
  TextInput,
  FlatList,
  View,
  Text,
  LayoutAnimation,
} from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useEffect, useState } from "react";
import { getFromStorage, setToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";
const StorageKey = "shopping-list";
type ShoppingListItems = {
  id: string;
  item: string;
  completedAtTimestamp?: number;
  lastUpdateTimestamp: number;
};
const initialItems: ShoppingListItems[] = [];
export default function App() {
  const [shoppingList, setShoppingList] = useState(initialItems);
  const [value, setValue] = useState<string>();
  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(StorageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };
    fetchInitial();
  }, []);
  const handleOnDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShoppingList(newShoppingList);
  };
  const handleOnToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdateTimestamp: Date.now(),
        };
      } else {
        return item;
      }
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
  };
  const handleOnsubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: new Date().toISOString(),
          item: value,
          lastUpdateTimestamp: Date.now(),
        },
        ...shoppingList,
      ];
      setToStorage(StorageKey, newShoppingList);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingList(newShoppingList);
      setValue(undefined);
    }
  };
  return (
    <FlatList
      ListHeaderComponent={
        <TextInput
          placeholder="e.g Coffee"
          value={value}
          onChangeText={setValue}
          style={styles.InputText}
          onSubmitEditing={handleOnsubmit}
          returnKeyType="done"
        />
      }
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      data={orderShoppingList(shoppingList)}
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.item}
          onDelete={() => handleOnDelete(item.id)}
          onToggleComplete={() => handleOnToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>List is empty</Text>
        </View>
      }
    />
  );
}
function orderShoppingList(shoppingList: ShoppingListItems[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdateTimestamp - item1.lastUpdateTimestamp;
    }

    return 0;
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  InputText: {
    borderColor: theme.colorCerulean,
    borderWidth: 2,
    padding: 12,
    fontSize: 18,
    borderRadius: 50,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
