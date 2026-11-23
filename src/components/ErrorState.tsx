import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { parseApiError } from '@/utils/apiError';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  error?: unknown;
  onRetry: () => void;
  compact?: boolean;
};

export function ErrorState({ error, onRetry, compact = false }: Props) {
  const { t } = useTranslation();
  const message = error ? parseApiError(error).message : t('errors.generic');

  return (
    <View style={[styles.box, compact && styles.compact]}>
      <Ionicons name="cloud-offline-outline" size={compact ? 28 : 48} color={Colors.beige} />
      <AppText variant="caption" color={Colors.textMuted} center>
        {message}
      </AppText>
      <AppButton
        title={t('errors.retry')}
        variant="outline"
        icon="refresh"
        onPress={onRetry}
        style={compact ? styles.smallBtn : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.lg },
  compact: { padding: Spacing.md },
  smallBtn: { height: 40 },
});