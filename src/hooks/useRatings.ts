import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingsService } from '@/services/ratings';

export function useRatings(productId?: string) {
  return useQuery({
    queryKey: ['ratings', productId],
    queryFn: () => ratingsService.list(productId!),
    enabled: !!productId,
  });
}

/** بعد أي تغيير: التقييمات، المنتج (المتوسط)، والقوائم (النجوم بالكروت) */
function useRatingMutation<V>(productId: string, fn: (vars: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ratings', productId] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export const useRateProduct = (productId: string) =>
  useRatingMutation(productId, ({ rating, review }: { rating: number; review: string }) =>
    ratingsService.rate(productId, rating, review)
  );

export const useDeleteRating = (productId: string) =>
  useRatingMutation(productId, () => ratingsService.remove(productId));