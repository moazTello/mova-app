import { AccountScreen } from "@/components/account/AccountScreen";
import { MenuRow } from "@/components/MenuRow";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils/product";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SellerAccount() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <AccountScreen
      subtitle={user?.seller_info?.shop_name}
      topItems={
        <>
          <MenuRow
            icon="wallet-outline"
            label={t("balance.title")}
            value={formatPrice(Number(user?.balance ?? 0))}
            onPress={() => router.push("/seller/balance")}
          />
          <MenuRow
            icon="storefront-outline"
            label={t("shop.editTitle")}
            onPress={() =>
              router.push({
                pathname: "/seller/onboarding",
                params: { mode: "edit" },
              })
            }
          />
        </>
      }
    />
  );
}
