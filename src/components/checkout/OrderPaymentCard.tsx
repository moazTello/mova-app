import { Alert, Image, StyleSheet, View } from 'react-native';
import { authImageSource } from '@/utils/media';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useUploadReceipt } from '@/hooks/useOrders';
import { Order } from '@/types/order';
import { formatPrice } from '@/utils/product';
import { orderStatusLabel } from '@/utils/order';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function OrderPaymentCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const upload = useUploadReceipt();
  const status = orderStatusLabel(order);
  const canUpload = order.receipt_status !== 'approved';

  const pickAndUpload = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('checkout.permissionDenied'));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;

    upload.mutate(
      { id: order.id, uri: result.assets[0].uri },
      {
        onSuccess: () => Alert.alert(t('checkout.receiptUploaded')),
        onError: (e) => Alert.alert(parseApiError(e).message),
      }
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText weight="bold">{order.seller.shop_name ?? order.seller.name}</AppText>
        <View style={[styles.badge, { backgroundColor: status.color }]}>
          <AppText variant="small" color={Colors.white}>
            {status.label}
          </AppText>
        </View>
      </View>

      {order.items.map((item) => (
        <View key={item.id} style={styles.row}>
          <AppText variant="caption" color={Colors.textMuted} style={{ flex: 1 }} numberOfLines={1}>
            {item.product.name} × {item.quantity}
          </AppText>
          <AppText variant="caption">{formatPrice(item.subtotal)}</AppText>
        </View>
      ))}

      <View style={[styles.row, styles.totalRow]}>
        <AppText weight="bold">{t('cart.total')}</AppText>
        <AppText weight="bold" color={Colors.primary}>
          {formatPrice(Number(order.total_price))}
        </AppText>
      </View>

      {!!order.receipt_image && (
        <Image source={authImageSource(order.receipt_image)} style={styles.receipt} resizeMode="cover" />
      )}

      {canUpload && (
        <AppButton
          title={order.receipt_image ? t('checkout.changeReceipt') : t('checkout.uploadReceipt')}
          icon="cloud-upload-outline"
          variant={order.receipt_image ? 'outline' : 'primary'}
          loading={upload.isPending}
          onPress={pickAndUpload}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  receipt: { width: '100%', height: 160, borderRadius: Radius.sm },
});