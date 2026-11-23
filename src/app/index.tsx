import { StorageKeys } from "@/constants/storageKeys";
import { useAuthStore } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { homeFor } from '@/utils/roleRoutes';
export default function Index() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.onboardingSeen).then((v) => setSeen(!!v));
  }, []);

  // if (seen === null || status === "loading") return null;
  if (!seen) return <Redirect href="/onboarding" />;
  if (seen) return <Redirect href="/onboarding" />;
 if (status === 'authenticated' && user) return <Redirect href={homeFor(user)} />;
  return <Redirect href="/login" />;
}
