import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { UserRow } from '@/components/admin/UserRow';
import { useAdminUsers } from '@/hooks/useAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import { UserFilters } from '@/services/admin';
import { UserRole } from '@/types/user';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const ROLES: { key?: UserRole; label: string }[] = [
  { key: undefined, label: 'admin.roleAll' },
  { key: 'customer', label: 'admin.roleCustomer' },
  { key: 'seller', label: 'admin.roleSeller' },
  { key: 'admin', label: 'admin.roleAdmin' },
];

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole>();
  const [onlyInactive, setOnlyInactive] = useState(false);
  const debounced = useDebounce(search.trim());

  const filters = useMemo<UserFilters>(
    () => ({
      ...(role && { role }),
      ...(debounced && { search: debounced }),
      ...(onlyInactive && { is_active: '0' as const }),
    }),
    [role, debounced, onlyInactive]
  );

  const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminUsers(filters);
  const users = useMemo(() => data?.pages.flatMap((p) => p.users) ?? [], [data]);

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <AppText variant="caption" color={active ? Colors.background : Colors.text}>
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.users')} />

      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('admin.searchUsers')}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          style={[styles.input, { fontFamily: Fonts[i18n.language === 'ar' ? 'ar' : 'en'].regular }]}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
        {ROLES.map((r) => (
          <Chip key={r.label} active={role === r.key} label={t(r.label)} onPress={() => setRole(r.key)} />
        ))}
        <Chip active={onlyInactive} label={t('admin.inactive')} onPress={() => setOnlyInactive((v) => !v)} />
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onRefresh={refetch}
          refreshing={isRefetching}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={Colors.primary} /> : null}
          renderItem={({ item }) => (
            <UserRow user={item} onPress={() => router.push({ pathname: '/admin/users/[id]', params: { id: item.id } })} />
          )}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {t('admin.noUsers')}
            </AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: { flex: 1, height: '100%', fontSize: 14, color: Colors.text, textAlign: 'left' },
  chips: { gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  list: { padding: Spacing.md, gap: Spacing.sm, flexGrow: 1 },
});