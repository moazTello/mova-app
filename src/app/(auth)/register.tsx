import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { AppText } from "@/components/AppText";
import { AuthScreen } from "@/components/AuthScreen";
import { RegisterRole, RoleSelector } from "@/components/RoleSelector";
import { Colors, Spacing } from "@/constants/theme";
import { authService } from "@/services/auth";
import { tokenStorage } from "@/services/tokenStorage";
import { parseApiError } from "@/utils/apiError";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { PhoneInput } from '@/components/PhoneInput';
export default function Register() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [role, setRole] = useState<RegisterRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const onRegister = async () => {
    setErrors({});
    setLoading(true);
    try {
      const res = await authService.register({
        name,
        email,
        phone_number: phone,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      await tokenStorage.set(res.token, false);
      router.replace({ pathname: "/verify-otp", params: { phone } });
    } catch (e) {
      const { message, fieldErrors } = parseApiError(e);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/login");
  };

  return (
    <AuthScreen
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
    >
      <View style={styles.form}>
        {/* <AppText variant="caption" weight="medium">
          {t('auth.accountType')}
        </AppText> */}
        <RoleSelector value={role} onChange={setRole} />
        {role === "seller" && (
          <AppText variant="small" color={Colors.wood}>
            {t("auth.sellerNote")}
          </AppText>
        )}

        <AppInput
          icon="person-outline"
          placeholder={t("auth.name")}
          value={name}
          onChangeText={setName}
          autoComplete="name"
          style={{ marginTop: 0 }}
          error={errors.name}
        />
        <AppInput
          icon="mail-outline"
          placeholder={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />
        {/* <AppInput
          icon="call-outline"
          placeholder="+963 9XX XXX XXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone_number}
        /> */}
        <PhoneInput value={phone} onChange={setPhone} error={errors.phone_number} />
        <AppInput
          icon="lock-closed-outline"
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          password
          error={errors.password}
        />
        <AppInput
          icon="lock-closed-outline"
          placeholder={t("auth.confirmPassword")}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          password
        />

        <AppButton
          title={t("auth.register")}
          icon={isAr ? "arrow-back" : "arrow-forward"}
          onPress={onRegister}
          loading={loading}
          style={{ marginTop: Spacing.sm }}
        />
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" color={Colors.textMuted}>
          {t("auth.haveAccount")}
        </AppText>
        <Pressable onPress={goToLogin}>
          <AppText variant="caption" weight="bold">
            {t("auth.login")}
          </AppText>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.md },
  footer: {
    // marginTop: 'auto',
    paddingTop: Spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
});
