import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Product } from '@/types/product';
import { formatPrice, productImage } from '@/utils/product';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function ProductListRow({ product, onPress }: { product: Product; onPress: () => void }) {
  const { i18n } = useTranslation();
  const image = productImage(product);
  const isAr = i18n.language === 'ar';

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={22} color={Colors.beige} />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="medium" numberOfLines={1}>
          {product.name}
        </AppText>
        <AppText variant="caption" color={Colors.primary}>
          {formatPrice(product.price)}
        </AppText>
      </View>
      <Ionicons name={isAr ? 'arrow-back' : 'arrow-forward'} size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
});