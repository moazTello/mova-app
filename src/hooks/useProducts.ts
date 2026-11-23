import { useQuery } from '@tanstack/react-query';
import { productsService, ProductFilters } from '@/services/products';

export function useProducts(filters: ProductFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.list(filters),
    enabled,
  });
}
export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.get(id!),
    enabled: !!id,
  });
}