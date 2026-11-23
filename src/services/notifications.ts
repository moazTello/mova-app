import { api } from './api';
import { AppNotification } from '@/types/notification';
import { unwrapList } from '@/utils/unwrap';

export const notificationsService = {
  list: async () => {
    const { data } = await api.get('/notifications');
    return unwrapList<AppNotification>(data, 'notifications');
  },
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  remove: (id: string) => api.delete(`/notifications/${id}`),
};