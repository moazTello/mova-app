import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin';

import { UserFilters } from '@/services/admin';

export function useAdminUsers(filters: UserFilters) {
  return useInfiniteQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: ({ pageParam }) => adminService.users(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta && last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
  });
}

export function useAdminUser(id?: string) {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminService.user(id!),
    enabled: !!id,
  });
}

export function useUserTransactions(id?: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'user', id, 'transactions'],
    queryFn: () => adminService.userTransactions(id!),
    enabled: !!id && enabled,
  });
}

function useUserMutation<V>(userId: string, fn: (vars: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'user', userId] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export const useSetUserStatus = (userId: string) =>
  useUserMutation(userId, (active: boolean) => adminService.setUserStatus(userId, active));

export const useClearBalance = (userId: string) =>
  useUserMutation(userId, (note: string) => adminService.clearBalance(userId, note));

export function usePendingSellers() {
  return useQuery({ queryKey: ['admin', 'pending-sellers'], queryFn: adminService.pendingSellers });
}

export function useReviewSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'approved' | 'rejected' }) =>
      adminService.reviewSeller(userId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-sellers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useAdminOrders() {
  return useInfiniteQuery({
    queryKey: ['admin', 'orders'],
    queryFn: ({ pageParam }) => adminService.orders(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta && last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
  });
}

export function useAdminOrder(id?: string) {
  return useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminService.order(id!),
    enabled: !!id,
  });
}

/** بعد أي تعديل على طلب: منحدّث الطلب والقائمة */
function useOrderMutation<V>(orderId: string, fn: (vars: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

export const useReviewReceipt = (orderId: string) =>
  useOrderMutation(orderId, (status: 'approved' | 'rejected') => adminService.reviewReceipt(orderId, status));

export const useMarkDelivered = (orderId: string) =>
  useOrderMutation(orderId, (itemId: string) => adminService.markDelivered(orderId, itemId));

export const useAdminCancelOrder = (orderId: string) =>
  useOrderMutation(orderId, () => adminService.cancelOrder(orderId));

function useCategoryMutation<V>(fn: (vars: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    // الفئات العامة بتتحدّث عند الكل (الزبون والتاجر)
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export const useCreateCategory = () =>
  useCategoryMutation((p: { name: string; icon: string }) => adminService.createCategory(p));

export const useUpdateCategory = () =>
  useCategoryMutation(({ id, ...p }: { id: string; name: string; icon: string }) =>
    adminService.updateCategory(id, p)
  );

export const useDeleteCategory = () => useCategoryMutation((id: string) => adminService.deleteCategory(id));

export function useMarkup() {
  return useQuery({ queryKey: ['admin', 'markup'], queryFn: adminService.markup });
}

export function useUpdateMarkup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: number) => adminService.updateMarkup(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'markup'] });
      qc.invalidateQueries({ queryKey: ['products'] }); // أسعار الزبون اتغيّرت
    },
  });
}

export function useFinancialReport(from: string, to: string) {
  return useQuery({
    queryKey: ['admin', 'report', from, to],
    queryFn: () => adminService.financialReport(from, to),
  });
}