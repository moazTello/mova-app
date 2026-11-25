import { StyleSheet, View } from 'react-native';
import { Href, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { AdminTile } from '@/components/admin/AdminTile';
import { usePendingSellers } from '@/hooks/useAdmin';
import { Spacing } from '@/constants/theme';

export default function AdminManage() {
  const { t } = useTranslation();
  const pending = usePendingSellers();

  // const go = (path: string) => router.push(path as Href);
  // const go = (path: Href) => router.push(path);
  const go = (path: Href) => router.push(path);

  return (
    <Screen inTabs>
      <AppText variant="h2" center style={{ marginBottom: Spacing.lg }}>
        {t('admin.title')}
      </AppText>

      <View style={styles.grid}>
        <AdminTile
          icon="storefront-outline"
          title={t('admin.sellers')}
          desc={t('admin.sellersDesc')}
          badge={pending.data?.length}
          onPress={() => go('/admin/sellers')}
        />
        <AdminTile
          icon="receipt-outline"
          title={t('admin.orders')}
          desc={t('admin.ordersDesc')}
          onPress={() => go('/admin/orders')}
        />
      </View>
      <View style={styles.grid}>
        <AdminTile
          icon="people-outline"
          title={t('admin.users')}
          desc={t('admin.usersDesc')}
          onPress={() => go('/admin/users')}
        />
        <AdminTile
          icon="grid-outline"
          title={t('admin.categories')}
          desc={t('admin.categoriesDesc')}
          onPress={() => go('/admin/categories')}
        />
      </View>
      <View style={styles.grid}>
        <AdminTile
          icon="trending-up-outline"
          title={t('admin.markup')}
          desc={t('admin.markupDesc')}
          onPress={() => go('/admin/markup')}
        />
        <AdminTile
          icon="bar-chart-outline"
          title={t('admin.reports')}
          desc={t('admin.reportsDesc')}
          onPress={() => go('/admin/reports')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
});