import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  onViewAll?: () => void;
};

export function SectionHeader({ title, onViewAll }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <AppText variant="h3">{title}</AppText>
      {onViewAll && (
        <Pressable onPress={onViewAll} hitSlop={8}>
          <AppText variant="caption" color={Colors.wood}>
            {t('home.viewAll')}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
});