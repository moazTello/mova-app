import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { ProductOptionInput } from '@/services/seller';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Item = ProductOptionInput & { id?: string };

type Props = {
  options: Item[];
  onAdd: (option: ProductOptionInput) => void;
  onRemove: (index: number) => void;
};

export function OptionsEditor({ options, onAdd, onRemove }: Props) {
  const { t, i18n } = useTranslation();
  const font = { fontFamily: Fonts[i18n.language === 'ar' ? 'ar' : 'en'].regular };
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const add = () => {
    if (!name.trim() || !value.trim()) return;
    onAdd({ option_name: name.trim(), option_value: value.trim() });
    setValue(''); // منخلي الاسم مشان يضيف قيم تانية لنفس الخاصية بسرعة
  };

  return (
    <View style={{ gap: Spacing.sm }}>
      {options.map((o, i) => (
        <View key={o.id ?? `${o.option_name}-${o.option_value}-${i}`} style={styles.item}>
          <AppText variant="caption" color={Colors.textMuted}>
            {o.option_name}
          </AppText>
          <AppText weight="medium" style={{ flex: 1 }}>
            {o.option_value}
          </AppText>
          <Pressable onPress={() => onRemove(i)} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('productForm.optionName')}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, font]}
        />
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={t('productForm.optionValue')}
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={add}
          style={[styles.input, font]}
        />
        <Pressable onPress={add} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    color: Colors.text,
    textAlign: 'left',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});