import type { Product } from "@/services/products/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomString } from "../random";

export const createOfflineOrder = async (products: Product[]) => {
  const id = randomString();
  await AsyncStorage.setItem("offline-order", JSON.stringify(products));

  return id;
};

export const getOfflineOrder = async () => {
  const products = await AsyncStorage.getItem("offline-order");

  return products ? JSON.parse(products) : [];
};

export const removeOfflineOrder = async () => {
  await AsyncStorage.removeItem("offline-order");
};
