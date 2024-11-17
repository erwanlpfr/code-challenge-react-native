import { useCallback } from "react";
import { Alert, Vibration } from "react-native";

export const useNotifications = () => {
  const show = useCallback((titre: string, message: string, type: "success" | "error") => {
    if (type === "error") {
      Vibration.vibrate(125);
    }

    Alert.alert(titre, message);
  }, []);

  return {
    show,
  };
};
