import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { User } from '@/types/user';
import { formatPrice } from '@/utils/product';
import { Colors, Radius, Spacing } from '@/constants/theme';

const ROLE_COLOR = { admin: Colors.primary, seller: Colors.wood, customer: Colors.gold };

export function UserRow({ user, onPress }: { user: User; onPress: () => void }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const roleKey = `admin.role${user.role[0].toUpperCase()}${user.role.slice(1)}`;
  const balance = Number(user.balance ?? 0);

  return (
    <Pressable style={[styles.row, user.is_active === false && { opacity: 0.6 }]} onPress={onPress}>
      <Avatar uri={user.profile_image} name={user.name} size={44} />

      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="medium" numberOfLines={1}>
          {user.seller_info?.shop_name ?? user.name}
        </AppText>
        <AppText variant="small" color={Colors.textMuted} numberOfLines={1}>
          {user.email}
        </AppText>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: ROLE_COLOR[user.role] }]}>
            <AppText variant="small" color={Colors.white}>
              {t(roleKey)}
            </AppText>
          </View>
          {user.is_active === false && (
            <View style={[styles.tag, { backgroundColor: Colors.danger }]}>
              <AppText variant="small" color={Colors.white}>
                {t('admin.inactive')}
              </AppText>
            </View>
          )}
          {user.role !== 'customer' && balance > 0 && (
            <AppText variant="small" weight="bold" color={Colors.primary}>
              {formatPrice(balance)}
            </AppText>
          )}
        </View>
      </View>

      <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
});