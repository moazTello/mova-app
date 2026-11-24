import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardFooter, FOOTER_KEYBOARD_OFFSET } from '@/components/KeyboardFooter';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { FormSection } from '@/components/FormSection';
import { CategoryPicker } from '@/components/seller/CategoryPicker';
import { OptionsEditor } from '@/components/seller/OptionsEditor';
import { ImagesPicker } from '@/components/seller/ImagesPicker';
import { useCreateProduct } from '@/hooks/useSellerProducts';
import { ProductOptionInput } from '@/services/seller';
import { parseApiError } from '@/utils/apiError';
import { Colors, Spacing } from '@/constants/theme';

export default function NewProduct() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const create = useCreateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState<string>();
  const [options, setOptions] = useState<ProductOptionInput[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSave = () => {
    setErrors({});
    if (!categoryId) return setErrors({ category_id: t('productForm.categoryRequired') });

    create.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        price: price.trim(),
        stock: stock.trim(),
        category_id: categoryId,
        options,
        images,
      },
      {
        onSuccess: () => {
          Alert.alert(t('productForm.saved'));
          router.back();
        },
        onError: (e) => {
          const { message, fieldErrors } = parseApiError(e);
          setErrors(fieldErrors);
          if (!Object.keys(fieldErrors).length) Alert.alert(message);
        },
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <BackHeader title={t('productForm.newTitle')} />

      <KeyboardAwareScrollView
        bottomOffset={FOOTER_KEYBOARD_OFFSET} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormSection title={t('productForm.images')}>
          <ImagesPicker
            images={images}
            onAdd={(uris) => setImages((prev) => [...prev, ...uris])}
            onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </FormSection>

        <FormSection title={t('productForm.name')}>
          <AppInput value={name} onChangeText={setName} error={errors.name} />
        </FormSection>

        <FormSection title={t('productForm.description')}>
          <AppInput value={description} onChangeText={setDescription} error={errors.description} multiline />
        </FormSection>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <FormSection title={t('productForm.price')}>
              <AppInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" error={errors.price} />
            </FormSection>
          </View>
          <View style={{ flex: 1 }}>
            <FormSection title={t('productForm.stock')}>
              <AppInput value={stock} onChangeText={setStock} keyboardType="number-pad" error={errors.stock} />
            </FormSection>
          </View>
        </View>

        <FormSection title={t('productForm.category')}>
          <CategoryPicker value={categoryId} onChange={setCategoryId} error={errors.category_id} />
        </FormSection>

        <FormSection title={t('productForm.options')} hint={t('productForm.optionsHint')}>
          <OptionsEditor
            options={options}
            onAdd={(o) => setOptions((prev) => [...prev, o])}
            onRemove={(i) => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </FormSection>
      </KeyboardAwareScrollView>

      <KeyboardFooter style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AppButton title={t('productForm.save')} onPress={onSave} loading={create.isPending} />
      </KeyboardFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.lg, paddingBottom: Spacing.xl },
  row: { flexDirection: 'row', gap: Spacing.md },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});