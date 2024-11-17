import React, { useCallback } from "react";
import { Button, FlatList, StyleSheet, Text, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OrderCard } from "@/components/orders/order-card";
import { OrderLoadingCard } from "@/components/orders/order-loading-card";
import { randomString } from "@/libs/random";
import { getOrders } from "@/services/orders/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();

  const {
    data: orders,
    error,
    refetch: ordersRefetch,
    isLoading,
  } = useQuery({
    queryKey: [getOrders.name],
    queryFn: getOrders,
  });

  /**
   * Responsible for refetching the orders when the screen is focused.
   */
  useFocusEffect(
    useCallback(() => {
      ordersRefetch();
    }, [ordersRefetch]),
  );

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

      {orders ? (
        <FlatList
          // Changing numColumns on the fly is not supported
          key={width > 600 ? 2 : 1}
          data={orders}
          keyExtractor={(item) => item.id}
          onRefresh={() => ordersRefetch()}
          refreshing={isLoading}
          numColumns={width > 600 ? 2 : 1}
          renderItem={({ item }) => (
            <OrderCard
              key={item.id}
              id={item.id}
              created_at={item.created_at}
              amount={item.amount_total}
              status={item.status}
            />
          )}
        />
      ) : (
        <FlatList
          data={Array(9)
            .fill(null)
            .map(() => ({ id: randomString() }))}
          keyExtractor={(item) => item.id}
          renderItem={() => <OrderLoadingCard />}
        />
      )}
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
});
