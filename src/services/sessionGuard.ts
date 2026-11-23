import { Alert } from 'react-native';
import { router } from 'expo-router';
import i18n from '@/i18n';
import { setUnauthorizedHandler } from './api';
import { useAuthStore } from '@/store/authStore';

let handling = false;

export function registerSessionGuard() {
  setUnauthorizedHandler(async () => {
    const { status, clearSession } = useAuthStore.getState();

    // وقت الـ bootstrap الحالة 'loading'، والـ bootstrap بيتعامل مع الـ 401 لحاله
    if (handling || status !== 'authenticated') return;
    handling = true;

    try {
      await clearSession();
      router.replace('/login');
      Alert.alert(i18n.t('auth.sessionExpired'), i18n.t('auth.sessionExpiredMsg'));
    } finally {
      handling = false;
    }
  });
}