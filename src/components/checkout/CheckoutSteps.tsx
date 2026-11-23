import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

const STEPS = ['checkout.stepAddress', 'checkout.stepPayment', 'checkout.stepConfirm'];

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={label} style={styles.step}>
            {i > 0 && <View style={[styles.line, (done || active) && styles.lineActive]} />}
            <View style={[styles.circle, (done || active) && styles.circleActive]}>
              {done ? (
                <Ionicons name="checkmark" size={14} color={Colors.background} />
              ) : (
                <AppText variant="small" weight="bold" color={active ? Colors.background : Colors.textMuted}>
                  {i + 1}
                </AppText>
              )}
            </View>
            <AppText variant="small" color={active ? Colors.primary : Colors.textMuted}>
              {t(label)}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: Spacing.lg },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  circle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: Colors.primary },
  line: {
    position: 'absolute',
    top: 13,
    end: '50%',
    width: '100%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  lineActive: { backgroundColor: Colors.primary },
});