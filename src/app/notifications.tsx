import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { NotificationRow } from '@/components/notifications/NotificationRow';
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '@/hooks/useNotifications';
import { notificationLink } from '@/utils/notification';
import { AppNotification } from '@/types/notification';
import { Colors, Spacing } from '@/constants/theme';

export default function Notifications() {
  const { t } = useTranslation();
  const { data, isLoading, refetch, isRefetching } = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const remove = useDeleteNotification();

  const onPress = (n: AppNotification) => {
    if (!n.read_at) markRead.mutate(n.id);
    const link = notificationLink(n);
    if (link) router.push(link);
  };

  const onLongPress = (n: AppNotification) =>
    Alert.alert(t('notifications.deleteConfirm'), undefined, [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('profile.delete'), style: 'destructive', onPress: () => remove.mutate(n.id) },
    ]);

  return (
    <View style={styles.screen}>
      <BackHeader title={t('notifications.title')} />

      {unread > 0 && (
        <Pressable onPress={() => markAll.mutate(undefined)} style={styles.markAll} hitSlop={8}>
          <AppText variant="caption" color={Colors.wood}>
            {t('notifications.markAll')} ({unread})
          </AppText>
        </Pressable>
      )}

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <NotificationRow item={item} onPress={() => onPress(item)} onLongPress={() => onLongPress(item)} />
          )}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {t('notifications.empty')}
            </AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  markAll: { alignSelf: 'flex-end', paddingHorizontal: Spacing.md },
  list: { padding: Spacing.md, gap: Spacing.sm, flexGrow: 1 },
});