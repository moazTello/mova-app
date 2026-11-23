import { useTranslation } from 'react-i18next';
import { ProductGridScreen } from '@/components/product/ProductGridScreen';

export default function AllProducts() {
  const { t } = useTranslation();
  return <ProductGridScreen title={t('catalog.allProducts')} emptyText={t('notifications.empty')} />;
}