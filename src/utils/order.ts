import { Colors } from "@/constants/theme";
import i18n from "@/i18n";
import { Order } from "@/types/order";
const CANCELLED = ["cancelled", "canceled", "cancled"];
export const isCancelled = (status: string) => CANCELLED.includes(status);
export function orderStatusLabel(order: Order): {
  label: string;
  color: string;
} {
  if (isCancelled(order.status))
    return { label: i18n.t("orderStatus.cancelled"), color: Colors.textMuted };
  if (order.status === "delivered")
    return { label: i18n.t("orderStatus.delivered"), color: Colors.primary };
  if (order.receipt_status === "approved")
    return {
      label: i18n.t("orderStatus.receipt_approved"),
      color: Colors.primary,
    };
  if (order.receipt_status === "rejected")
    return {
      label: i18n.t("orderStatus.receipt_rejected"),
      color: Colors.danger,
    };
  if (order.receipt_image || order.receipt_status === "pending")
    return { label: i18n.t("orderStatus.receipt_pending"), color: Colors.gold };

  const key = `orderStatus.${order.status}`;
  return {
    label: i18n.exists(key) ? i18n.t(key) : order.status,
    color: Colors.wood,
  };
}
export function shortId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export function formatDate(date: string) {
  return date?.split(/[T ]/)[0] ?? "";
}
