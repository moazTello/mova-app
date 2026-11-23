import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = { onPress?: () => void };

export function PromoBanner({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.textSide}>
        <AppText variant="h3" color={Colors.background}>
          {t('home.bannerTitle')}
        </AppText>
        <Pressable style={styles.button} onPress={onPress}>
          <AppText variant="caption" weight="medium" color={Colors.primary}>
            {t('home.shopNow')}
          </AppText>
        </Pressable>
      </View>

      <Image
        source={require('../../../assets/images/onboarding-1.jpeg')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: 150,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  textSide: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.beige,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  image: { flex: 1.2, height: '100%' },
});