import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { Avatar } from "@/components/Avatar";
import { MenuRow } from "@/components/MenuRow";
import { Screen } from "@/components/Screen";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { changeLanguage } from "@/i18n";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";

type Props = {
  /** خيارات خاصة بالدور، بتظهر بأول القائمة */
  topItems?: ReactNode;
  subtitle?: string;
};

export function AccountScreen({ topItems, subtitle }: Props) {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAr = i18n.language === "ar";

  const onLogout = () =>
    Alert.alert(t("account.logout"), t("account.logoutConfirm"), [
      { text: t("cart.cancel"), style: "cancel" },
      {
        text: t("account.logout"),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);

  return (
    <Screen inTabs>
      <AppText variant="h2" center style={{ marginBottom: Spacing.lg }}>
        {t("account.title")}
      </AppText>

      <Pressable
        style={styles.profile}
        disabled={!user}
        onPress={() => router.push("/profile/edit")}
      >
        <Avatar
          uri={user?.profile_image}
          name={user?.name ?? t("account.guest")}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="h3">{user?.name ?? t("account.guest")}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            {subtitle ?? user?.email ?? t("account.guestMsg")}
          </AppText>
        </View>
      </Pressable>

      <View style={styles.menu}>
        {topItems}
        {user && (
          <>
            <MenuRow
              icon="person-outline"
              label={t("profile.edit")}
              onPress={() => router.push("/profile/edit")}
            />
            <MenuRow
              icon="key-outline"
              label={t("profile.changePassword")}
              onPress={() => router.push("/profile/password")}
            />
            <MenuRow
              icon="notifications-outline"
              label={t("notifications.title")}
              onPress={() => router.push("/notifications")}
            />
          </>
        )}
        <MenuRow
          icon="language-outline"
          label={t("account.language")}
          value={isAr ? "العربية" : "English"}
          onPress={() => changeLanguage(isAr ? "en" : "ar")}
        />
        <MenuRow
          icon="help-circle-outline"
          label={t("support.title")}
          onPress={() => router.push("/support")}
        />
      </View>

      {user ? (
        <AppButton
          title={t("account.logout")}
          icon="log-out-outline"
          variant="light"
          textColor={Colors.wood}
          onPress={onLogout}
          style={styles.logout}
        />
      ) : (
        <AppButton
          title={t("auth.login")}
          onPress={() => router.push("/login")}
          style={styles.logout}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  menu: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  logout: { marginTop: Spacing.lg, backgroundColor: Colors.beige },
});
