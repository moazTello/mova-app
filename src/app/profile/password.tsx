import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { profileService } from '@/services/profile';
import { parseApiError } from '@/utils/apiError';
import { Colors, Spacing } from '@/constants/theme';

export default function ChangePassword() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setErrors({});
    setLoading(true);
    try {
      await profileService.updatePassword({
        current_password: current,
        password,
        password_confirmation: confirm,
      });
      Alert.alert(t('profile.passwordChanged'), undefined, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      const { message, fieldErrors } = parseApiError(e);
      setErrors(fieldErrors);
      if (!Object.keys(fieldErrors).length) Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <BackHeader title={t('profile.changePassword')} />

      <AppInput
        icon="lock-closed-outline"
        placeholder={t('profile.currentPassword')}
        value={current}
        onChangeText={setCurrent}
        password
        error={errors.current_password}
      />
      <AppInput
        icon="lock-open-outline"
        placeholder={t('profile.newPassword')}
        value={password}
        onChangeText={setPassword}
        password
        error={errors.password}
      />
      <AppInput
        icon="lock-open-outline"
        placeholder={t('profile.confirmNewPassword')}
        value={confirm}
        onChangeText={setConfirm}
        password
      />

      <AppButton
        title={t('profile.save')}
        onPress={onSave}
        loading={loading}
        disabled={!current || !password || !confirm}
        style={{ marginTop: Spacing.sm }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.md, gap: Spacing.md },
});