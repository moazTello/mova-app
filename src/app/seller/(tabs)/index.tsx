import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { StatCard } from '@/components/seller/StatCard';
import { useAuthStore } from '@/store/authStore';
import { useSellerBalance } from '@/hooks/useSellerBalance';
import { useSellerOrderItems } from '@/hooks/useSellerOrders';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { formatPrice } from '@/utils/product';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function SellerDashboard() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const balance = useSellerBalance();
  const items = useSellerOrderItems();
  const products = useSellerProducts();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshUser(),
      qc.invalidateQueries({ queryKey: ['seller-balance'] }),
      qc.invalidateQueries({ queryKey: ['seller-order-items'] }),
      qc.invalidateQueries({ queryKey: ['seller-products'] }),
    ]);
    setRefreshing(false);
  };

  // إذا endpoint الرصيد فشل، منستخدم الرقم اللي بالـ user
  const currentBalance = balance.data?.balance ?? Number(user?.balance ?? 0);
  const count = (s: string) => items.data?.filter((i) => i.status === s).length ?? 0;
  const hidden = products.data?.filter((p) => !p.is_active).length ?? 0;

  return (
    <Screen inTabs refreshing={refreshing} onRefresh={onRefresh}>
      <AppText variant="h2">{t('dashboard.hello', { name: user?.name ?? '' })}</AppText>
      <AppText variant="caption" color={Colors.textMuted} style={{ marginBottom: Spacing.md }}>
        {user?.seller_info?.shop_name}
      </AppText>

      {/* كارد الرصيد */}
      <View style={styles.balanceCard}>
        <AppText variant="caption" color={Colors.beige}>
          {t('dashboard.balance')}
        </AppText>
        <AppText style={styles.balanceValue} color={Colors.background}>
          {formatPrice(currentBalance)}
        </AppText>
        <AppText variant="small" color={Colors.beige}>
          {t('dashboard.balanceHint')}
        </AppText>
        <AppButton
          title={t('dashboard.viewBalance')}
          variant="light"
          onPress={() => router.push('/seller/balance')}
          style={styles.balanceBtn}
        />
      </View>

      {/* الإحصائيات */}
      <View style={styles.grid}>
        <StatCard
          icon="notifications-outline"
          label={t('dashboard.newOrders')}
          value={count('pending')}
          highlight={count('pending') > 0}
          onPress={() => router.push('/seller/orders')}
        />
        <StatCard
          icon="hammer-outline"
          label={t('dashboard.preparing')}
          value={count('in_progress')}
          onPress={() => router.push('/seller/orders')}
        />
      </View>
      <View style={styles.grid}>
        <StatCard
          icon="cube-outline"
          label={t('dashboard.products')}
          value={products.data?.length ?? 0}
          onPress={() => router.push('/seller/products')}
        />
        <StatCard
          icon="eye-off-outline"
          label={t('dashboard.hiddenProducts')}
          value={hidden}
          onPress={() => router.push('/seller/products')}
        />
      </View>

      <AppButton
        title={t('dashboard.addProduct')}
        icon="add"
        onPress={() => router.push('/seller/product/new')}
        style={{ marginTop: Spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    padding: Spacing.lg,
    gap: 4,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  balanceValue: { fontSize: 32, fontFamily: 'Poppins_700Bold' },
  balanceBtn: { marginTop: Spacing.md, height: 44, backgroundColor: Colors.beige },
  grid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
});