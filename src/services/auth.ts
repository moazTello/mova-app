import { AuthResponse, User } from "@/types/user";
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
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    console.log(data)
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

  forgotPassword: async (phone_number: string) => {
  const { data } = await api.post('/auth/forgot-password', { phone_number });
  return data;
},

resetPassword: async (payload: {
  phone_number: string;
  otp: string;
  password: string;
  password_confirmation: string;
}) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
},
};
