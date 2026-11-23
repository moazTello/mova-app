import { ProductOption } from './product';

export type CartProduct = {
  id: string;
  name: string;
  price: string | number;
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