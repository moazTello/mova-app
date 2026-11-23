import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '@/services/seller';
import { itemOrderId, SellerOrderItem } from '@/types/sellerOrder';

const KEY = ['seller-order-items'];

export function useSellerOrderItems() {
  return useQuery({ queryKey: KEY, queryFn: sellerService.orderItems });
}

export function useUpdateItemStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ item, status }: { item: SellerOrderItem; status: 'in_progress' | 'ready' }) =>
      sellerService.updateItemStatus(itemOrderId(item), item.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUploadProof() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ item, uris }: { item: SellerOrderItem; uris: string[] }) =>
      sellerService.uploadProof(itemOrderId(item), item.id, uris),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}