export type AppNotification = {
  id: string;
  type?: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
};