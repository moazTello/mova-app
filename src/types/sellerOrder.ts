import { DeliveryProof } from './order';

export type SellerItemStatus = 'pending' | 'in_progress' | 'ready' | 'delivered' | (string & {});

export type SellerOrderItem = {
  id: string;
  status: SellerItemStatus;
  quantity: number;
  unit_price?: string;
  subtotal?: number;
  seller_payout_amount?: string;
  payout_status?: string;
  product: { id: string; name: string; image?: string | null };
  delivery_proofs?: DeliveryProof[];
  order_id?: string;
  order?: {
    id: string;
    status?: string;
    receipt_status?: string | null;
    delivery_address?: string;
    created_at?: string;
  };
  created_at?: string;
};

/** رقم الطلب ممكن يجي مباشرة أو جوّا order */
export const itemOrderId = (item: SellerOrderItem) => item.order?.id ?? item.order_id ?? '';