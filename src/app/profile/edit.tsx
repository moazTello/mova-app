import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { BackHeader } from '@/components/BackHeader';
import { profileService } from '@/services/profile';
import { useAuthStore } from '@/store/authStore';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { PhoneInput } from '@/components/PhoneInput';
export default function EditProfile() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  // ---------- الصورة ----------
  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('checkout.permissionDenied'));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    setPhotoBusy(true);
    try {
      await profileService.uploadImage(result.assets[0].uri);
      await refreshUser();
    } catch (e) {
      Alert.alert(parseApiError(e).message);
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    try {
      await profileService.deleteImage();
      await refreshUser();
    } catch (e) {
      Alert.alert(parseApiError(e).message);
    } finally {
      setPhotoBusy(false);
    }
  };

  const onPhotoPress = () => {
    if (!user?.profile_image) return pickPhoto();

    const options = [t('profile.changePhoto'), t('profile.removePhoto'), t('cart.cancel')];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, destructiveButtonIndex: 1, cancelButtonIndex: 2 },
        (i) => (i === 0 ? pickPhoto() : i === 1 ? removePhoto() : null)
      );
    } else {
      Alert.alert('', undefined, [
        { text: options[0], onPress: pickPhoto },
        { text: options[1], style: 'destructive', onPress: removePhoto },
        { text: options[2], style: 'cancel' },
      ]);
    }
  };

  // ---------- الحفظ ----------
  const onSave = async () => {
    setErrors({});
    setSaving(true);
    const phoneChanged = phone.trim() !== (user?.phone_number ?? '');
    try {
      await profileService.update({ name: name.trim(), phone_number: phone.trim() });
      const updated = await refreshUser();

      if (phoneChanged && updated && updated.phone_number_verified === false) {
        router.push({ pathname: '/verify-otp', params: { phone: updated.phone_number ?? '' } });
        return;
      }
      Alert.alert(t('profile.saved'));
    } catch (e) {
      const { message, fieldErrors } = parseApiError(e);
      setErrors(fieldErrors);
      if (!Object.keys(fieldErrors).length) Alert.alert(message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- حذف الحساب ----------
  const onDelete = () =>
    Alert.alert(t('profile.deleteAccount'), t('profile.deleteConfirm'), [
      { text: t('cart.cancel'), style: 'cancel' },
      {
        text: t('profile.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await profileService.deleteAccount();
            await clearSession();
            router.replace('/login');
          } catch (e) {
            Alert.alert(parseApiError(e).message);
          }
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <BackHeader title={t('profile.edit')} />

      <KeyboardAwareScrollView
        bottomOffset={Spacing.xl}
        contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* الصورة */}
        <Pressable onPress={onPhotoPress} disabled={photoBusy} style={styles.avatarWrap}>
          <View style={{ opacity: photoBusy ? 0.5 : 1 }}>
            <Avatar uri={user?.profile_image} name={user?.name} size={100} />
          </View>
          <View style={styles.camera}>
            <Ionicons name="camera" size={16} color={Colors.background} />
          </View>
        </Pressable>

        <AppInput
          icon="person-outline"
          placeholder={t('auth.name')}
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        {/* <AppInput
          icon="call-outline"
          placeholder="+963 9XX XXX XXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          error={errors.phone_number}
        /> */}
        <PhoneInput value={phone} onChange={setPhone} error={errors.phone_number} />
        <View>
          <AppInput icon="mail-outline" value={user?.email} editable={false} style={{ color: Colors.textMuted }} />
          <AppText variant="small" color={Colors.textMuted} style={{ marginTop: 4, marginStart: Spacing.md }}>
            {t('profile.emailHint')}
          </AppText>
        </View>

        <AppButton title={t('profile.save')} onPress={onSave} loading={saving} style={{ marginTop: Spacing.sm }} />

        <AppButton
          title={t('profile.deleteAccount')}
          variant="ghost"
          textColor={Colors.danger}
          icon="trash-outline"
          onPress={onDelete}
          style={{ marginTop: Spacing.xl }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.md },
  avatarWrap: { alignSelf: 'center', marginBottom: Spacing.md },
  camera: {
    position: 'absolute',
    bottom: 2,
    end: 2,
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});