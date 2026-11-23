import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = { onPress?: () => void };

export function SearchBar({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Pressable style={styles.box} onPress={onPress}>
      <AppText variant="caption" color={Colors.textMuted} style={{ flex: 1 }}>
        {t('home.searchPlaceholder')}
      </AppText>
      <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 46,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
});