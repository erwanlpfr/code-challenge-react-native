import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setStringAsync } from "expo-clipboard";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { PressableButton } from "../button/pressable-button";

interface Props {
  id: string;
  created_at: string;
  amount: number;
  status: string;
}

export const OrderCard = (props: Props) => {
  const onCopyPress = useCallback(() => {
    setStringAsync(props.id);
  }, [props.id]);

  return (
    <ThemedView style={styles.orderItem}>
      <View style={styles.section}>
        <Entypo name="grid" size={24} color="black" />
        <ThemedText type="subtitle">
          Order of {new Date(props.created_at).toDateString()}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <MaterialIcons name="price-check" size={24} color="black" />
        <ThemedText>{props.amount}$</ThemedText>
      </View>

      <View
        style={[
          styles.label,
          props.status === "completed" && { backgroundColor: "green" },
          props.status === "cancelled" && { backgroundColor: "red" },
          props.status === "pending" && { backgroundColor: "orange" },
        ]}
      >
        <Text>{props.status}</Text>
      </View>

      <PressableButton title="Share" onPress={onCopyPress} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    gap: 5,
    flex: 1,
  },
  section: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
  },
  labelText: {
    color: "white",
  },
});
