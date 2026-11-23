import { ActivityIndicator, FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { useCategories } from '@/hooks/useCategories';
import { categoryIcon } from '@/utils/category';
import { Colors, Radius, Spacing } from '@/constants/theme';

const GAP = Spacing.md;

export default function Categories() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data, isLoading, refetch, isRefetching } = useCategories();
  const cardWidth = (width - Spacing.md * 2 - GAP) / 2;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.sm }]}>
      <AppText variant="h2" center style={{ marginBottom: Spacing.md }}>
        {t('tabs.categories')}
      </AppText>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(c) => c.id}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, { width: cardWidth }]}
              onPress={() =>
                router.push({
                  pathname: '/category/[id]',
                  params: { id: item.id, name: item.name },
                })
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons name={categoryIcon(item)} size={36} color={Colors.primary} />
              </View>
              <AppText weight="medium" center numberOfLines={1}>
                {item.name}
              </AppText>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, gap: GAP },
  card: {
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});