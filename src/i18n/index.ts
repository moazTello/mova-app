import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { reloadAppAsync } from 'expo';
import { StorageKeys } from '@/constants/storageKeys';

import ar from './locales/ar.json';
import en from './locales/en.json';

export type AppLanguage = 'ar' | 'en';


const LANG_KEY = StorageKeys.language;
const DIRECTION_KEY = StorageKeys.directionApplied;

async function applyDirection(lang: AppLanguage) {
  const shouldBeRTL = lang === 'ar';
  if (I18nManager.isRTL === shouldBeRTL) return;

  // حماية من الـ reload اللانهائي إذا الـ RTL ما انطبق
  const applied = await AsyncStorage.getItem(DIRECTION_KEY);
  if (applied === lang) return;

  await AsyncStorage.setItem(DIRECTION_KEY, lang);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldBeRTL);
  await reloadAppAsync();
}

export async function initI18n() {
  const saved = await AsyncStorage.getItem(LANG_KEY);
  const device = getLocales()[0]?.languageCode;

  const lang: AppLanguage =
    saved === 'ar' || saved === 'en' ? saved : device === 'ar' ? 'ar' : 'en';

  await i18n.use(initReactI18next).init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: lang,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
  });

  await applyDirection(lang);
}

export async function changeLanguage(lang: AppLanguage) {
  await AsyncStorage.setItem(LANG_KEY, lang);
  await AsyncStorage.removeItem(DIRECTION_KEY);
  await i18n.changeLanguage(lang);
  await applyDirection(lang);
}

export default i18n;