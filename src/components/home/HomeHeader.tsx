import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { useAuthStore } from '@/store/authStore';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function HomeHeader() {
  const user = useAuthStore((s) => s.user);
  const unread = useUnreadCount();

  return (
    <View style={styles.row}>
      <View style={styles.side} />

      <AppText variant="h2" style={styles.brand}>
        MOVA
      </AppText>

      {user ? (
        <Pressable style={styles.side} hitSlop={8} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
          {unread > 0 && (
            <View style={styles.badge}>
              <AppText variant="small" color={Colors.white} style={{ fontSize: 9 }}>
                {unread > 9 ? '9+' : unread}
              </AppText>
            </View>
          )}
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  side: { width: 32, alignItems: 'center' },
  brand: { letterSpacing: 4, fontFamily: 'Poppins_500Medium' },
  badge: {
    position: 'absolute',
    top: -4,
    end: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});