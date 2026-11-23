import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { useSellerBalance } from '@/hooks/useSellerBalance';
import { Transaction } from '@/types/balance';
import { formatPrice } from '@/utils/product';
import { formatDate } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { TransactionRow } from '@/components/seller/TransactionRow';
// 

export default function SellerBalance() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch, isRefetching } = useSellerBalance();

  return (
    <View style={styles.screen}>
      <BackHeader title={t('balance.title')} />

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data?.transactions}
          keyExtractor={(tx) => tx.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListHeaderComponent={
            <View style={{ gap: Spacing.md, marginBottom: Spacing.sm }}>
              <View style={styles.balanceCard}>
                <AppText variant="caption" color={Colors.beige}>
                  {t('dashboard.balance')}
                </AppText>
                <AppText style={styles.balanceValue} color={Colors.background}>
                  {formatPrice(data?.balance ?? 0)}
                </AppText>
              </View>
              <AppText variant="h3">{t('balance.transactions')}</AppText>
            </View>
          }
          renderItem={({ item }) => <TransactionRow tx={item} />}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.lg }}>
              {t('balance.empty')}
            </AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, gap: Spacing.sm, flexGrow: 1 },
  balanceCard: { padding: Spacing.lg, gap: 4, borderRadius: Radius.lg, backgroundColor: Colors.primary },
  balanceValue: { fontSize: 32, fontFamily: 'Poppins_700Bold' },
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