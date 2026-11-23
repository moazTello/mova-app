import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { ErrorState } from '@/components/ErrorState';
import { SellerProductRow } from '@/components/seller/SellerProductRow';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function SellerProducts() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch, isRefetching } = useSellerProducts();

  const openForm = (id?: string) =>
    router.push(id ? { pathname: '/seller/product/[id]', params: { id } } : '/seller/product/new');

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.sm }]}>
      <AppText variant="h2" center style={{ marginBottom: Spacing.md }}>
        {t('sellerProducts.title')}
      </AppText>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => <SellerProductRow product={item} onEdit={() => openForm(item.id)} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={64} color={Colors.beige} />
              <AppText variant="h3" center>{t('sellerProducts.empty')}</AppText>
              <AppText color={Colors.textMuted} center>{t('sellerProducts.emptyMsg')}</AppText>
              <AppButton title={t('sellerProducts.add')} icon="add" onPress={() => openForm()} style={{ alignSelf: 'stretch', marginTop: Spacing.md }} />
            </View>
          }
        />
      )}

      {/* زر الإضافة العائم */}
      {!!data?.length && (
        <Pressable style={styles.fab} onPress={() => openForm()}>
          <Ionicons name="add" size={28} color={Colors.background} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: 100, gap: Spacing.md, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.lg },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    end: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});