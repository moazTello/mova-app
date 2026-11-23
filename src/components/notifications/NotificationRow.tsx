import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { AppNotification } from '@/types/notification';
import { notificationText } from '@/utils/notification';
import { formatDate } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  item: AppNotification;
  onPress: () => void;
  onLongPress: () => void;
};

export function NotificationRow({ item, onPress, onLongPress }: Props) {
  const { title, body } = notificationText(item);
  const unread = !item.read_at;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.row, unread && styles.unread]}
    >
      <View style={styles.icon}>
        <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight={unread ? 'bold' : 'regular'} numberOfLines={1}>
          {title}
        </AppText>
        {!!body && (
          <AppText variant="caption" color={Colors.textMuted} numberOfLines={2}>
            {body}
          </AppText>
        )}
        <AppText variant="small" color={Colors.textMuted}>
          {formatDate(item.created_at)}
        </AppText>
      </View>

      {unread && <View style={styles.dot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unread: { borderColor: Colors.gold, backgroundColor: '#FFFDF8' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: Radius.full, backgroundColor: Colors.gold, marginTop: 6 },
});