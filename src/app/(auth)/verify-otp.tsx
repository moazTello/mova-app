import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { AuthScreen } from "@/components/AuthScreen";
import { OtpInput } from "@/components/OtpInput";
import { Colors, Spacing } from "@/constants/theme";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/utils/apiError";
import { homeFor } from "@/utils/roleRoutes";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtp() {
  const { t } = useTranslation();
  const { phone } = useLocalSearchParams<{ phone?: string }>();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const onVerify = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp(code);
    const user = await useAuthStore.getState().completeVerification();
router.replace(homeFor(user));
    } catch (e) {
      setError(parseApiError(e).message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await authService.resendOtp();
      setSeconds(RESEND_SECONDS);
      setCode("");
      Alert.alert(t("otp.resent"));
    } catch (e) {
      Alert.alert(parseApiError(e).message);
    }
  };

  return (
    <AuthScreen title={t("otp.title")} subtitle={t("otp.subtitle")}>
      {!!phone && (
        <AppText weight="bold" center style={styles.phone}>
          {phone}
        </AppText>
      )}

      <OtpInput value={code} onChange={setCode} length={OTP_LENGTH} />

      {!!error && (
        <AppText
          variant="caption"
          color={Colors.danger}
          center
          style={{ marginTop: Spacing.sm }}
        >
          {error}
        </AppText>
      )}

      <AppButton
        title={t("otp.verify")}
        onPress={onVerify}
        loading={loading}
        disabled={code.length < OTP_LENGTH}
        style={{ marginTop: Spacing.lg }}
      />

      <View style={styles.resendRow}>
        {seconds > 0 ? (
          <AppText variant="caption" color={Colors.textMuted}>
            {t("otp.resendIn", { seconds })}
          </AppText>
        ) : (
          <>
            <AppText variant="caption" color={Colors.textMuted}>
              {t("otp.noCode")}
            </AppText>
            <Pressable onPress={onResend}>
              <AppText variant="caption" weight="bold">
                {t("otp.resend")}
              </AppText>
            </Pressable>
          </>
        )}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  phone: {
    marginTop: -Spacing.md,
    marginBottom: Spacing.lg,
    direction: "ltr",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
});
