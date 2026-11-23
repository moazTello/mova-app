import { api } from './api';
import { Cart } from '@/types/cart';

function unwrapCart(data: any): Cart {
  const cart = data?.cart ?? data?.data ?? data;
  return { ...cart, items: cart?.items ?? [] };
}

export const cartService = {
  get: async () => {
    const { data } = await api.get('/cart');
    return unwrapCart(data);
  },

  add: async (productId: string, quantity: number) => {
    const { data } = await api.post('/cart/items', { product_id: productId, quantity });
    return unwrapCart(data);
  },

  update: async (itemId: string, quantity: number) => {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
    return unwrapCart(data);
  },

  remove: async (itemId: string) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return unwrapCart(data);
  },

  clear: async () => {
    await api.delete('/cart');
  },
};