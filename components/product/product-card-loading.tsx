import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const Product = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
  }));

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), 1000, true);

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return <Animated.View style={[styles.product, animatedStyle]} />;
};

const styles = StyleSheet.create({
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
  },
});
