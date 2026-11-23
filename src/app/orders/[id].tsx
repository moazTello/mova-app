import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { BackHeader } from "@/components/BackHeader";
import { OrderPaymentCard } from "@/components/checkout/OrderPaymentCard";
import { PaymentInfoCard } from "@/components/checkout/PaymentInfoCard";
import { ItemStatusTracker } from "@/components/orders/ItemStatusTracker";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCancelOrder, useOrder } from "@/hooks/useOrders";
import { parseApiError } from "@/utils/apiError";
import { formatDate, isCancelled, shortId } from "@/utils/order";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
export default function OrderDetails() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, refetch, isRefetching } = useOrder(id);
  const cancel = useCancelOrder();

  if (isLoading || !order) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t("orders.details")} />
        <ActivityIndicator
          color={Colors.primary}
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  const awaitingPayment =
    order.status === "pending_payment" && order.receipt_status !== "approved";

  const onCancel = () =>
    Alert.alert(t("orders.cancel"), t("orders.cancelConfirm"), [
      { text: t("cart.cancel"), style: "cancel" },
      {
        text: t("cart.confirm"),
        style: "destructive",
        onPress: () =>
          cancel.mutate(order.id, {
            onError: (e) => Alert.alert(parseApiError(e).message),
          }),
      },
    ]);

  return (
    <View style={styles.screen}>
      <BackHeader title={`${t("orders.orderNo")} ${shortId(order.id)}`} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={18} color={Colors.wood} />
            <AppText variant="caption">{formatDate(order.created_at)}</AppText>
          </View>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={Colors.wood} />
            <AppText variant="caption" style={{ flex: 1 }}>
              {order.delivery_address}
            </AppText>
          </View>
        </View>

        <OrderPaymentCard order={order} />
        {order.receipt_status === "approved" && !isCancelled(order.status) && (
          <ItemStatusTracker items={order.items} />
        )}
        {awaitingPayment && !order.receipt_image && <PaymentInfoCard />}

        {order.status === "pending_payment" && (
          <AppButton
            title={t("orders.cancel")}
            variant="ghost"
            textColor={Colors.danger}
            loading={cancel.isPending}
            onPress={onCancel}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  info: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
});
