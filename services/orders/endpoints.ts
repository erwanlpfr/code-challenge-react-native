import { kanplaFetch } from "../client";

type PostOrdersData = {
  total: number;
};

type Order = {
  id: string;
};

export const postOrder = async (data: PostOrdersData) => {
  const response = await kanplaFetch("orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const order = (await response.json()) as Order;

  return order;
};

interface PatchOrderData {
  status: "completed";
}

export const patchOrder = async (id: string, data: PatchOrderData) => {
  const response = await kanplaFetch(`orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const order = (await response.json()) as Order;

  return order;
};
