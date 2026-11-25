import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { OrderRow } from '@/components/orders/OrderRow';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/order';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { isCancelled } from '@/utils/order';
import { useBottomPad } from '@/hooks/useBottomPad';

type Filter = 'all' | 'active' | 'delivered';

function matches(order: Order, filter: Filter) {
  const done = order.status === 'delivered' || isCancelled(order.status);
  if (filter === 'active') return !done;
  if (filter === 'delivered') return order.status === 'delivered';
  return true;
}

export default function Orders() {
  const bottomPad = useBottomPad();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useOrders();

  const orders = useMemo(
    () => (data?.pages.flatMap((p) => p.orders) ?? []).filter((o) => matches(o, filter)),
    [data, filter]
  );

  const filters: Filter[] = ['all', 'active', 'delivered'];

  return (
    <View style={styles.screen}>
      <BackHeader title={t('orders.title')} />

      <View style={styles.filters}>
        {filters.map((f) => {
          const active = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, active && styles.chipActive]}>
              <AppText variant="caption" color={active ? Colors.background : Colors.text}>
                {t(`orders.${f}`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => (
            <OrderRow
              order={item}
              onPress={() => router.push({ pathname: '/orders/[id]', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={[styles.list, bottomPad]}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={Colors.primary} /> : null}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {t('orders.empty')}
            </AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  filters: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md },
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