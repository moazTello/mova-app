import { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, StyleSheet, Switch, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { BackHeader } from '@/components/BackHeader';
import { TransactionRow } from '@/components/seller/TransactionRow';
import { useAdminUser, useClearBalance, useSetUserStatus, useUserTransactions } from '@/hooks/useAdmin';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/product';
import { formatDate } from '@/utils/order';
import { parseApiError } from '@/utils/apiError';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useBottomPad } from '@/hooks/useBottomPad';

function Line({ icon, text, color }: { icon: keyof typeof Ionicons.glyphMap; text?: string | null; color?: string }) {
  if (!text) return null;
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={16} color={Colors.wood} />
      <AppText variant="caption" color={color} style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

export default function AdminUserDetails() {
  const bottomPad = useBottomPad();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const me = useAuthStore((s) => s.user);

  const { data: user, isLoading, refetch, isRefetching } = useAdminUser(id);
  const isSeller = user?.role === 'seller' || user?.role === 'admin';
  const transactions = useUserTransactions(id, isSeller);
  const setStatus = useSetUserStatus(id);
  const clearBalance = useClearBalance(id);
  const [note, setNote] = useState('');

  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  if (isLoading || !user) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t('admin.users')} />
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      </View>
    );
  }

  const balance = Number(user.balance ?? 0);
  const isMe = user.id === me?.id;

  const onClear = () => {
    if (!note.trim()) return Alert.alert(t('admin.noteRequired'));
    Alert.alert(t('admin.clearBalance'), t('admin.clearConfirm', { amount: formatPrice(balance) }), [
      { text: t('cart.cancel'), style: 'cancel' },
      {
        text: t('cart.confirm'),
        onPress: () =>
          clearBalance.mutate(note.trim(), {
            onSuccess: () => {
              setNote('');
              Alert.alert(t('admin.balanceCleared'));
            },
            onError,
          }),
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={user.seller_info?.shop_name ?? user.name} />

      <KeyboardAwareScrollView
        bottomOffset={Spacing.xl}
        contentContainerStyle={[styles.content, bottomPad]}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* الملف */}
        <View style={[styles.card, styles.profile]}>
          <Avatar uri={user.profile_image} name={user.name} size={64} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="h3">{user.name}</AppText>
            <AppText variant="caption" color={Colors.textMuted}>
              {user.email}
            </AppText>
          </View>
        </View>

        {/* المعلومات */}
        <View style={styles.card}>
          <Line
            icon="call-outline"
            text={user.phone_number && `${user.phone_number} · ${user.phone_number_verified ? t('admin.verified') : t('admin.notVerified')}`}
            color={user.phone_number_verified ? undefined : Colors.danger}
          />
          <Line icon="calendar-outline" text={user.created_at && `${t('admin.joined')}: ${formatDate(user.created_at)}`} />
          <Line icon="storefront-outline" text={user.seller_info?.major} />
          <Line icon="location-outline" text={user.seller_info?.shop_location} />

          <View style={styles.switchRow}>
            <AppText>{t('admin.accountActive')}</AppText>
            <Switch
              value={!!user.is_active}
              disabled={isMe || setStatus.isPending}
              onValueChange={(v) => setStatus.mutate(v, { onError })}
              trackColor={{ true: Colors.primary, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* الرصيد للتاجر */}
        {isSeller && (
          <>
            <View style={styles.balanceCard}>
              <AppText variant="caption" color={Colors.beige}>
                {t('admin.sellerBalance')}
              </AppText>
              <AppText style={styles.balanceValue} color={Colors.background}>
                {formatPrice(balance)}
              </AppText>
              {!!user.seller_info?.payment_url && (
                <AppText variant="caption" color={Colors.beige} selectable>
                  {t('admin.payoutInfo')}: {user.seller_info.payment_url}
                </AppText>
              )}
            </View>

            {balance > 0 && (
              <View style={styles.card}>
                <AppText weight="bold">{t('admin.clearBalance')}</AppText>
                <AppText variant="small" color={Colors.textMuted}>
                  {t('admin.clearBalanceHint')}
                </AppText>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder={t('admin.clearNote')}
                  placeholderTextColor={Colors.textMuted}
                  style={[styles.noteInput, { fontFamily: Fonts[i18n.language === 'ar' ? 'ar' : 'en'].regular }]}
                />
                <AppButton
                  title={t('admin.clearBalance')}
                  icon="checkmark-done"
                  loading={clearBalance.isPending}
                  onPress={onClear}
                />
              </View>
            )}

            <AppText variant="h3">{t('balance.transactions')}</AppText>
            {transactions.isLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : transactions.data?.length ? (
              transactions.data.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
            ) : (
              <AppText variant="caption" color={Colors.textMuted} center>
                {t('balance.empty')}
              </AppText>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xl },
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profile: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  balanceCard: { padding: Spacing.lg, gap: 4, borderRadius: Radius.lg, backgroundColor: Colors.primary },
  balanceValue: { fontSize: 30, fontFamily: 'Poppins_700Bold' },
  noteInput: {
    height: 46,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    color: Colors.text,
    textAlign: 'left',
  },
});