import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { DeliveryProofs } from '@/components/orders/DeliveryProofs';
import { OrderItem } from '@/types/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

const STEPS = ['pending', 'in_progress', 'ready', 'delivered'] as const;

const ICONS: Record<(typeof STEPS)[number], keyof typeof Ionicons.glyphMap> = {
  pending: 'time-outline',
  in_progress: 'hammer-outline',
  ready: 'cube-outline',
  delivered: 'checkmark-done-outline',
};

function ItemTrack({ item }: { item: OrderItem }) {
  const { t, i18n } = useTranslation();
  const current = STEPS.indexOf(item.status as any);
  const label = i18n.exists(`itemStatus.${item.status}`) ? t(`itemStatus.${item.status}`) : item.status;

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <AppText weight="medium" style={{ flex: 1 }} numberOfLines={1}>
          {item.product.name} × {item.quantity}
        </AppText>
        <AppText variant="caption" color={current === 3 ? Colors.primary : Colors.wood}>
          {label}
        </AppText>
      </View>

      <View style={styles.track}>
        {STEPS.map((step, i) => {
          const reached = i <= current;
          return (
            <View key={step} style={styles.stepWrap}>
              {i > 0 && <View style={[styles.line, reached && styles.lineOn]} />}
              <View style={[styles.dot, reached && styles.dotOn]}>
                <Ionicons name={ICONS[step]} size={13} color={reached ? Colors.background : Colors.textMuted} />
              </View>
            </View>
          );
        })}
      </View>

      {item.status === 'delivered' && <DeliveryProofs proofs={item.delivery_proofs} size={56} />}
    </View>
  );
}

export function ItemStatusTracker({ items }: { items: OrderItem[] }) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <AppText variant="h3">{t('itemStatus.title')}</AppText>
      {items.map((item) => (
        <ItemTrack key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  item: { gap: Spacing.sm },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  track: { flexDirection: 'row', alignItems: 'center' },
  stepWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  line: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 2 },
  lineOn: { backgroundColor: Colors.primary },
  dot: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: Colors.primary },
});