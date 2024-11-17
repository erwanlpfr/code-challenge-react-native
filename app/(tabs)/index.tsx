import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BasketProduct } from "@/components/basket/basket-product";
import { PressableButton } from "@/components/button/pressable-button";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardLoading } from "@/components/product/product-card-loading";
import { useBasket } from "@/hooks/basket/use-basket";
import { useNotifications } from "@/hooks/use-notifications";
import { getErrorMessage } from "@/libs/errors";
import { randomString } from "@/libs/random";
import { patchOrder, postOrder } from "@/services/orders/endpoints";
import { postPayment } from "@/services/payments/endpoints";
import { getProducts } from "@/services/products/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text } from "react-native";

export default function PosScreen() {
  const [orderId, setOrderId] = useState<string | null>(null);

  const { basket, add, reset, remove } = useBasket();
  const { show } = useNotifications();

  const {
    data: products,
    error: productsError,
    refetch: productsRefetch,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: [getProducts.name],
    queryFn: getProducts,
  });

  const { mutateAsync: createOrder } = useMutation({
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

  const { mutateAsync: payOrder } = useMutation({
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
        {products && !productsLoading ? (
          <FlatList
            data={products}
            onRefresh={() => productsRefetch()}
            refreshing={productsLoading}
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
        ) : (
          <FlatList
            data={Array(9)
              .fill(null)
              .map(() => ({ id: randomString() }))}
            renderItem={({ item }) => <ProductCardLoading key={item.id} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.basket}>
        <ThemedText type="title" style={styles.text}>
          Basket
        </ThemedText>

        <FlatList
          data={basket}
          renderItem={({ item }) => (
            <BasketProduct
              key={item.id}
              name={item.product.name}
              price={item.product.price_unit}
              onPress={() => remove(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />

        <ThemedText style={styles.text}>
          Total: ${basket.reduce((acc, item) => acc + item.product.price_unit, 0).toFixed(2)}
        </ThemedText>

        {orderId ? (
          <>
            <PressableButton
              title="Cancel Order"
              style={styles.cancelOrderButton}
              onPress={() => setOrderId(null)}
            />
            <PressableButton title="Pay" onPress={() => payOrder(orderId)} />
          </>
        ) : (
          <PressableButton
            title="Create Order"
            onPress={() => createOrder()}
            disabled={basket.length === 0}
          />
        )}
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
  basket: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1e1e1e",
  },
  text: {
    color: "#ffffff",
  },
  cancelOrderButton: {
    backgroundColor: "red",
  },
});
