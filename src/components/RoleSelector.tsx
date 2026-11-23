import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

export type RegisterRole = 'customer' | 'seller';

const options: { value: RegisterRole; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'customer', icon: 'person-outline' },
  { value: 'seller', icon: 'storefront-outline' },
];

type Props = {
  value: RegisterRole;
  onChange: (role: RegisterRole) => void;
};

export function RoleSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = value === opt.value;
        const color = active ? Colors.background : Colors.primary;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.option, active && styles.active]}
          >
            <Ionicons name={opt.icon} size={20} color={color} />
            <AppText weight="medium" color={color}>
              {t(`auth.${opt.value}`)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm },
  option: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  active: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});