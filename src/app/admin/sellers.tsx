import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { ImageViewer } from '@/components/ImageViewer';
import { PendingSellerCard } from '@/components/admin/PendingSellerCard';
import { usePendingSellers } from '@/hooks/useAdmin';
import { Colors, Spacing } from '@/constants/theme';
import { useBottomPad } from '@/hooks/useBottomPad';

export default function AdminSellers() {
  const bottomPad = useBottomPad();
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch, isRefetching } = usePendingSellers();
  const [viewing, setViewing] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.sellers')} />

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(s) => s.userId}
          contentContainerStyle={[styles.list, bottomPad]}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => <PendingSellerCard seller={item} onViewImage={setViewing} />}
          ListEmptyComponent={
            <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
              {t('admin.noPendingSellers')}
            </AppText>
          }
        />
      )}

      <ImageViewer uri={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, gap: Spacing.md, flexGrow: 1 },
});