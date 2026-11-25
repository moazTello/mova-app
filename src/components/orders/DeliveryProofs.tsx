import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { ImageViewer } from '@/components/ImageViewer';
import { DeliveryProof } from '@/types/order';
import { authImageSource } from '@/utils/media';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  proofs?: DeliveryProof[];
  size?: number;
  /** عنوان صغير فوق الصور */
  showTitle?: boolean;
};

/** صور إثبات التسليم (مصغّرة) — الضغط على صورة بيفتحها كاملة */
export function DeliveryProofs({ proofs, size = 64, showTitle = true }: Props) {
  const { t } = useTranslation();
  const [viewing, setViewing] = useState<string | null>(null);

  if (!proofs?.length) return null;

  return (
    <View style={styles.wrap}>
      {showTitle && (
        <View style={styles.title}>
          <Ionicons name="images-outline" size={14} color={Colors.wood} />
          <AppText variant="small" color={Colors.wood}>
            {t('orders.deliveryProofs')} ({proofs.length})
          </AppText>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {proofs.map((p) => (
          <Pressable key={p.id} onPress={() => setViewing(p.url)} style={[styles.thumb, { width: size, height: size }]}>
            <Image source={authImageSource(p.url)} style={styles.image} resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>

      <ImageViewer uri={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  title: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  row: { gap: Spacing.sm },
  thumb: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: { width: '100%', height: '100%' },
});
