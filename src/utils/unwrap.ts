/** بيطلع المصفوفة من أي شكل response شائع بـ Laravel */
export function unwrapList<T>(data: unknown, key?: string): T[] {
  if (Array.isArray(data)) return data as T[];
  const obj = data as Record<string, any>;
  if (key && Array.isArray(obj?.[key])) return obj[key];
  if (Array.isArray(obj?.data)) return obj.data;
  if (Array.isArray(obj?.data?.data)) return obj.data.data; // paginate
  return [];
}