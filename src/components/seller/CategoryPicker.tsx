import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { useCategories } from '@/hooks/useCategories';
import { categoryIcon } from '@/utils/category';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = { value?: string; onChange: (id: string) => void; error?: string };

export function CategoryPicker({ value, onChange, error }: Props) {
  const { data } = useCategories();

  return (
    <View style={{ gap: 6 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {data?.map((c) => {
          const active = c.id === value;
          const color = active ? Colors.background : Colors.primary;
          return (
            <Pressable key={c.id} onPress={() => onChange(c.id)} style={[styles.chip, active && styles.active]}>
              <Ionicons name={categoryIcon(c)} size={16} color={color} />
              <AppText variant="caption" color={color}>
                {c.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
      {!!error && (
        <AppText variant="caption" color={Colors.danger}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  active: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});