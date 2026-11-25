import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductListRow } from '@/components/product/ProductListRow';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { Product } from '@/types/product';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useBottomPad } from '@/hooks/useBottomPad';

const GAP = Spacing.md;

export default function Search() {
  const bottomPad = useBottomPad();
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const [term, setTerm] = useState('');
  const debounced = useDebounce(term.trim());
  const searching = debounced.length >= 2;

  const recent = useRecentSearches();
  const results = useProducts({ search: debounced }, searching);
  const all = useProducts();

  const popular = useMemo(
    () => [...(all.data ?? [])].sort((a, b) => b.average_rating - a.average_rating).slice(0, 6),
    [all.data]
  );

  const cardWidth = (width - Spacing.md * 2 - GAP) / 2;

  const openProduct = (p: Product) => {
    if (searching) recent.add(debounced);
    router.push({ pathname: '/product/[id]', params: { id: p.id } });
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t('search.title')} />

      {/* الحقل */}
      <View style={styles.inputBox}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
        <TextInput
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={() => recent.add(term)}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          returnKeyType="search"
          autoFocus
          style={[styles.input, { fontFamily: Fonts[lang].regular }]}
        />
        {!!term && (
          <Pressable onPress={() => setTerm('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      {searching ? (
        // النتائج
        results.isLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : (
          <FlatList
            data={results.data}
            numColumns={2}
            keyExtractor={(p) => p.id}
            columnWrapperStyle={{ gap: GAP }}
            contentContainerStyle={[styles.list, bottomPad]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
              results.data?.length ? (
                <AppText variant="caption" color={Colors.textMuted}>
                  {t('search.results', { count: results.data.length })}
                </AppText>
              ) : null
            }
            ListEmptyComponent={
              <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
                {t('search.noResults', { term: debounced })}
              </AppText>
            }
            renderItem={({ item }) => (
              <ProductCard product={item} width={cardWidth} onPress={() => openProduct(item)} />
            )}
          />
        )
      ) : (
        // قبل البحث
        <ScrollView contentContainerStyle={[styles.list, bottomPad]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {recent.items.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText variant="h3">{t('search.recent')}</AppText>
                <Pressable onPress={recent.clear} hitSlop={8}>
                  <AppText variant="caption" color={Colors.wood}>
                    {t('search.clear')}
                  </AppText>
                </Pressable>
              </View>
              <View style={styles.chips}>
                {recent.items.map((r) => (
                  <Pressable key={r} style={styles.chip} onPress={() => setTerm(r)}>
                    <AppText variant="caption">{r}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {popular.length > 0 && (
            <View style={styles.section}>
              <AppText variant="h3">{t('search.popular')}</AppText>
              {popular.map((p) => (
                <ProductListRow key={p.id} product={p} onPress={() => openProduct(p)} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: { flex: 1, height: '100%', fontSize: 15, color: Colors.text, textAlign: 'left' },
  list: { padding: Spacing.md, gap: GAP, flexGrow: 1 },
  section: { gap: Spacing.sm, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
});