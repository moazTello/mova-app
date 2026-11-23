import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Order } from '@/types/order';
import { formatPrice } from '@/utils/product';
import { formatDate, orderStatusLabel, shortId } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function OrderRow({ order, onPress }: { order: Order; onPress: () => void }) {
  const { t, i18n } = useTranslation();
  const status = orderStatusLabel(order);
  const isAr = i18n.language === 'ar';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name="cube-outline" size={28} color={Colors.wood} />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="bold">
          {t('orders.orderNo')} {shortId(order.id)}
        </AppText>
        <AppText variant="caption" color={Colors.textMuted}>
          {order.seller.shop_name ?? order.seller.name} · {formatDate(order.created_at)}
        </AppText>
        <View style={styles.row}>
          <AppText variant="caption" weight="bold" color={Colors.primary}>
            {formatPrice(Number(order.total_price))}
          </AppText>
          <AppText variant="small" color={status.color}>
            ● {status.label}
          </AppText>
        </View>
      </View>

      <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
});