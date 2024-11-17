import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ThemedView } from "../ThemedView";

export const OrderLoadingCard = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
  }));

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1250 }), -1, true);

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <Animated.View style={animatedStyle}>
      <ThemedView style={styles.orderItem}>
        <View style={styles.container}>
          <View style={styles.icon} />
          <View style={styles.section} />
        </View>

        <View style={styles.container}>
          <View style={styles.icon} />
          <View style={styles.section} />
        </View>

        <View style={styles.container}>
          <View style={styles.icon} />
          <View style={styles.section} />
        </View>
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    gap: 5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  section: {
    flex: 1,
    height: 25,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  icon: {
    width: 25,
    backgroundColor: "gray",
    borderRadius: 5,
  },
});
