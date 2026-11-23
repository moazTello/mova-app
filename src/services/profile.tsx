import { api } from './api';
import { User } from '@/types/user';
import { fileFromUri } from '@/utils/upload';

const unwrapUser = (data: any) => (data?.user ?? data?.data ?? null) as User | null;

export const profileService = {
  update: async (payload: { name: string; phone_number: string }) => {
    const { data } = await api.patch('/profile', payload);
    return unwrapUser(data);
  },

  updatePassword: async (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    const { data } = await api.patch('/profile/password', payload);
    return data;
  },

  uploadImage: async (uri: string) => {
    const form = new FormData();
    form.append('profile_image', fileFromUri(uri));
    const { data } = await api.post('/profile/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapUser(data);
  },

  deleteImage: async () => {
    const { data } = await api.delete('/profile/image');
    return unwrapUser(data);
  },

  deleteAccount: async () => {
    await api.delete('/profile');
  },
};