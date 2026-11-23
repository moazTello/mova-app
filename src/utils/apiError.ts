import i18n from "@/i18n";
import axios from "axios";

export type ApiError = {
  message: string;
  fieldErrors: Record<string, string>;
};

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return { message: i18n.t("errors.network"), fieldErrors: {} };
    }

    const data = error.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    const fieldErrors: Record<string, string> = {};
    Object.entries(data?.errors ?? {}).forEach(([key, msgs]) => {
      fieldErrors[key] = msgs[0];
    });

    return { message: data?.message ?? i18n.t("errors.generic"), fieldErrors };
  }

  return { message: i18n.t("errors.generic"), fieldErrors: {} };
}
/** إذا الحساب ما متحقق والباك إند رجّع توكن مع الخطأ */
export function getUnverifiedToken(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data as {
    token?: string;
    requires_verification?: boolean;
  };
  if (error.response?.status === 403 && data?.token) return data.token;
  return null;
}
