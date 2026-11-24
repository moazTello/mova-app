import { AppButton } from "@/components/AppButton";
import { AppCheckbox } from "@/components/AppCheckbox";
import { AppInput } from "@/components/AppInput";
import { AppText } from "@/components/AppText";
import { AuthScreen } from "@/components/AuthScreen";
import { Colors, Spacing } from "@/constants/theme";
import { authService } from "@/services/auth";
import { tokenStorage } from "@/services/tokenStorage";
import { useAuthStore } from "@/store/authStore";
import { getUnverifiedToken, parseApiError } from "@/utils/apiError";
import { homeFor, needsPhoneVerification } from "@/utils/roleRoutes";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
export default function Login() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const onLogin = async () => {
  setErrors({});
  setLoading(true);
  try {
    const res = await authService.login(identifier, password);
    await setSession(res.token, res.user, remember);

    // الـ login بيرجع مستخدم مختصر بدون seller_info، فمنجيب الكامل من /profile
    const user = (await refreshUser()) ?? res.user;

    if (needsPhoneVerification(user)) {
      await authService.resendOtp().catch(() => {});
    }
    router.replace(homeFor(user));
  } catch (e) {
    const unverifiedToken = getUnverifiedToken(e);
    if (unverifiedToken) {
      await tokenStorage.set(unverifiedToken, false);
      await authService.resendOtp().catch(() => {});
      router.replace('/verify-otp');
      return;
    }
    const { message, fieldErrors } = parseApiError(e);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length === 0) Alert.alert(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <AuthScreen
      title={t("auth.welcomeBack")}
      subtitle={t("auth.loginSubtitle")}
    >
      <View style={styles.form}>
        <AppInput
          icon="person-outline"
          placeholder={t("auth.emailOrPhone")}
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          error={errors.login ?? errors.email ?? errors.phone_number}
        />
        <AppInput
          icon="lock-closed-outline"
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          password
          error={errors.password}
        />

        <View style={styles.row}>
          <AppCheckbox
            checked={remember}
            onChange={setRemember}
            label={t("auth.rememberMe")}
          />
          <Pressable onPress={() => router.push('/forgot-password')}>
            <AppText variant="caption" color={Colors.textMuted}>
              {t("auth.forgotPassword")}
            </AppText>
          </Pressable>
        </View>

        <AppButton
          title={t("auth.login")}
          icon={isAr ? "arrow-back" : "arrow-forward"}
          onPress={onLogin}
          style={{ marginTop: Spacing.sm }}
          loading={loading}
        />
      </View>

      {/* أو */}
      {/* <View style={styles.divider}>
        <View style={styles.line} />
        <AppText variant="caption" color={Colors.textMuted}>
          {t("auth.or")}
        </AppText>
        <View style={styles.line} />
      </View>

      <View style={styles.form}>
        <AppButton
          title={t("auth.continueGoogle")}
          variant="light"
          icon="logo-google"
        />
        <AppButton
          title={t("auth.continueApple")}
          variant="light"
          icon="logo-apple"
        />
      </View> */}

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <AppText variant="caption" color={Colors.textMuted}>
            {t("auth.noAccount")}
          </AppText>
          <Link href="/register">
            <AppText variant="caption" weight="bold">
              {t("auth.register")}
            </AppText>
          </Link>
        </View>

        {/* <Pressable onPress={() => router.replace("/home")}>
          <AppText variant="caption" color={Colors.gold} center>
            {t("auth.guest")}
          </AppText>
        </Pressable> */}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.md },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  footer: {
    // marginTop: 'auto',
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
});
