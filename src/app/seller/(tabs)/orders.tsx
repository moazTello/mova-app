import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { ErrorState } from '@/components/ErrorState';
import { SellerOrderItemCard } from '@/components/seller/SellerOrderItemCard';
import { useSellerOrderItems } from '@/hooks/useSellerOrders';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Filter = 'pending' | 'in_progress' | 'ready' | 'delivered';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'pending', label: 'sellerOrders.new' },
  { key: 'in_progress', label: 'sellerOrders.preparing' },
  { key: 'ready', label: 'sellerOrders.ready' },
  { key: 'delivered', label: 'sellerOrders.delivered' },
];

export default function SellerOrders() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('pending');
  const { data, isLoading, isError, error, refetch, isRefetching } = useSellerOrderItems();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    data?.forEach((i) => (c[i.status] = (c[i.status] ?? 0) + 1));
    return c;
  }, [data]);

  const items = useMemo(() => data?.filter((i) => i.status === filter) ?? [], [data, filter]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.sm }]}>
      <AppText variant="h2" center style={{ marginBottom: Spacing.md }}>
        {t('sellerOrders.title')}
      </AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={{ flexGrow: 0 }}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          const count = counts[f.key] ?? 0;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active && styles.chipActive]}>
              <AppText variant="caption" color={active ? Colors.background : Colors.text}>
                {t(f.label)}
                {count > 0 ? ` (${count})` : ''}
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
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <SellerOrderItemCard item={item} />}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
             {t('sellerOrders.empty')}
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