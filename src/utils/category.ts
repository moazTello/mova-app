import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/types/category';

type IconName = keyof typeof Ionicons.glyphMap;

export function categoryIcon(category: Pick<Category, 'icon'>): IconName {
  const name = category.icon ?? '';
  if (name in Ionicons.glyphMap) return name as IconName;
  if (`${name}-outline` in Ionicons.glyphMap) return `${name}-outline` as IconName;
  return 'cube-outline';
}