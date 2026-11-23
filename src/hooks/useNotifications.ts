import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications';
import { useAuthStore } from '@/store/authStore';
import { AppNotification } from '@/types/notification';

const KEY = ['notifications'];

export function useNotifications() {
  const status = useAuthStore((s) => s.status);
  return useQuery({
    queryKey: KEY,
    queryFn: notificationsService.list,
    enabled: status === 'authenticated',
    refetchInterval: 60 * 1000, // كل دقيقة لحد ما نضيف push notifications
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read_at).length ?? 0;
}

function useOptimistic<V>(
  fn: (vars: V) => Promise<unknown>,
  update: (list: AppNotification[], vars: V) => AppNotification[]
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<AppNotification[]>(KEY);
      if (prev) qc.setQueryData(KEY, update(prev, vars));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(KEY, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

const now = () => new Date().toISOString();

export const useMarkRead = () =>
  useOptimistic(
    (id: string) => notificationsService.markRead(id),
    (list, id) => list.map((n) => (n.id === id ? { ...n, read_at: n.read_at ?? now() } : n))
  );

export const useMarkAllRead = () =>
  useOptimistic(
    () => notificationsService.markAllRead(),
    (list) => list.map((n) => ({ ...n, read_at: n.read_at ?? now() }))
  );

export const useDeleteNotification = () =>
  useOptimistic(
    (id: string) => notificationsService.remove(id),
    (list, id) => list.filter((n) => n.id !== id)
  );