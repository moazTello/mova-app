import { api } from './api';
import { unwrapList } from '@/utils/unwrap';
import { PendingSeller } from '@/types/admin';
import { AdminOrder } from '@/types/admin';
import { User, UserRole } from '@/types/user';
import { Transaction } from '@/types/balance';
import { Category } from '@/types/category';
function normalizeSeller(raw: any): PendingSeller {
  // الحالة 1: مستخدم وجوّاته seller_info
  if (raw.seller_info || raw.email) {
    return {
      userId: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone_number,
      createdAt: raw.created_at,
      info: raw.seller_info ?? {},
    };
  }
  // الحالة 2: بيانات متجر وجوّاتها user
  return {
    userId: raw.user?.id ?? raw.user_id,
    name: raw.user?.name ?? '',
    email: raw.user?.email ?? '',
    phone: raw.user?.phone_number,
    createdAt: raw.created_at,
    info: raw,
  };
}

export type UserFilters = {
  role?: UserRole;
  search?: string;
  is_active?: '1' | '0';
};

export const adminService = {
  pendingSellers: async () => {
    const { data } = await api.get('/admin/sellers/pending');
    return unwrapList<any>(data, 'sellers').map(normalizeSeller);
  },

  reviewSeller: async (userId: string, status: 'approved' | 'rejected') => {
    const { data } = await api.patch(`/admin/sellers/${userId}/review`, { status });
    return data;
  },
  orders: async (page = 1) => {
  const { data } = await api.get('/admin/orders', { params: { page } });
  return {
    orders: unwrapList<AdminOrder>(data, 'orders'),
    meta: data.meta as { current_page: number; last_page: number } | undefined,
  };
},

order: async (id: string) => {
  const { data } = await api.get(`/admin/orders/${id}`);
  return (data.order ?? data.data ?? data) as AdminOrder;
},

reviewReceipt: async (id: string, receipt_status: 'approved' | 'rejected') => {
  const { data } = await api.patch(`/admin/orders/${id}/review`, { receipt_status });
  return data;
},

markDelivered: async (orderId: string, itemId: string) => {
  const { data } = await api.patch(`/admin/orders/${orderId}/items/${itemId}/delivered`);
  return data;
},

cancelOrder: async (id: string) => {
  const { data } = await api.patch(`/admin/orders/${id}/cancel`);
  return data;
},

users: async (filters: UserFilters, page = 1) => {
  const { data } = await api.get('/admin/users', { params: { ...filters, page } });
  return {
    users: unwrapList<User>(data, 'users'),
    meta: data.meta as { current_page: number; last_page: number } | undefined,
  };
},

user: async (id: string) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return (data.user ?? data.data ?? data) as User;
},

setUserStatus: async (id: string, is_active: boolean) => {
  const { data } = await api.patch(`/admin/users/${id}/status`, { is_active });
  return data;
},

userTransactions: async (id: string) => {
  const { data } = await api.get(`/admin/users/${id}/transactions`);
  return unwrapList<Transaction>(data?.data ?? data, 'transactions');
},

clearBalance: async (id: string, note: string) => {
  const { data } = await api.patch(`/admin/users/${id}/balance/clear`, { note });
  return data;
},
createCategory: async (payload: { name: string; icon: string }) => {
  const { data } = await api.post('/admin/categories', payload);
  return (data.category ?? data.data ?? data) as Category;
},

updateCategory: async (id: string, payload: { name: string; icon: string }) => {
  const { data } = await api.patch(`/admin/categories/${id}`, payload);
  return data;
},

deleteCategory: async (id: string) => {
  await api.delete(`/admin/categories/${id}`);
},

markup: async () => {
  const { data } = await api.get('/admin/settings/markup');
  const root = data?.data ?? data;
  return Number(root?.markup_percentage ?? root?.value ?? 0);
},

updateMarkup: async (markup_percentage: number) => {
  const { data } = await api.patch('/admin/settings/markup', { markup_percentage });
  return data;
},

financialReport: async (from: string, to: string) => {
  const { data } = await api.get('/admin/reports/financial', { params: { from, to } });
  return (data?.report ?? data?.data ?? data) as Record<string, any>;
},
};