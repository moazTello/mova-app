import { Alert, Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useUpdateItemStatus, useUploadProof } from '@/hooks/useSellerOrders';
import { itemOrderId, SellerOrderItem } from '@/types/sellerOrder';
import { formatPrice } from '@/utils/product';
import { formatDate, shortId } from '@/utils/order';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

const STATUS_COLOR: Record<string, string> = {
  pending: Colors.gold,
  in_progress: Colors.wood,
  ready: Colors.primary,
  delivered: Colors.primary,
};

export function SellerOrderItemCard({ item }: { item: SellerOrderItem }) {
  const { t, i18n } = useTranslation();
  const updateStatus = useUpdateItemStatus();
  const uploadProof = useUploadProof();
  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  const statusLabel = i18n.exists(`itemStatus.${item.status}`) ? t(`itemStatus.${item.status}`) : item.status;
  const earning = item.seller_payout_amount ?? item.subtotal;

  const onPickProof = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('checkout.permissionDenied'));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });
    if (result.canceled) return;

    uploadProof.mutate(
      { item, uris: result.assets.map((a) => a.uri) },
      { onSuccess: () => Alert.alert(t('sellerOrders.proofUploaded')), onError }
    );
  };

  const onMarkReady = () =>
    Alert.alert(t('sellerOrders.markReady'), t('sellerOrders.confirmReady'), [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('cart.confirm'), onPress: () => updateStatus.mutate({ item, status: 'ready' }, { onError }) },
    ]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="caption" color={Colors.textMuted}>
          {t('sellerOrders.order')} {shortId(itemOrderId(item))}
          {item.order?.created_at || item.created_at ? ` · ${formatDate(item.order?.created_at ?? item.created_at!)}` : ''}
        </AppText>
        <View style={[styles.badge, { backgroundColor: STATUS_COLOR[item.status] ?? Colors.textMuted }]}>
          <AppText variant="small" color={Colors.white}>
            {statusLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.imageBox}>
          {item.product.image ? (
            <Image source={{ uri: item.product.image }} style={styles.image} />
          ) : (
            <Ionicons name="cube-outline" size={24} color={Colors.beige} />
          )}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText weight="medium" numberOfLines={1}>
            {item.product.name} × {item.quantity}
          </AppText>
          {earning != null && (
            <AppText variant="caption" color={Colors.primary}>
              {t('sellerOrders.yourEarning')}: {formatPrice(Number(earning))}
            </AppText>
          )}
          {!!item.order?.delivery_address && (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
              <AppText variant="small" color={Colors.textMuted} numberOfLines={2} style={{ flex: 1 }}>
                {item.order.delivery_address}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {item.status === 'pending' && (
        <AppButton
          title={t('sellerOrders.startPreparing')}
          icon="hammer-outline"
          loading={updateStatus.isPending}
          onPress={() => updateStatus.mutate({ item, status: 'in_progress' }, { onError })}
          style={styles.action}
        />
      )}
      {item.status === 'in_progress' && (
        <AppButton
          title={t('sellerOrders.markReady')}
          icon="checkmark"
          loading={updateStatus.isPending}
          onPress={onMarkReady}
          style={styles.action}
        />
      )}
      {item.status === 'ready' && (
        <AppButton
          title={t('sellerOrders.uploadProof')}
          icon="camera-outline"
          variant="outline"
          loading={uploadProof.isPending}
          onPress={onPickProof}
          style={styles.action}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  body: { flexDirection: 'row', gap: Spacing.md },
  imageBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  action: { height: 44, marginTop: Spacing.xs },
});