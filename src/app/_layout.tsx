import i18n, { initI18n } from "@/i18n";
import { registerSessionGuard } from "@/services/sessionGuard";
import { useAuthStore } from "@/store/authStore";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from "@expo-google-fonts/tajawal";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatedSplash } from "@/components/AnimatedSplash";
import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { Colors, Spacing } from "@/constants/theme";
import { queryClient } from "@/services/queryClient";
import { Ionicons } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundaryProps } from "expo-router";
SplashScreen.preventAutoHideAsync();
registerSessionGuard();
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: { staleTime: 60 * 1000, retry: 1 },
//   },
// });
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    (async () => {
      await initI18n();
      await useAuthStore.getState().bootstrap();
    })().finally(() => setAppReady(true));
  }, []);

  const ready = appReady && fontsLoaded;

// ما منحدد اتجاه قبل ما نعرف اللغة، وإلا 'ltr' بيلغي الـ RTL الـ native
const direction = ready ? (i18n.language === 'ar' ? 'rtl' : 'ltr') : undefined;

  // useEffect(() => {
  //   if (ready) SplashScreen.hideAsync();
  // }, [ready]);

  return (
    <QueryClientProvider client={queryClient}>
    <View style={{ flex: 1, direction }}>
        {ready && <Stack screenOptions={{ headerShown: false }} />}
        {!splashDone && (
          <AnimatedSplash ready={ready} onFinish={() => setSplashDone(true)} />
        )}
      </View>
    </QueryClientProvider>
  );
}
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  if (__DEV__) console.error(error);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.md,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
      }}
    >
      <Ionicons name="alert-circle-outline" size={64} color={Colors.beige} />
      <AppText variant="h3" center>
        {i18n.t("errors.generic")}
      </AppText>
      <AppButton
        title={i18n.t("errors.retry")}
        icon="refresh"
        onPress={retry}
        style={{ alignSelf: "stretch" }}
      />
    </View>
  );
}
