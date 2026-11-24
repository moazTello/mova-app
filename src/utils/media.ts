import { tokenStorage } from "@/services/tokenStorage";
import type { ImageURISource } from "react-native";

/**
 * الملفات الخاصة (إيصالات الدفع، صور الهوية، إثباتات التسليم) بيرجعها السيرفر
 * على مسار /api/files/... وما بتنفتح إلا مع توكن المستخدم.
 */
const PRIVATE_FILES_PREFIX = `${(process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "")}/files/`;

export function isPrivateFile(uri?: string | null): boolean {
  return !!uri && uri.startsWith(PRIVATE_FILES_PREFIX);
}

/**
 * مصدر صورة لـ <Image>: إذا الملف خاص منضيف التوكن بالـ headers،
 * وإذا عام (منتجات، بروفايل) أو محلي (file://) منرجعه متل ما هو.
 */
export function authImageSource(uri: string): ImageURISource {
  const token = tokenStorage.get();
  if (isPrivateFile(uri) && token) {
    return { uri, headers: { Authorization: `Bearer ${token}` } };
  }
  return { uri };
}
