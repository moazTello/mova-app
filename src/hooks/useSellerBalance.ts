import { useQuery } from '@tanstack/react-query';
import { sellerService } from '@/services/seller';

export function useSellerBalance() {
  return useQuery({ queryKey: ['seller-balance'], queryFn: sellerService.balance });
}