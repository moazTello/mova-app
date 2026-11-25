import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { useCategories } from '@/hooks/useCategories';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useAdmin';
import { Category } from '@/types/category';
import { categoryIcon } from '@/utils/category';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminCategories() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch, isRefetching } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);
  const close = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const onSubmit = (values: { name: string; icon: string }) => {
    if (editing) update.mutate({ id: editing.id, ...values }, { onSuccess: close, onError });
    else create.mutate(values, { onSuccess: close, onError });
  };

  const onDelete = (c: Category) =>
    Alert.alert(t('sellerProducts.delete'), t('admin.deleteCategoryConfirm', { name: c.name }), [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('sellerProducts.delete'), style: 'destructive', onPress: () => remove.mutate(c.id, { onError }) },
    ]);

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.categories')} />

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(c) => c.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Ionicons name={categoryIcon(item)} size={22} color={Colors.primary} />
              </View>
              <AppText weight="medium" style={{ flex: 1 }}>
                {item.name}
              </AppText>
              <Pressable
                hitSlop={8}
                style={styles.action}
                onPress={() => {
                  setEditing(item);
                  setModalOpen(true);
                }}
              >
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
              </Pressable>
              <Pressable hitSlop={8} style={styles.action} onPress={() => onDelete(item)}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </Pressable>
            </View>
          )}
        />
      )}

      {/* الزر العائم فوق أزرار نظام أندرويد */}
      <Pressable style={[styles.fab, { bottom: insets.bottom + Spacing.lg }]} onPress={() => setModalOpen(true)}>
        <Ionicons name="add" size={28} color={Colors.background} />
      </Pressable>

      <CategoryFormModal
        visible={modalOpen}
        category={editing}
        loading={create.isPending || update.isPending}
        onClose={close}
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, gap: Spacing.sm },
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
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: { padding: 4 },
  fab: {
    position: 'absolute',
    end: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});