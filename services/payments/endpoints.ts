import { kanplaFetch } from "../client";

interface PatchPaymentData {
  order_id: string;
  amount: number;
}

type Order = {
  order_id: string;
};

export const patchPayment = async (data: PatchPaymentData) => {
  const response = await kanplaFetch("payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const order = (await response.json()) as Order;

  return order;
};
