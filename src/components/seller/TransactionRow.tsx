import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Transaction } from '@/types/balance';
import { formatPrice } from '@/utils/product';
import { formatDate } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function TransactionRow({ tx }: { tx: Transaction }) {
  const amount = Number(tx.amount);
  const incoming = amount >= 0 && tx.type !== 'debit' && tx.type !== 'payout';
  const text = tx.note ?? tx.description ?? tx.type ?? '';

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: incoming ? '#E8EFE4' : '#F6E3E1' }]}>
        <Ionicons name={incoming ? 'arrow-down' : 'arrow-up'} size={18} color={incoming ? Colors.primary : Colors.danger} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText numberOfLines={2}>{text}</AppText>
        <AppText variant="small" color={Colors.textMuted}>
          {formatDate(tx.created_at)}
        </AppText>
      </View>
      <AppText weight="bold" color={incoming ? Colors.primary : Colors.danger}>
        {incoming ? '+' : '-'} {formatPrice(Math.abs(amount))}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { width: 36, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
});