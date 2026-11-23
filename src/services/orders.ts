import { Order } from "@/types/order";
import { fileFromUri } from "@/utils/upload";
import { api } from "./api";
export const ordersService = {
  /** بيرجع طلب لكل تاجر */
  create: async (deliveryAddress: string) => {
    const { data } = await api.post("/orders", {
      delivery_address: deliveryAddress,
    });
    return (data.orders ?? []) as Order[];
  },
  get: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return (data.order ?? data.data ?? data) as Order;
  },

  // uploadReceipt: async (id: string, uri: string) => {
  //   const name = uri.split("/").pop() ?? "receipt.jpg";
  //   const ext = name.split(".").pop()?.toLowerCase();
  //   const type = ext === "png" ? "image/png" : "image/jpeg";

  //   const form = new FormData();
  //   form.append("receipt_image", { uri, name, type } as any);

  //   const { data } = await api.post(`/orders/${id}/receipt`, form, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return data;
  // },
  uploadReceipt: async (id: string, uri: string) => {
    const form = new FormData();
    form.append("receipt_image", fileFromUri(uri));
    const { data } = await api.post(`/orders/${id}/receipt`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  list: async (page = 1) => {
    const { data } = await api.get("/orders", { params: { page } });
    return {
      orders: (data.orders ?? []) as Order[],
      meta: data.meta as {
        current_page: number;
        last_page: number;
        total: number;
      },
    };
  },

  cancel: async (id: string) => {
    const { data } = await api.patch(`/orders/${id}/cancel`);
    return data;
  },
};
