import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

interface Props {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => unknown;
  style?: ViewStyle;
}

export const PressableButton = (props: Props) => {
  const [internalLoading, setInternalLoading] = useState(false);

  /**
   * If the onPress is async, we need to handle the loading state.
   * It allows the button to display the indicator as it was passed as a prop.
   */
  const onPress = useCallback(async () => {
    setInternalLoading(true);
    try {
      await props.onPress();
    } finally {
      setInternalLoading(false);
    }
  }, [props.onPress]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        props.style,
        props.disabled && styles.disabledButton,
        pressed && styles.pressedButton,
      ]}
      onPress={onPress}
      disabled={props.disabled || props.loading || internalLoading}
    >
      {props.loading || internalLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={1} ellipsizeMode="tail">
          {props.title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#173829",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  pressedButton: {
    opacity: 0.8,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
  },
});
