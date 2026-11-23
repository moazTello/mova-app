import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export function AppCheckbox({ checked, onChange, label }: Props) {
  return (
    <Pressable style={styles.row} onPress={() => onChange(!checked)} hitSlop={8}>
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <Ionicons name="checkmark" size={14} color={Colors.background} />}
      </View>
      <AppText variant="caption">{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: Colors.primary },
});