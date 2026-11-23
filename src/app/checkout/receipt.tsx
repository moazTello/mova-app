import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { PaymentInfoCard } from '@/components/checkout/PaymentInfoCard';
import { OrderPaymentCard } from '@/components/checkout/OrderPaymentCard';
import { useOrdersByIds } from '@/hooks/useOrders';
import { Colors, Spacing } from '@/constants/theme';

export default function CheckoutReceipt() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { ids } = useLocalSearchParams<{ ids: string }>();
  const orderIds = ids ? ids.split(',') : [];
  const queries = useOrdersByIds(orderIds);

  const loading = queries.some((q) => q.isLoading);
  const orders = queries.map((q) => q.data).filter(Boolean);
  const allUploaded = orders.length > 0 && orders.every((o) => !!o!.receipt_image);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <BackHeader title={t('checkout.title')} />

      <ScrollView contentContainerStyle={styles.content}>
        <CheckoutSteps current={allUploaded ? 2 : 1} />

        <PaymentInfoCard />

        {orders.length > 1 && (
          <AppText variant="caption" color={Colors.textMuted} center>
            {t('checkout.ordersBySeller')}
          </AppText>
        )}

        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          orders.map((o) => <OrderPaymentCard key={o!.id} order={o!} />)
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AppButton
          title={t('checkout.finish')}
          variant={allUploaded ? 'primary' : 'outline'}
          onPress={() => router.replace('/orders')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.md },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
});