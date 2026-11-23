import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { OrderRow } from '@/components/orders/OrderRow';
import { useAdminOrders } from '@/hooks/useAdmin';
import { AdminOrder } from '@/types/admin';
import { isCancelled } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Filter = 'review' | 'active' | 'delivered' | 'cancelled' | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'review', label: 'admin.filterReview' },
  { key: 'active', label: 'admin.filterActive' },
  { key: 'delivered', label: 'admin.filterDelivered' },
  { key: 'cancelled', label: 'admin.filterCancelled' },
  { key: 'all', label: 'admin.filterAll' },
];

function matches(o: AdminOrder, f: Filter) {
  const cancelled = isCancelled(o.status);
  const delivered = o.status === 'delivered';
  switch (f) {
    case 'review':
      return !cancelled && o.receipt_status === 'pending';
    case 'active':
      return !cancelled && !delivered && o.receipt_status === 'approved';
    case 'delivered':
      return delivered;
    case 'cancelled':
      return cancelled;
    default:
      return true;
  }
}

export default function AdminOrders() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('review');
  const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminOrders();

  const all = useMemo(() => data?.pages.flatMap((p) => p.orders) ?? [], [data]);
  const orders = useMemo(() => all.filter((o) => matches(o, filter)), [all, filter]);
  const reviewCount = useMemo(() => all.filter((o) => matches(o, 'review')).length, [all]);

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.orders')} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={{ flexGrow: 0 }}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active && styles.chipActive]}>
              <AppText variant="caption" color={active ? Colors.background : Colors.text}>
                {t(f.label)}
                {f.key === 'review' && reviewCount > 0 ? ` (${reviewCount})` : ''}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={Colors.primary} /> : null}
          renderItem={({ item }) => (
            <OrderRow
              order={item}
              onPress={() => router.push({ pathname: '/admin/orders/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {t('admin.noOrders')}
            </AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  filters: { gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  list: { padding: Spacing.md, gap: Spacing.md, flexGrow: 1 },
});