import { randomString } from "@/libs/random";
import type { Product } from "@/services/products/endpoints";
import { useCallback, useState } from "react";

interface Basket {
  id: string;
  product: Product;
}

export const useBasket = () => {
  const [basket, setBasket] = useState<Basket[]>([]);

  const add = useCallback((product: Product) => {
    setBasket((prev) => [...prev, { id: randomString(), product }]);
  }, []);

  const remove = useCallback((id: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reset = useCallback(() => {
    setBasket([]);
  }, []);

  return {
    basket,
    add,
    remove,
    reset,
  };
};
