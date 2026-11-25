import { BalanceInfo, Transaction } from "@/types/balance";
import { Product } from "@/types/product";
import { SellerOrderItem } from "@/types/sellerOrder";
import { unwrapList } from "@/utils/unwrap";
import { fileFromUri } from "@/utils/upload";
import { api } from "./api";
export type ProductOptionInput = { option_name: string; option_value: string };

export type CreateProductPayload = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
  options: ProductOptionInput[];
  images: string[]; // uris محلية
};

export type SellerInfoPayload = {
  shop_name: string;
  major: string;
  shop_location: string;
  description: string;
  payment_url: string;
  id_front_image?: string; // uri محلي، بس إذا تغيّرت الصورة
  id_back_image?: string;
};

export const sellerService = {
  /**
   * approvedEdit: تاجر مقبول عم يعدّل بيانات متجره → PATCH /seller/profile
   * غير هيك (أول مرة أو مرفوض وعم يعيد الإرسال) → POST /seller/info
   * (ما في route PATCH على /seller/info، فـ _method=PATCH هناك كان يرجع 405)
   */
  submitInfo: async (payload: SellerInfoPayload, approvedEdit: boolean) => {
    const form = new FormData();
    form.append("shop_name", payload.shop_name);
    form.append("major", payload.major);
    form.append("shop_location", payload.shop_location);
    form.append("description", payload.description);
    form.append("payment_url", payload.payment_url);
    if (payload.id_front_image)
      form.append("id_front_image", fileFromUri(payload.id_front_image));
    if (payload.id_back_image)
      form.append("id_back_image", fileFromUri(payload.id_back_image));

    // PHP ما بيقرا الملفات مع PATCH، فمنبعت POST ومنقول لـ Laravel إنو PATCH
    if (approvedEdit) form.append("_method", "PATCH");

    const { data } = await api.post(approvedEdit ? "/seller/profile" : "/seller/info", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  products: async () => {
    const { data } = await api.get("/seller/products");
    return unwrapList<Product>(data, "products");
  },

  updateProduct: async (
    id: string,
    payload: {
      name?: string;
      description?: string;
      price?: string | number;
      stock?: string | number;
      category_id?: string;
      is_active?: boolean;
    },
  ) => {
    const { data } = await api.patch(`/seller/products/${id}`, payload);
    return (data.product ?? data.data ?? data) as Product;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/seller/products/${id}`);
  },
  createProduct: async (p: CreateProductPayload) => {
    const form = new FormData();
    form.append("name", p.name);
    form.append("description", p.description);
    form.append("price", p.price);
    form.append("stock", p.stock);
    form.append("category_id", p.category_id);

    // Laravel بيفهم المصفوفات بهالشكل: options[0][option_name]
    p.options.forEach((o, i) => {
      form.append(`options[${i}][option_name]`, o.option_name);
      form.append(`options[${i}][option_value]`, o.option_value);
    });

    p.images.forEach((uri) => form.append("images[]", fileFromUri(uri)));

    const { data } = await api.post("/seller/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return (data.product ?? data.data ?? data) as Product;
  },
  addOption: async (productId: string, option: ProductOptionInput) => {
    const { data } = await api.post(
      `/seller/products/${productId}/options`,
      option,
    );
    return data;
  },

  deleteOption: async (productId: string, optionId: string) => {
    await api.delete(`/seller/products/${productId}/options/${optionId}`);
  },

  addImages: async (productId: string, uris: string[]) => {
    const form = new FormData();
    uris.forEach((uri) => form.append("images[]", fileFromUri(uri)));
    const { data } = await api.post(
      `/seller/products/${productId}/images`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
  orderItems: async () => {
    const { data } = await api.get("/seller/order-items");
    return unwrapList<SellerOrderItem>(data, "items");
  },

  updateItemStatus: async (
    orderId: string,
    itemId: string,
    status: "in_progress" | "ready",
  ) => {
    const { data } = await api.patch(
      `/seller/orders/${orderId}/items/${itemId}/status`,
      { status },
    );
    return data;
  },

  uploadProof: async (orderId: string, itemId: string, uris: string[]) => {
    const form = new FormData();
    uris.forEach((uri) => form.append("images[]", fileFromUri(uri)));
    const { data } = await api.post(
      `/seller/orders/${orderId}/items/${itemId}/proof`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
  balance: async (): Promise<BalanceInfo> => {
    const { data } = await api.get("/seller/profile/balance");
    const root = data?.data ?? data;
    return {
      balance: Number(root?.balance ?? 0),
      transactions: unwrapList<Transaction>(root, "transactions"),
    };
  },
  addVideos: async (productId: string, uris: string[]) => {
    const form = new FormData();
    uris.forEach((uri) => form.append("videos[]", fileFromUri(uri)));
    const { data } = await api.post(
      `/seller/products/${productId}/videos`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // الفيديو بياخد وقت
      },
    );
    return data;
  },
};
