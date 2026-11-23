import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  highlight?: boolean;
  onPress?: () => void;
};

export function StatCard({ icon, label, value, highlight, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, highlight && styles.highlight]}>
      <View style={[styles.icon, highlight && { backgroundColor: Colors.gold }]}>
        <Ionicons name={icon} size={20} color={highlight ? Colors.white : Colors.primary} />
      </View>
      <AppText variant="h2">{value}</AppText>
      <AppText variant="caption" color={Colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  highlight: { borderColor: Colors.gold },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});