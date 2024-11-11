import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState } from "react";
type ShoppingListItems = {
  id: string;
  item: string;
};
const initialItems: ShoppingListItems[] = [
  { id: "1", item: "coffee" },
  { id: "2", item: "tea" },
  { id: "3", item: "bread" },
];
export default function App() {
  const [shoppingList, setShoppingList] = useState(initialItems);
  const [value, setValue] = useState<string>();
  const handleOnsubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toISOString(), item: value },
        ...shoppingList,
      ];
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
      data={shoppingList}
      renderItem={({ item }) => <ShoppingListItem name={item.item} />}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>List is empty</Text>
        </View>
      }
    />
  );
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
    borderColor: theme.colorWhite,
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
