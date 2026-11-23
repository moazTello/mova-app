import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { ImageViewer } from '@/components/ImageViewer';
import { useAdminCancelOrder, useAdminOrder, useMarkDelivered, useReviewReceipt } from '@/hooks/useAdmin';
import { orderCustomer } from '@/types/admin';
import { OrderItem } from '@/types/order';
import { formatPrice } from '@/utils/product';
import { formatDate, isCancelled, orderStatusLabel, shortId } from '@/utils/order';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

function Line({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text?: string | null }) {
  if (!text) return null;
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={16} color={Colors.wood} />
      <AppText variant="caption" style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

export default function AdminOrderDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, refetch, isRefetching } = useAdminOrder(id);
  const review = useReviewReceipt(id);
  const deliver = useMarkDelivered(id);
  const cancel = useAdminCancelOrder(id);
  const [viewing, setViewing] = useState<string | null>(null);

  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  if (isLoading || !order) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t('orders.details')} />
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      </View>
    );
  }

  const status = orderStatusLabel(order);
  const customer = orderCustomer(order);
  const cancelled = isCancelled(order.status);
  const paid = order.receipt_status === 'approved';
  const canReview = !cancelled && order.receipt_status === 'pending';

  const onReview = (s: 'approved' | 'rejected') =>
    Alert.alert(
      s === 'approved' ? t('admin.approveReceipt') : t('admin.rejectReceipt'),
      s === 'approved'
        ? t('admin.approveReceiptConfirm', { amount: formatPrice(Number(order.total_price)) })
        : t('admin.rejectReceiptConfirm'),
      [
        { text: t('cart.cancel'), style: 'cancel' },
        {
          text: t('cart.confirm'),
          style: s === 'rejected' ? 'destructive' : 'default',
          onPress: () => review.mutate(s, { onError }),
        },
      ]
    );

  const onDeliver = (item: OrderItem) =>
    Alert.alert(t('admin.markDelivered'), t('admin.markDeliveredConfirm', { name: item.product.name }), [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('cart.confirm'), onPress: () => deliver.mutate(item.id, { onError }) },
    ]);

  const onCancel = () =>
    Alert.alert(t('admin.cancelOrder'), t('orders.cancelConfirm'), [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('cart.confirm'), style: 'destructive', onPress: () => cancel.mutate(undefined, { onError }) },
    ]);

  const itemLabel = (s: string) => (i18n.exists(`itemStatus.${s}`) ? t(`itemStatus.${s}`) : s);

  return (
    <View style={styles.screen}>
      <BackHeader title={`${t('orders.orderNo')} ${shortId(order.id)}`} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* المعلومات */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <AppText variant="h3" color={Colors.primary}>
              {formatPrice(Number(order.total_price))}
            </AppText>
            <View style={[styles.badge, { backgroundColor: status.color }]}>
              <AppText variant="small" color={Colors.white}>
                {status.label}
              </AppText>
            </View>
          </View>
          <Line icon="person-outline" text={customer && `${t('admin.customer')}: ${customer.name}`} />
          <Line icon="call-outline" text={customer?.phone_number} />
          <Line icon="storefront-outline" text={`${t('admin.shop')}: ${order.seller.shop_name ?? order.seller.name}`} />
          <Line icon="location-outline" text={order.delivery_address} />
          <Line icon="calendar-outline" text={formatDate(order.created_at)} />
        </View>

        {/* الإيصال */}
        <View style={styles.card}>
          <AppText variant="h3">{t('admin.receipt')}</AppText>
          {order.receipt_image ? (
            <Pressable onPress={() => setViewing(order.receipt_image)}>
              <Image source={{ uri: order.receipt_image }} style={styles.receipt} resizeMode="cover" />
            </Pressable>
          ) : (
            <AppText variant="caption" color={Colors.textMuted}>
              {t('admin.noReceipt')}
            </AppText>
          )}

          {canReview && (
            <View style={styles.actions}>
              <AppButton
                title={t('admin.rejectReceipt')}
                variant="outline"
                textColor={Colors.danger}
                onPress={() => onReview('rejected')}
                disabled={review.isPending}
                style={[styles.btn, { borderColor: Colors.danger }]}
              />
              <AppButton
                title={t('admin.approveReceipt')}
                icon="checkmark"
                onPress={() => onReview('approved')}
                loading={review.isPending}
                style={styles.btn}
              />
            </View>
          )}
        </View>

        {/* المنتجات */}
        <View style={styles.card}>
          <AppText variant="h3">{t('admin.items')}</AppText>
          {order.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText weight="medium" numberOfLines={1}>
                  {item.product.name} × {item.quantity}
                </AppText>
                <AppText variant="small" color={Colors.textMuted}>
                  {formatPrice(item.subtotal)} · {itemLabel(item.status)}
                </AppText>
              </View>

              {paid && !cancelled && item.status === 'ready' && (
                <AppButton
                  title={t('admin.markDelivered')}
                  icon="checkmark-done"
                  onPress={() => onDeliver(item)}
                  disabled={deliver.isPending}
                  style={styles.smallBtn}
                />
              )}
              {paid && !cancelled && (item.status === 'pending' || item.status === 'in_progress') && (
                <AppText variant="small" color={Colors.wood}>
                  {t('admin.waitingSeller')}
                </AppText>
              )}
              {item.status === 'delivered' && (
                <Ionicons name="checkmark-done-circle" size={24} color={Colors.primary} />
              )}
            </View>
          ))}
        </View>

        {!cancelled && order.status !== 'delivered' && (
          <AppButton
            title={t('admin.cancelOrder')}
            variant="ghost"
            textColor={Colors.danger}
            loading={cancel.isPending}
            onPress={onCancel}
          />
        )}
      </ScrollView>

      <ImageViewer uri={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  receipt: { width: '100%', height: 220, borderRadius: Radius.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  btn: { flex: 1, height: 46 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  smallBtn: { height: 36, paddingHorizontal: Spacing.md },
});