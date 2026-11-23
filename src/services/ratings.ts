import { api } from './api';
import { Rating } from '@/types/rating';
import { unwrapList } from '@/utils/unwrap';

export const ratingsService = {
  list: async (productId: string) => {
    const { data } = await api.get(`/products/${productId}/ratings`);
    return unwrapList<Rating>(data, 'ratings');
  },

  rate: async (productId: string, rating: number, review: string) => {
    const { data } = await api.post(`/products/${productId}/rate`, { rating, review });
    return data;
  },

  remove: async (productId: string) => {
    await api.delete(`/products/${productId}/rate`);
  },
};