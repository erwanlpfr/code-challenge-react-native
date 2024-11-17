import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  name: string;
  price: number;
  onPress?: () => void;
}

export const BasketProduct = (props: Props) => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <TouchableOpacity style={[styles.basketItem, { backgroundColor }]} onPress={props.onPress}>
      <Text style={[styles.text, { color: textColor }]}>{props.name}</Text>
      <Text style={[styles.text, { color: textColor }]}>${props.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  basketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
    backgroundColor: "white",
  },
  text: {
    color: "black",
  },
});
