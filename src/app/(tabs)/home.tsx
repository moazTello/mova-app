import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryRow } from "@/components/home/CategoryRow";
import { HomeHeader } from "@/components/home/HomeHeader";
import { ProductRow } from "@/components/home/ProductRow";
import { PromoBanner } from "@/components/home/PromoBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export default function Home() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["categories"] }),
      qc.invalidateQueries({ queryKey: ["products"] }),
      qc.invalidateQueries({ queryKey: ["notifications"] }),
    ]);
    setRefreshing(false);
  };

  return (
    <Screen inTabs refreshing={refreshing} onRefresh={onRefresh}>
      <HomeHeader />
      <SearchBar onPress={() => router.push("/search")} />
      <PromoBanner />
      {/* <SectionHeader
        title={t("home.latest")}
        onViewAll={() => router.push("/products")}
      />
      <ProductRow />
      <CategoryRow
        onPressCategory={(c) =>
          router.push({
            pathname: "/category/[id]",
            params: { id: c.id, name: c.name },
          })
        }
      /> */}
      <SectionHeader
        title={t("home.categories")}
        onViewAll={() => router.push("/categories")}
      />
      <CategoryRow
        onPressCategory={(c) =>
          router.push({
            pathname: "/category/[id]",
            params: { id: c.id, name: c.name },
          })
        }
      />

      <SectionHeader
        title={t("home.latest")}
        onViewAll={() => router.push("/products")}
      />
      <ProductRow />
    </Screen>
  );
}
