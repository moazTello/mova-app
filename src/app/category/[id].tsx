import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ProductGridScreen } from '@/components/product/ProductGridScreen';

export default function CategoryProducts() {
  const { t } = useTranslation();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();

  return (
    <ProductGridScreen
      title={name ?? ''}
      filters={{ category_id: id }}
      emptyText={t('catalog.noProducts')}
    />
  );
}