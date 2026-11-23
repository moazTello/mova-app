import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
let cached: string | null = null;

export const tokenStorage = {
  /** بيقرا التوكن من الجهاز مرة وحدة عند فتح التطبيق */
  load: async () => {
    cached = await SecureStore.getItemAsync(TOKEN_KEY);
    return cached;
  },

  get: () => cached,

  /** persist = false يعني بالذاكرة بس (بيروح لما يتسكّر التطبيق) */
  set: async (token: string, persist = true) => {
    cached = token;
    if (persist) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  clear: async () => {
    cached = null;
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};