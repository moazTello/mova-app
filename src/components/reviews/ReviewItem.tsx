import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { StarRating } from '@/components/StarRating';
import { Rating } from '@/types/rating';
import { formatDate } from '@/utils/order';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function ReviewItem({ rating, mine, mineLabel }: { rating: Rating; mine?: boolean; mineLabel?: string }) {
  return (
    <View style={[styles.card, mine && styles.mine]}>
      <View style={styles.header}>
        <Avatar uri={rating.user?.profile_image} name={rating.user?.name} size={32} />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" weight="medium">
            {mine && mineLabel ? mineLabel : rating.user?.name ?? '—'}
          </AppText>
          {!!rating.created_at && (
            <AppText variant="small" color={Colors.textMuted}>
              {formatDate(rating.created_at)}
            </AppText>
          )}
        </View>
        <StarRating value={rating.rating} size={13} />
      </View>
      {!!rating.review && (
        <AppText variant="caption" color={Colors.text} style={{ lineHeight: 20 }}>
          {rating.review}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mine: { borderColor: Colors.gold },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});