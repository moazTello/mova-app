import { Href } from 'expo-router';
import { AppNotification } from '@/types/notification';

export function notificationText(n: AppNotification) {
  const d = n.data ?? {};
  const title = d.title ?? d.subject ?? n.type?.split('\\').pop() ?? '';
  const body = d.message ?? d.body ?? d.text ?? '';
  return { title, body };
}

/** إذا الإشعار مرتبط بطلب، منفتح الطلب */
export function notificationLink(n: AppNotification): Href | null {
  const orderId = n.data?.order_id;
  if (orderId) return { pathname: '/orders/[id]', params: { id: String(orderId) } };
  return null;
}