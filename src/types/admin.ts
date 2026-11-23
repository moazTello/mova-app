import { SellerInfo } from './user';
import { Order } from './order';

export type AdminOrder = Order & {
  customer?: { id: string; name: string; email?: string; phone_number?: string | null };
  user?: { id: string; name: string; email?: string; phone_number?: string | null };
};

/** الزبون ممكن يجي باسم customer أو user */
export const orderCustomer = (o: AdminOrder) => o.customer ?? o.user;
/** شكل موحّد للتاجر بغض النظر عن شكل الـ response */
export type PendingSeller = {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt?: string;
  info: Partial<SellerInfo>;
};