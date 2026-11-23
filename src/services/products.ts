import { api } from './api';
import { Product } from '@/types/product';
import { unwrapList } from '@/utils/unwrap';

export type ProductFilters = {
  category_id?: string;
  search?: string;
};

export const productsService = {
  list: async (filters: ProductFilters = {}) => {
    const { data } = await api.get('/products', { params: filters });
    return unwrapList<Product>(data, 'products');
  },
  get: async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return (data.product ?? data.data ?? data) as Product;
},
};