import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * زر/شريط ثابت أسفل الشاشة بيطلع فوق الكيبورد لما ينفتح.
 * لما الكيبورد مسكّر: بياخد مسافة الـ safe area من تحت.
 * لما ينفتح: منلغي هالمسافة لأنه الكيبورد أصلاً مغطي منطقتها.
 */
export function KeyboardFooter({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
      <View style={style}>{children}</View>
    </KeyboardStickyView>
  );
}

/** المسافة بين الحقل المركّز والكيبورد بالشاشات اللي فيها footer ثابت (ارتفاع الزر + هامش) */
export const FOOTER_KEYBOARD_OFFSET = 96;
