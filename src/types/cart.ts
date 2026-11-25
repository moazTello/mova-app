import { ProductOption } from './product';

export type CartProduct = {
  id: string;
  name: string;
  /** سعر الزبون (مع هامش المنصة) */
  price: string | number;
  stock?: number;
  is_active?: boolean;
  image: string | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
  option: ProductOption | null;
  subtotal: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total_price: number;
};