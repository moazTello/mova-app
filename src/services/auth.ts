import { AuthResponse, User } from "@/types/user";
import { isEmailIdentifier, normalizeSyrianPhone } from "@/utils/phone";
import { api } from "./api";

export type RegisterPayload = {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  role: "customer" | "seller";
};

export const authService = {
  /** تسجيل الدخول بالإيميل أو برقم الموبايل */
  login: async (identifier: string, password: string) => {
    const value = identifier.trim();
    const credentials = isEmailIdentifier(value)
      ? { email: value.toLowerCase() }
      : { phone_number: normalizeSyrianPhone(value) };

    const { data } = await api.post<AuthResponse>("/auth/login", {
      ...credentials,
      password,
    });
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  verifyOtp: async (otp: string) => {
    const { data } = await api.post<{ message?: string; user?: User }>(
      "/auth/verify-otp",
      { otp },
    );
    return data;
  },

  resendOtp: async () => {
    const { data } = await api.post<{ message?: string }>("/auth/resend-otp");
    return data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  me: async () => {
    const { data } = await api.get("/profile");
    return (data.user ?? data.data ?? data) as User;
  },

  // الباك إند بيحدد الحساب بالإيميل (الرقم مو unique) وبيبعت الكود عواتساب الرقم المؤكَّد
  forgotPassword: async (email: string) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
},

resetPassword: async (payload: {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
},
};
