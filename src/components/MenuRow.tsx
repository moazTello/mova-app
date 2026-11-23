import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
};

export function MenuRow({ icon, label, value, onPress }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <AppText style={{ flex: 1 }}>{label}</AppText>
      {!!value && (
        <AppText variant="caption" color={Colors.textMuted}>
          {value}
        </AppText>
      )}
      <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});