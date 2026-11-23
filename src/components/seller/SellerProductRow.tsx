import { Alert, Image, Pressable, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { useDeleteProduct, useToggleProduct } from '@/hooks/useSellerProducts';
import { Product } from '@/types/product';
import { formatPrice, productImage } from '@/utils/product';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = { product: Product; onEdit: () => void };

export function SellerProductRow({ product, onEdit }: Props) {
  const { t } = useTranslation();
  const toggle = useToggleProduct();
  const remove = useDeleteProduct();
  const image = productImage(product);
  const lowStock = product.stock <= 0;

  const onDelete = () =>
    Alert.alert(t('sellerProducts.delete'), t('sellerProducts.deleteConfirm', { name: product.name }), [
      { text: t('cart.cancel'), style: 'cancel' },
      {
        text: t('sellerProducts.delete'),
        style: 'destructive',
        onPress: () => remove.mutate(product.id, { onError: (e) => Alert.alert(parseApiError(e).message) }),
      },
    ]);

  return (
    <View style={[styles.card, remove.isPending && { opacity: 0.5 }]}>
      <Pressable style={styles.top} onPress={onEdit}>
        <View style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={24} color={Colors.beige} />
          )}
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <AppText weight="medium" numberOfLines={1}>
            {product.name}
          </AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            {product.category?.name}
          </AppText>
          <View style={styles.meta}>
            <AppText weight="bold" color={Colors.primary}>
              {formatPrice(product.price)}
            </AppText>
            <AppText variant="small" color={lowStock ? Colors.danger : Colors.textMuted}>
              {t('sellerProducts.stock', { count: product.stock })}
            </AppText>
          </View>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <View style={styles.switchRow}>
          <Switch
            value={product.is_active}
            onValueChange={(v) =>
              toggle.mutate({ id: product.id, is_active: v }, { onError: (e) => Alert.alert(parseApiError(e).message) })
            }
            trackColor={{ true: Colors.primary, false: Colors.border }}
            thumbColor={Colors.white}
          />
          <AppText variant="caption" color={product.is_active ? Colors.primary : Colors.textMuted}>
            {product.is_active ? t('sellerProducts.active') : t('sellerProducts.hidden')}
          </AppText>
        </View>

        <View style={styles.buttons}>
          <Pressable onPress={onEdit} hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8} style={styles.iconBtn} disabled={remove.isPending}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  top: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.sm },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  buttons: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { padding: 6 },
});