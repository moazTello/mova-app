import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { QuantityStepper } from '@/components/QuantityStepper';
import { useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/product';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function CartItemRow({ item }: { item: CartItem }) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const busy = update.isPending || remove.isPending;
  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  return (
    <View style={[styles.row, busy && { opacity: 0.6 }]}>
      <View style={styles.imageBox}>
        {item.product.image ? (
          <Image source={{ uri: item.product.image }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={24} color={Colors.beige} />
        )}
      </View>

      <View style={styles.info}>
        <AppText weight="medium" numberOfLines={1}>
          {item.product.name}
        </AppText>

        {item.option && (
          <AppText variant="small" color={Colors.textMuted}>
            {item.option.option_name}: {item.option.option_value}
          </AppText>
        )}

        <AppText weight="bold" color={Colors.primary}>
          {formatPrice(Number(item.product.price))}
        </AppText>

        <QuantityStepper
          value={item.quantity}
          max={item.product.stock ? Math.max(item.product.stock, 1) : undefined}
          onChange={(quantity) =>
            update.mutate({ itemId: item.id, quantity }, { onError })
          }
        />
      </View>

      <Pressable
        onPress={() => remove.mutate(item.id, { onError })}
        disabled={busy}
        hitSlop={8}
        style={styles.trash}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, gap: 4, alignItems: 'flex-start' },
  trash: { padding: 4 },
});