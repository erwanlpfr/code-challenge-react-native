import React from "react";
import { Button, FlatList, StyleSheet, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getOrders } from "@/services/orders/endpoints";
import { useQuery } from "@tanstack/react-query";

export default function TabTwoScreen() {
  const {
    data: orders,
    error,
    refetch: ordersRefetch,
  } = useQuery({
    queryKey: [getOrders.name],
    queryFn: getOrders,
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Paid Orders</ThemedText>
      </ThemedView>
      {error && (
        <>
          <Text>We are sorry, our service is currently unavailable.</Text>
          <Button title="Try again" onPress={() => ordersRefetch()} />
        </>
      )}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItem}>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.created_at}</ThemedText>
            <ThemedText>{item.amount}$</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
