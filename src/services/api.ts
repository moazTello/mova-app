import axios from 'axios';
import i18n from '@/i18n';
import { tokenStorage } from './tokenStorage';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = i18n.language;
  return config;
});

// const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/resend-otp', '/auth/logout'];
const AUTH_PATHS = [
  '/auth/login', '/auth/register', '/auth/verify-otp', '/auth/resend-otp', '/auth/logout',
  '/auth/forgot-password', '/auth/reset-password',
];
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';

    if (status === 401 && tokenStorage.get() && !AUTH_PATHS.some((p) => url.includes(p))) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);