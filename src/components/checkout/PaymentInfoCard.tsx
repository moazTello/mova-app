import { AppText } from "@/components/AppText";
import { PaymentInfo } from "@/constants/payment";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
export function PaymentInfoCard() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    await Clipboard.setStringAsync(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <View style={styles.card}>
      <AppText variant="h3">{t("checkout.paymentTitle")}</AppText>
      <AppText variant="caption" color={Colors.textMuted}>
        {t("checkout.paymentHint")}
      </AppText>

      {PaymentInfo.methods.map((m) => (
        <View key={m.label} style={styles.method}>
          <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <AppText variant="caption" color={Colors.textMuted}>
              {m.label}
            </AppText>
            <AppText weight="bold" selectable style={{ direction: "ltr" }}>
              {m.value}
            </AppText>
          </View>
          <Pressable
            onPress={() => copy(m.value)}
            hitSlop={8}
            style={styles.copy}
          >
            <Ionicons
              name={copied === m.value ? "checkmark" : "copy-outline"}
              size={18}
              color={copied === m.value ? Colors.primary : Colors.wood}
            />
          </Pressable>
        </View>
      ))}
      <AppText variant="caption" color={Colors.textMuted}>
        {t("checkout.accountName")}: {PaymentInfo.accountName}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
  },
  copy: { padding: 6 },
});
