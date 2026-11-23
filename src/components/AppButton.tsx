import { Colors, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { AppText } from "./AppText";

type Variant = "primary" | "outline" | "light" | "ghost";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  style,
  textColor,
  disabled,
  loading,
}: Props) {
  const color =
    textColor ?? (variant === "primary" ? Colors.background : Colors.primary);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && { opacity: 0.8 },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          <AppText
            weight={variant === "light" ? "medium" : "bold"}
            color={color}
          >
            {title}
          </AppText>
          {icon && <Ionicons name={icon} size={20} color={color} />}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  primary: { backgroundColor: Colors.primary },
  outline: { borderWidth: 1, borderColor: Colors.primary },
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {},
});
