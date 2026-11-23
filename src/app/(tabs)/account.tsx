import { AccountScreen } from "@/components/account/AccountScreen";
import { MenuRow } from "@/components/MenuRow";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Account() {
  const { t } = useTranslation();
  const isCustomer = useAuthStore((s) => s.user?.role === "customer");

  return (
    <AccountScreen
      topItems={
        isCustomer && (
          <>
            <MenuRow
              icon="receipt-outline"
              label={t("account.myOrders")}
              onPress={() => router.push("/orders")}
            />
            <MenuRow
              icon="location-outline"
              label={t("addresses.title")}
              onPress={() => router.push("/addresses")}
            />
          </>
        )
      }
    />
  );
}
