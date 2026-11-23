import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Product } from '@/types/product';
import { formatPrice, productImage } from '@/utils/product';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  product: Product;
  width?: number;
  onPress?: () => void;
};

export function ProductCard({ product, width = 160, onPress }: Props) {
  const { t } = useTranslation();
  const image = productImage(product);
  const outOfStock = product.stock <= 0;

  return (
    <Pressable style={[styles.card, { width }]} onPress={onPress}>
      <View style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={32} color={Colors.beige} />
        )}

        {outOfStock && (
          <View style={styles.badge}>
            <AppText variant="small" color={Colors.background}>
              {t('product.outOfStock')}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <AppText weight="medium" numberOfLines={1}>
          {product.name}
        </AppText>

        {product.ratings_count > 0 && (
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <AppText variant="small" color={Colors.textMuted}>
              {product.average_rating.toFixed(1)} ({product.ratings_count})
            </AppText>
          </View>
        )}

        <AppText weight="bold" color={Colors.primary}>
          {formatPrice(product.price)}
        </AppText>
      </View>
    </Pressable>
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
  imageBox: {
    height: 120,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    start: Spacing.sm,
    backgroundColor: Colors.wood,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  info: { padding: Spacing.sm, gap: 4 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});