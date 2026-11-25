import { Href } from 'expo-router';
import { AppNotification } from '@/types/notification';
import { UserRole } from '@/types/user';

export function notificationText(n: AppNotification) {
  const d = n.data ?? {};
  const title = d.title ?? d.subject ?? n.type?.split('\\').pop() ?? '';
  const body = d.message ?? d.body ?? d.text ?? '';
  return { title, body };
}

/**
 * إذا الإشعار مرتبط بطلب، منفتح الطلب بالشاشة المناسبة لدور المستخدم:
 * شاشة الزبون (/orders/[id]) بترجع 403 للإدارة والتاجر لأنهم مو أصحاب الطلب.
 */
export function notificationLink(n: AppNotification, role?: UserRole): Href | null {
  const orderId = n.data?.order_id;
  if (!orderId) return null;

  const id = String(orderId);
  switch (role) {
    case 'admin':
      return { pathname: '/admin/orders/[id]', params: { id } };
    case 'seller':
      return '/seller/orders';
    case 'customer':
      return { pathname: '/orders/[id]', params: { id } };
    default:
      return null;
  }
}