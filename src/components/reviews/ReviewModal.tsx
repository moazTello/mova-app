import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { StarRating } from '@/components/StarRating';
import { useDeleteRating, useRateProduct } from '@/hooks/useRatings';
import { Rating } from '@/types/rating';
import { parseApiError } from '@/utils/apiError';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Props = {
  productId: string;
  visible: boolean;
  existing?: Rating | null;
  onClose: () => void;
};

export function ReviewModal({ productId, visible, existing, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const rate = useRateProduct(productId);
  const remove = useDeleteRating(productId);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (visible) {
      setStars(existing?.rating ?? 0);
      setReview(existing?.review ?? '');
    }
  }, [visible, existing]);

  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  const onSubmit = () =>
    rate.mutate(
      { rating: stars, review: review.trim() },
      {
        onSuccess: () => {
          onClose();
          Alert.alert(t('reviews.thanks'));
        },
        onError,
      }
    );

  const onDelete = () =>
    Alert.alert(t('reviews.delete'), t('reviews.deleteConfirm'), [
      { text: t('cart.cancel'), style: 'cancel' },
      {
        text: t('profile.delete'),
        style: 'destructive',
        onPress: () => remove.mutate(undefined, { onSuccess: onClose, onError }),
      },
    ]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <AppText variant="h3" center>
            {existing ? t('reviews.edit') : t('reviews.write')}
          </AppText>

          <View style={{ alignItems: 'center', gap: Spacing.xs }}>
            <StarRating value={stars} size={36} onChange={setStars} />
            {stars === 0 && (
              <AppText variant="small" color={Colors.textMuted}>
                {t('reviews.chooseStars')}
              </AppText>
            )}
          </View>

          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder={t('reviews.placeholder')}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            style={[styles.input, { fontFamily: Fonts[i18n.language === 'ar' ? 'ar' : 'en'].regular }]}
          />

          <AppButton title={t('reviews.submit')} onPress={onSubmit} loading={rate.isPending} disabled={stars === 0} />

          {existing && (
            <AppButton
              title={t('reviews.delete')}
              variant="ghost"
              textColor={Colors.danger}
              loading={remove.isPending}
              onPress={onDelete}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  input: {
    minHeight: 100,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    color: Colors.text,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 15,
  },
});