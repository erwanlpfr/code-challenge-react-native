import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCard } from "@/components/product/product-card";
import { type Product, getProducts } from "@/services/products/endpoints";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function PosScreen() {
  const [basket, setBasket] = useState<Product[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { data: products } = useQuery({
    queryKey: [getProducts.name],
    queryFn: getProducts,
  });

  const createOrder = useCallback(() => {
    // postOrdersMutation.mutate({
    //   total: basket.reduce((acc, item) => acc + item.price_unit, 0),
    // });
  }, [basket]);

  const payOrder = useCallback(() => {}, [orderId, basket]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        <FlatList
          data={products}
          renderItem={({ item }) => {
            return (
              <ProductCard
                name={item.name}
                price={item.price_unit * (item.vat_rate + 1)}
                onPress={() => setBasket((prev) => [...prev, item])}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </ThemedView>

      <ThemedView style={styles.basket}>
        <ThemedText type="title" style={styles.text}>
          Basket
        </ThemedText>

        {basket.map((item, index) => (
          <ThemedView key={item.id} style={styles.basketItem}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>${item.price}</Text>
          </ThemedView>
        ))}

        <ThemedText style={styles.text}>
          Total: ${basket.reduce((acc, item) => acc + item.price_unit, 0)}
        </ThemedText>

        <TouchableOpacity style={styles.button} onPress={createOrder}>
          <ThemedText style={styles.buttonText}>Create Order</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !orderId && { backgroundColor: "#555" }]}
          onPress={payOrder}
          disabled={!orderId}
        >
          <ThemedText style={styles.buttonText}>Pay</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  productGrid: {
    flex: 2,
    padding: 10,
  },
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
  },
  basket: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1e1e1e",
  },
  basketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
  },
  text: {
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#173829",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
