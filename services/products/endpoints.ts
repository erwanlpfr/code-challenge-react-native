import { kanplaFetch } from "../client";

export type Product = {
  id: string;
  name: string;
  price_unit: number;
  vat_rate: number;
};

export const getProducts = async () => {
  const response = await kanplaFetch("products");
  const products = (await response.json()) as Product[];

  return products;
};
