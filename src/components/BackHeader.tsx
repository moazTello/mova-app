import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Colors, Spacing } from '@/constants/theme';

export function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <View style={[styles.row, { paddingTop: insets.top + Spacing.sm }]}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.side}>
        <Ionicons name={isAr ? 'chevron-forward' : 'chevron-back'} size={24} color={Colors.primary} />
      </Pressable>
      <AppText variant="h3">{title}</AppText>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  side: { width: 32 },
});