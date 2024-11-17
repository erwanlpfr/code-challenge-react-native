import { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  name: string;
  price: number;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductCard = (props: Props) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.2]) }],
  }));

  const onPressIn = useCallback(() => {
    progress.value = withTiming(1);
  }, [progress]);

  const onPressOut = useCallback(() => {
    progress.value = withTiming(0);
  }, [progress]);

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={props.onPress}
      style={[styles.product, animatedStyle]}
    >
      <Text style={styles.text}>{props.name}</Text>
      <Text style={styles.text}>${props.price.toFixed(2)}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    color: "#ffffff",
  },
});
