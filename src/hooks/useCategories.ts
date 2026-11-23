import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.list,
  });
}