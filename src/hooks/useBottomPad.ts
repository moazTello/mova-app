import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';

/**
 * مسافة من تحت لمحتوى الشاشات اللي مو جوّا تابات.
 * أندرويد (SDK 54+) دايماً edge-to-edge: بدون هالمسافة آخر زر بالقائمة
 * بيطلع تحت أزرار النظام (رجوع / هوم) وما بينكبس.
 */
export function useBottomPad(extra: number = Spacing.lg) {
  const insets = useSafeAreaInsets();
  return { paddingBottom: insets.bottom + extra };
}
