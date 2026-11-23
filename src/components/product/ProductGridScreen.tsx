import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilters } from '@/services/products';
import { Product } from '@/types/product';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Sort = 'newest' | 'priceLow' | 'priceHigh' | 'topRated';
const SORTS: Sort[] = ['newest', 'priceLow', 'priceHigh', 'topRated'];
const GAP = Spacing.md;

function sortProducts(list: Product[], sort: Sort) {
  const copy = [...list];
  switch (sort) {
    case 'priceLow':
      return copy.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return copy.sort((a, b) => b.price - a.price);
    case 'topRated':
      return copy.sort((a, b) => b.average_rating - a.average_rating);
    default:
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

type Props = {
  title: string;
  filters?: ProductFilters;
  emptyText: string;
};

export function ProductGridScreen({ title, filters = {}, emptyText }: Props) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [sort, setSort] = useState<Sort>('newest');
  const { data, isLoading, isError, error, refetch, isRefetching } = useProducts(filters);

  const products = useMemo(() => sortProducts(data ?? [], sort), [data, sort]);
  const cardWidth = (width - Spacing.md * 2 - GAP) / 2;

  return (
    <View style={styles.screen}>
      <BackHeader title={title} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sorts}
        style={{ flexGrow: 0 }}
      >
        {SORTS.map((s) => {
          const active = s === sort;
          return (
            <Pressable key={s} onPress={() => setSort(s)} style={[styles.chip, active && styles.chipActive]}>
              <AppText variant="caption" color={active ? Colors.background : Colors.text}>
                {t(`catalog.${s}`)}
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
          data={products}
          numColumns={2}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListHeaderComponent={
            <AppText variant="caption" color={Colors.textMuted}>
              {t('catalog.productsCount', { count: products.length })}
            </AppText>
          }
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {emptyText}
            </AppText>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              width={cardWidth}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  sorts: { gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  list: { padding: Spacing.md, gap: GAP, flexGrow: 1 },
});