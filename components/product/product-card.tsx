import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  name: string;
  price: number;
  onPress: () => void;
}

export const ProductCard = (props: Props) => {
  return (
    <TouchableOpacity style={styles.product} onPress={props.onPress}>
      <Text style={styles.text}>{props.name}</Text>
      <Text style={styles.text}>${props.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
  },
});
