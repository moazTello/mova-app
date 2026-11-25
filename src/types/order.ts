export type OrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_approved'
  | 'delivered'
  | 'cancelled'
  | (string & {});
export type ReceiptStatus = 'pending' | 'approved' | 'rejected' | null;

/** صورة إثبات تسليم رفعها التاجر (رابط موقّع مؤقت) */
export type DeliveryProof = { id: string; url: string; created_at?: string };

export type OrderItem = {
  id: string;
  status: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
  product: { id: string; name: string; image?: string | null };
  delivery_proofs?: DeliveryProof[];
};

export type Order = {
  id: string;
  status: OrderStatus;
  receipt_status: ReceiptStatus;
  receipt_image: string | null;
  total_price: string;
  delivery_address: string;
  items: OrderItem[];
  seller: { id: string; name: string; shop_name?: string };
  created_at: string;
};