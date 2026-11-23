import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { useCart, useClearCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/product';
import { Colors, Spacing } from '@/constants/theme';

function EmptyState({ icon, title, message, action, onAction }: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={64} color={Colors.beige} />
      <AppText variant="h3" center>{title}</AppText>
      <AppText color={Colors.textMuted} center>{message}</AppText>
      <AppButton title={action} onPress={onAction} style={{ marginTop: Spacing.md, alignSelf: 'stretch' }} />
    </View>
  );
}

export default function Cart() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading } = useCart();
  const clear = useClearCart();

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={{ width: 24 }} />
      <AppText variant="h2">{t('cart.title')}</AppText>
      {cart?.items.length ? (
        <Pressable
          hitSlop={8}
          onPress={() =>
            Alert.alert(t('cart.clear'), t('cart.clearConfirm'), [
              { text: t('cart.cancel'), style: 'cancel' },
              { text: t('cart.confirm'), style: 'destructive', onPress: () => clear.mutate() },
            ])
          }
        >
          <Ionicons name="trash-bin-outline" size={22} color={Colors.textMuted} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );

  // زائر أو مو زبون
  if (user?.role !== 'customer') {
    return (
      <View style={styles.screen}>
        {header}
        <EmptyState
          icon="lock-closed-outline"
          title={t('cart.loginRequired')}
          message={t('cart.loginRequiredMsg')}
          action={t('auth.login')}
          onAction={() => router.push('/login')}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        {header}
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!cart?.items.length) {
    return (
      <View style={styles.screen}>
        {header}
        <EmptyState
          icon="bag-outline"
          title={t('cart.empty')}
          message={t('cart.emptyMsg')}
          action={t('cart.browse')}
          onAction={() => router.push('/home')}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {header}

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <AppText variant="h3">{t('cart.total')}</AppText>
          <AppText variant="h3" color={Colors.primary}>
            {formatPrice(cart.total_price)}
          </AppText>
        </View>
        <AppButton
          title={t('cart.checkout')}
         onPress={() => router.push('/checkout')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  list: { padding: Spacing.md, gap: Spacing.md },
  summary: {
    padding: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
});