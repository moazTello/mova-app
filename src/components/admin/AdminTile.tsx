import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  badge?: number;
  onPress: () => void;
};

export function AdminTile({ icon, title, desc, badge, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
        {!!badge && badge > 0 && (
          <View style={styles.badge}>
            <AppText variant="small" color={Colors.white} style={{ fontSize: 10 }}>
              {badge}
            </AppText>
          </View>
        )}
      </View>
      <AppText weight="bold" numberOfLines={1}>
        {title}
      </AppText>
      <AppText variant="small" color={Colors.textMuted} numberOfLines={2}>
        {desc}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
    minHeight: 130,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: -6,
    end: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});