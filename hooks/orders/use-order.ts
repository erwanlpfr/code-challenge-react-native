import { getErrorMessage } from "@/libs/errors";
import { createOfflineOrder, getOfflineOrder, removeOfflineOrder } from "@/libs/orders/offline";
import { type Order, postOrder } from "@/services/orders/endpoints";
import type { Product } from "@/services/products/endpoints";
import { useMutation } from "@tanstack/react-query";
import { addNetworkStateListener, getNetworkStateAsync } from "expo-network";
import { useCallback, useEffect, useState } from "react";
import { useNotifications } from "../use-notifications";

type InternalOrder =
  | {
      offline: true;
    }
  | {
      offline: false;
      order: Order;
    };

export const useOrder = () => {
  const [fetchingOrder, setFetchingOrder] = useState(false);
  const [order, setOrder] = useState<InternalOrder>();

  const { show } = useNotifications();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (total: number) =>
      postOrder({
        total,
      }),
    onSuccess: (order) => {
      setOrder({
        offline: false,
        order,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      show(message.title, message.message, "error");
    },
  });

  const create = useCallback(
    async (products: Product[]) => {
      const networkState = await getNetworkStateAsync();

      if (networkState.isInternetReachable) {
        await mutateAsync(products.reduce((acc, item) => acc + item.price_unit, 0));
      } else {
        createOfflineOrder(products);

        setOrder({
          offline: true,
        });
      }
    },
    [mutateAsync],
  );

  const retry = useCallback(async () => {
    setFetchingOrder(true);
    const products = await getOfflineOrder();

    await removeOfflineOrder();

    setFetchingOrder(false);

    create(products);
  }, [create]);

  const reset = useCallback(() => {
    setOrder(undefined);
  }, []);

  /**
   * Side effect to check if there are offline orders.
   * It will retry them if the user is connected to the internet.
   */
  useEffect(() => {
    retry();

    const subscription = addNetworkStateListener(async ({ isInternetReachable }) => {
      if (isInternetReachable) {
        retry();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [retry]);

  return {
    order,
    fetchingOrder,
    isPending,
    create,
    retry,
    reset,
  };
};
