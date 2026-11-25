import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { Category } from '@/types/category';
import { Colors, Radius, Spacing } from '@/constants/theme';

const ICONS = [
  'bed-outline',
  'home-outline',
  'restaurant-outline',
  'cafe-outline',
  'tv-outline',
  'desktop-outline',
  'library-outline',
  'bulb-outline',
  'flower-outline',
  'leaf-outline',
  'water-outline',
  'color-palette-outline',
  'images-outline',
  'happy-outline',
  'briefcase-outline',
  'car-outline',
  'sunny-outline',
  'grid-outline',
  'cube-outline',
  'gift-outline',
] as const;

type Props = {
  visible: boolean;
  category?: Category | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; icon: string }) => void;
};

export function CategoryFormModal({ visible, category, loading, onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(ICONS[0]);

  useEffect(() => {
    if (visible) {
      setName(category?.name ?? '');
      setIcon(category?.icon && category.icon in Ionicons.glyphMap ? category.icon : ICONS[0]);
    }
  }, [visible, category]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="h3" center>
        {category ? t('admin.editCategory') : t('admin.addCategory')}
      </AppText>

      <AppInput placeholder={t('admin.categoryName')} value={name} onChangeText={setName} />

      <AppText variant="caption" weight="medium">
        {t('admin.chooseIcon')}
      </AppText>
      <ScrollView contentContainerStyle={styles.icons} style={{ maxHeight: 220 }}>
        {ICONS.map((name) => {
          const active = name === icon;
          return (
            <Pressable key={name} onPress={() => setIcon(name)} style={[styles.iconBox, active && styles.iconActive]}>
              <Ionicons name={name} size={24} color={active ? Colors.background : Colors.primary} />
            </Pressable>
          );
        })}
      </ScrollView>

      <AppButton
        title={t('admin.save')}
        loading={loading}
        disabled={!name.trim()}
        onPress={() => onSubmit({ name: name.trim(), icon })}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});
