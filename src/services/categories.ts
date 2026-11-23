import { api } from './api';
import { Category } from '@/types/category';
import { unwrapList } from '@/utils/unwrap';

export const categoriesService = {
  list: async () => {
    const { data } = await api.get('/categories');
    return unwrapList<Category>(data, 'categories');
  },
};