import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useReviewSeller } from '@/hooks/useAdmin';
import { PendingSeller } from '@/types/admin';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = { seller: PendingSeller; onViewImage: (uri: string) => void };

function InfoLine({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text?: string | null }) {
  if (!text) return null;
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={15} color={Colors.wood} />
      <AppText variant="caption" style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

export function PendingSellerCard({ seller, onViewImage }: Props) {
  const { t } = useTranslation();
  const review = useReviewSeller();
  const shop = seller.info.shop_name ?? seller.name;

  const confirm = (status: 'approved' | 'rejected') =>
    Alert.alert(
      status === 'approved' ? t('admin.approve') : t('admin.reject'),
      t(status === 'approved' ? 'admin.approveConfirm' : 'admin.rejectConfirm', { name: shop }),
      [
        { text: t('cart.cancel'), style: 'cancel' },
        {
          text: status === 'approved' ? t('admin.approve') : t('admin.reject'),
          style: status === 'rejected' ? 'destructive' : 'default',
          onPress: () =>
            review.mutate(
              { userId: seller.userId, status },
              { onError: (e) => Alert.alert(parseApiError(e).message) }
            ),
        },
      ]
    );

  const idImages = [seller.info.id_front_image, seller.info.id_back_image];

  return (
    <View style={[styles.card, review.isPending && { opacity: 0.5 }]}>
      <AppText variant="h3">{shop}</AppText>
      {!!seller.info.major && (
        <AppText variant="caption" color={Colors.textMuted}>
          {seller.info.major}
        </AppText>
      )}

      <View style={styles.section}>
        <InfoLine icon="person-outline" text={`${t('admin.owner')}: ${seller.name}`} />
        <InfoLine icon="mail-outline" text={seller.email} />
        <InfoLine icon="call-outline" text={seller.phone} />
        <InfoLine icon="location-outline" text={seller.info.shop_location} />
        <InfoLine icon="wallet-outline" text={seller.info.payment_url} />
        <InfoLine icon="document-text-outline" text={seller.info.description} />
      </View>

      <AppText variant="caption" weight="medium">
        {t('admin.idImages')}
      </AppText>
      <View style={styles.images}>
        {idImages.map((uri, i) =>
          uri ? (
            <Pressable key={i} style={styles.imageBox} onPress={() => onViewImage(uri)}>
              <Image source={{ uri }} style={styles.image} />
            </Pressable>
          ) : (
            <View key={i} style={[styles.imageBox, styles.noImage]}>
              <AppText variant="small" color={Colors.textMuted}>
                {t('admin.noImage')}
              </AppText>
            </View>
          )
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          title={t('admin.reject')}
          variant="outline"
          textColor={Colors.danger}
          onPress={() => confirm('rejected')}
          disabled={review.isPending}
          style={[styles.btn, { borderColor: Colors.danger }]}
        />
        <AppButton
          title={t('admin.approve')}
          icon="checkmark"
          onPress={() => confirm('approved')}
          disabled={review.isPending}
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  section: { gap: 6, paddingVertical: Spacing.xs },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  images: { flexDirection: 'row', gap: Spacing.sm },
  imageBox: {
    flex: 1,
    height: 100,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  image: { width: '100%', height: '100%' },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  btn: { flex: 1, height: 46 },
});