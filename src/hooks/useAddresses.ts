import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '@/constants/storageKeys';

export type Address = { id: string; label: string; details: string };

export function useAddresses() {
  const [items, setItems] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(StorageKeys.addresses);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        // ترحيل: إذا عنده "آخر عنوان" من النسخة القديمة منحوله لأول عنوان محفوظ
        const last = await AsyncStorage.getItem(StorageKeys.lastAddress);
        if (last) {
          const migrated = [{ id: String(Date.now()), label: '', details: last }];
          setItems(migrated);
          AsyncStorage.setItem(StorageKeys.addresses, JSON.stringify(migrated));
        }
      }
      setLoaded(true);
    })();
  }, []);

  const save = useCallback((list: Address[]) => {
    setItems(list);
    AsyncStorage.setItem(StorageKeys.addresses, JSON.stringify(list));
  }, []);

  const add = useCallback(
    (a: Omit<Address, 'id'>) => {
      const created = { ...a, id: String(Date.now()) };
      save([created, ...items]);
      return created;
    },
    [items, save]
  );

  const update = useCallback((a: Address) => save(items.map((i) => (i.id === a.id ? a : i))), [items, save]);
  const remove = useCallback((id: string) => save(items.filter((i) => i.id !== id)), [items, save]);

  /** العنوان اللي استخدمه بطلب بيطلع بالأول */
  const touch = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id);
      if (found) save([found, ...items.filter((i) => i.id !== id)]);
    },
    [items, save]
  );

  return { items, loaded, add, update, remove, touch };
}