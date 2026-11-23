import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useAuthStore } from '@/store/authStore';
import { homeFor } from '@/utils/roleRoutes';
import { Colors, Spacing } from '@/constants/theme';

export default function SellerStatus() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const logout = useAuthStore((s) => s.logout);
  const [checking, setChecking] = useState(false);

  const rejected = user?.seller_info?.approval_status === 'rejected';

  const onRefresh = async () => {
    setChecking(true);
    const updated = await refreshUser();
    setChecking(false);
    // إذا انقبل، بيروح للوحة التاجر
    if (updated && updated.seller_info?.approval_status === 'approved') {
      router.replace(homeFor(updated));
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.iconCircle, rejected && { backgroundColor: '#F6E3E1' }]}>
        <Ionicons
          name={rejected ? 'close-circle-outline' : 'hourglass-outline'}
          size={56}
          color={rejected ? Colors.danger : Colors.gold}
        />
      </View>

      <AppText variant="h2" center>
        {rejected ? t('shop.rejectedTitle') : t('shop.pendingTitle')}
      </AppText>
      <AppText color={Colors.textMuted} center>
        {rejected ? t('shop.rejectedMsg') : t('shop.pendingMsg')}
      </AppText>

      <View style={styles.actions}>
        {rejected ? (
          <AppButton title={t('shop.edit')} icon="create-outline" onPress={() => router.replace('/seller/onboarding')} />
        ) : (
          <AppButton title={t('shop.refresh')} icon="refresh" variant="outline" loading={checking} onPress={onRefresh} />
        )}

        <Pressable
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}
          style={{ alignSelf: 'center', padding: Spacing.sm }}
        >
          <AppText variant="caption" color={Colors.textMuted}>
            {t('account.logout')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actions: { alignSelf: 'stretch', gap: Spacing.sm, marginTop: Spacing.lg },
});