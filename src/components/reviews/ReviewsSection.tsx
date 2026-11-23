import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { StarRating } from '@/components/StarRating';
import { ReviewItem } from './ReviewItem';
import { ReviewModal } from './ReviewModal';
import { useRatings } from '@/hooks/useRatings';
import { useAuthStore } from '@/store/authStore';
import { ratingUserId } from '@/types/rating';
import { Colors, Radius, Spacing } from '@/constants/theme';

const PREVIEW = 3;

type Props = {
  productId: string;
  average: number;
  count: number;
};

export function ReviewsSection({ productId, average, count }: Props) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useRatings(productId);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isCustomer = user?.role === 'customer';
  const mine = useMemo(() => data?.find((r) => ratingUserId(r) === user?.id), [data, user?.id]);
  // تقييمي بالأول، وبعدين الباقي
  const ordered = useMemo(
    () => (mine ? [mine, ...(data ?? []).filter((r) => r !== mine)] : data ?? []),
    [data, mine]
  );
  const shown = expanded ? ordered : ordered.slice(0, PREVIEW);

  return (
    <View style={styles.section}>
      <AppText variant="h3">{t('reviews.title')}</AppText>

      {/* الملخص */}
      <View style={styles.summary}>
        <AppText style={styles.avg}>{average.toFixed(1)}</AppText>
        <View style={{ gap: 4 }}>
          <StarRating value={average} size={18} />
          <AppText variant="small" color={Colors.textMuted}>
            {count} {t('product.reviews')}
          </AppText>
        </View>
      </View>

      {/* زر الكتابة */}
      {isCustomer ? (
        <AppButton
          title={mine ? t('reviews.edit') : t('reviews.write')}
          icon={mine ? 'create-outline' : 'star-outline'}
          variant="outline"
          onPress={() => setModalOpen(true)}
          style={{ height: 44 }}
        />
      ) : !user ? (
        <Pressable onPress={() => router.push('/login')}>
          <AppText variant="caption" color={Colors.wood} center>
            {t('reviews.loginToReview')}
          </AppText>
        </Pressable>
      ) : null}

      {/* القائمة */}
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : !ordered.length ? (
        <AppText variant="caption" color={Colors.textMuted} center>
          {t('reviews.empty')}
        </AppText>
      ) : (
        <>
          {shown.map((r) => (
            <ReviewItem key={r.id} rating={r} mine={r === mine} mineLabel={t('reviews.yours')} />
          ))}
          {ordered.length > PREVIEW && (
            <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
              <AppText variant="caption" color={Colors.wood} center>
                {expanded ? t('reviews.showLess') : t('reviews.showAll', { count: ordered.length })}
              </AppText>
            </Pressable>
          )}
        </>
      )}

      <ReviewModal productId={productId} visible={modalOpen} existing={mine} onClose={() => setModalOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.lg, gap: Spacing.md },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avg: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: Colors.primary },
});