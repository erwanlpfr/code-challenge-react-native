import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCard } from "@/components/product/product-card";
import { useBasket } from "@/hooks/basket/use-basket";
import { useNotifications } from "@/hooks/use-notifications";
import { getErrorMessage } from "@/libs/errors";
import { patchOrder, postOrder } from "@/services/orders/endpoints";
import { postPayment } from "@/services/payments/endpoints";
import { getProducts } from "@/services/products/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function PosScreen() {
  const [orderId, setOrderId] = useState<string | null>(null);

  const { basket, add, reset } = useBasket();
  const { show } = useNotifications();

  const {
    data: products,
    error: productsError,
    refetch: productsRefetch,
  } = useQuery({
    queryKey: [getProducts.name],
    queryFn: getProducts,
  });

  const { mutate: createOrder } = useMutation({
    mutationFn: () =>
      postOrder({
        total: basket.reduce((acc, { product }) => acc + product.price_unit, 0),
      }),
    onSuccess: (order) => {
      setOrderId(order.id);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      show(message.title, message.message, "error");
      setOrderId(null);
    },
  });

  const { mutate: payOrder } = useMutation({
    mutationFn: async (orderId: string) => {
      const payment = await postPayment({
        order_id: orderId,
        amount: basket.reduce((acc, { product }) => acc + product.price_unit, 0),
      });

      await patchOrder(payment.order_id, {
        status: "completed",
      });
    },
    onSuccess: () => {
      reset();
      setOrderId(null);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      show(message.title, message.message, "error");
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        {productsError && (
          <>
            <Text>We are sorry, our service is currently unavailable.</Text>
            <Button title="Try again" onPress={() => productsRefetch()} />
          </>
        )}
        <FlatList
          data={products}
          renderItem={({ item }) => {
            return (
              <ProductCard
                name={item.name}
                price={item.price_unit * (item.vat_rate + 1)}
                onPress={() => add(item)}
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

        {basket.map((item) => (
          <ThemedView key={item.id} style={styles.basketItem}>
            <Text style={styles.text}>{item.product.name}</Text>
            <Text style={styles.text}>${item.product.price_unit}</Text>
          </ThemedView>
        ))}

        <ThemedText style={styles.text}>
          Total: ${basket.reduce((acc, item) => acc + item.product.price_unit, 0).toFixed(2)}
        </ThemedText>

        <TouchableOpacity style={styles.button} onPress={() => createOrder()}>
          <ThemedText style={styles.buttonText}>Create Order</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !orderId && { backgroundColor: "#555" }]}
          onPress={() => orderId && payOrder(orderId)}
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
