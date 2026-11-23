import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '@/constants/storageKeys';

const MAX = 8;

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.recentSearches).then((v) => v && setItems(JSON.parse(v)));
  }, []);

  const save = (list: string[]) => {
    setItems(list);
    AsyncStorage.setItem(StorageKeys.recentSearches, JSON.stringify(list));
  };

  const add = useCallback(
    (term: string) => {
      const value = term.trim();
      if (value.length < 2) return;
      save([value, ...items.filter((i) => i !== value)].slice(0, MAX));
    },
    [items]
  );

  const clear = useCallback(() => save([]), []);

  return { items, add, clear };
}