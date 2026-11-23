import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthScreen } from '@/components/AuthScreen';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { OtpInput } from '@/components/OtpInput';
import { authService } from '@/services/auth';
import { parseApiError } from '@/utils/apiError';
import { Colors, Spacing } from '@/constants/theme';
import { PhoneInput } from '@/components/PhoneInput';
const RESEND_SECONDS = 60;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'phone' | 'reset'>('phone');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleError = (e: unknown) => {
    const { message, fieldErrors } = parseApiError(e);
    setErrors(fieldErrors);
    if (!Object.keys(fieldErrors).length) Alert.alert(message);
  };

  const sendCode = async () => {
    setErrors({});
    setLoading(true);
    try {
      await authService.forgotPassword(phone.trim());
      setStep('reset');
      setSeconds(RESEND_SECONDS);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    setErrors({});
    setLoading(true);
    try {
      await authService.resetPassword({
        phone_number: phone.trim(),
        otp,
        password,
        password_confirmation: confirm,
      });
      Alert.alert(t('forgot.success'), undefined, [{ text: 'OK', onPress: () => router.replace('/login') }]);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <AuthScreen title={t('forgot.title')} subtitle={t('forgot.phoneSubtitle')}>
        <View style={styles.form}>
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
          <AppButton title={t('forgot.send')} onPress={sendCode} loading={loading} disabled={!phone.trim()} />
        </View>
        <BackToLogin />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title={t('forgot.title')} subtitle={t('forgot.resetSubtitle', { phone })}>
      <View style={styles.form}>
        <OtpInput value={otp} onChange={setOtp} />
        {!!errors.otp && (
          <AppText variant="caption" color={Colors.danger} center>
            {errors.otp}
          </AppText>
        )}

        <AppInput
          icon="lock-closed-outline"
          placeholder={t('profile.newPassword')}
          value={password}
          onChangeText={setPassword}
          password
          error={errors.password}
        />
        <AppInput
          icon="lock-closed-outline"
          placeholder={t('profile.confirmNewPassword')}
          value={confirm}
          onChangeText={setConfirm}
          password
        />

        <AppButton
          title={t('forgot.reset')}
          onPress={reset}
          loading={loading}
          disabled={otp.length < 6 || !password || !confirm}
        />

        <View style={styles.links}>
          <Pressable onPress={() => setStep('phone')} hitSlop={8}>
            <AppText variant="caption" color={Colors.textMuted}>
              {t('forgot.changePhone')}
            </AppText>
          </Pressable>

          {seconds > 0 ? (
            <AppText variant="caption" color={Colors.textMuted}>
              {t('otp.resendIn', { seconds })}
            </AppText>
          ) : (
            <Pressable onPress={sendCode} hitSlop={8} disabled={loading}>
              <AppText variant="caption" weight="bold">
                {t('otp.resend')}
              </AppText>
            </Pressable>
          )}
        </View>
      </View>
      <BackToLogin />
    </AuthScreen>
  );
}

function BackToLogin() {
  const { t } = useTranslation();
  return (
    <Pressable onPress={() => router.back()} style={styles.back}>
      <AppText variant="caption" weight="bold">
        {t('auth.login')}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.md },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  back: { marginTop: 'auto', paddingTop: Spacing.lg, alignSelf: 'center' },
});