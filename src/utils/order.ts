import { Colors } from "@/constants/theme";
import i18n from "@/i18n";
import { Order } from "@/types/order";

const CANCELLED = ["cancelled", "canceled", "cancled"];
export const isCancelled = (status: string) => CANCELLED.includes(status);

/** الدفع اتأكّد (الطلب قيد التجهيز أو انسلّم) */
export const isPaid = (order: Pick<Order, "status">) =>
  order.status === "payment_approved" || order.status === "delivered";

/** في إيصال مرفوع بانتظار مراجعة الإدارة */
export const awaitsReceiptReview = (order: Pick<Order, "status">) =>
  order.status === "payment_submitted";

/** في منتج جاهز والتاجر رفع إثبات التسليم، والإدارة لازم تأكّد */
export const awaitsDeliveryConfirm = (order: Pick<Order, "status" | "items">) =>
  order.status === "payment_approved" &&
  (order.items ?? []).some((i) => i.status === "ready" && (i.delivery_proofs?.length ?? 0) > 0);

/**
 * الحالة بتنحسب من status (مصدر الحقيقة بالباك إند).
 * ملاحظة: receipt_status قيمته الافتراضية "pending" حتى قبل رفع أي إيصال،
 * فما منعتمد عليه لحاله.
 */
export function orderStatusLabel(order: Order): { label: string; color: string } {
  if (isCancelled(order.status))
    return { label: i18n.t("orderStatus.cancelled"), color: Colors.textMuted };

  switch (order.status) {
    case "delivered":
      return { label: i18n.t("orderStatus.delivered"), color: Colors.primary };
    case "payment_approved":
      return { label: i18n.t("orderStatus.receipt_approved"), color: Colors.primary };
    case "payment_submitted":
      return { label: i18n.t("orderStatus.receipt_pending"), color: Colors.gold };
    case "pending_payment":
      if (order.receipt_status === "rejected")
        return { label: i18n.t("orderStatus.receipt_rejected"), color: Colors.danger };
      return { label: i18n.t("orderStatus.pending_payment"), color: Colors.wood };
  }

  const key = `orderStatus.${order.status}`;
  return { label: i18n.exists(key) ? i18n.t(key) : order.status, color: Colors.wood };
}

export function shortId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export function formatDate(date: string) {
  return date?.split(/[T ]/)[0] ?? "";
}
