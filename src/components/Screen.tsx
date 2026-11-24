import { Colors, Spacing } from "@/constants/theme";
import { ReactNode } from "react";
import { RefreshControl, StyleProp, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  scroll = true,
  contentStyle,
  onRefresh,
  refreshing,
}: Props) {
  const insets = useSafeAreaInsets();
  const style = [
    {
      paddingTop: insets.top + Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.lg,
    },
    contentStyle,
  ];

  if (!scroll) {
    return (
      <View style={[{ flex: 1, backgroundColor: Colors.background }, style]}>
        {children}
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={style}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={Spacing.lg}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        ) : undefined
      }
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
