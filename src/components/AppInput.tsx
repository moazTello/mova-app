import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { AppText } from "./AppText";

type Props = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  password?: boolean;
};

export function AppInput({ icon, error, password, style, ...rest }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View
        style={[
          styles.box,
          focused && { borderColor: Colors.primary },
          !!error && { borderColor: Colors.danger },
        ]}
      >
        {icon && <Ionicons name={icon} size={20} color={Colors.textMuted} />}

        <TextInput
          style={[styles.input, { fontFamily: Fonts[lang].regular }, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={password && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {password && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {!!error && (
        <AppText
          variant="caption"
          color={Colors.danger}
          style={{ marginTop: 4 }}
        >
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    height: 52,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: Colors.text,
    textAlign: "left",
  },
});
