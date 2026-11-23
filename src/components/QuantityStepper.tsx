import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({ value, onChange, min = 1, max = 99 }: Props) {
  const canDec = value > min;
  const canInc = value < max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => canDec && onChange(value - 1)}
        style={[styles.btn, !canDec && styles.disabled]}
        hitSlop={6}
      >
        <Ionicons name="remove" size={18} color={Colors.primary} />
      </Pressable>

      <AppText weight="bold" style={styles.value}>
        {value}
      </AppText>

      <Pressable
        onPress={() => canInc && onChange(value + 1)}
        style={[styles.btn, !canInc && styles.disabled]}
        hitSlop={6}
      >
        <Ionicons name="add" size={18} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
  },
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.3 },
  value: { minWidth: 28, textAlign: 'center' },
});