import { ErrorState } from "@/components/ErrorState";
import { ProductCard } from "@/components/product/ProductCard";
import { Colors, Spacing } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { router } from "expo-router";
import { ActivityIndicator, FlatList } from "react-native";

export function ProductRow() {
  const { data, isLoading, isError, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <ActivityIndicator
        color={Colors.primary}
        style={{ marginVertical: Spacing.lg }}
      />
    );
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} compact />;
  if (!data?.length) return null;

  return (
    <FlatList
      data={data.slice(0, 10)}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: Spacing.md }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() =>
            router.push({ pathname: "/product/[id]", params: { id: item.id } })
          }
        />
      )}
    />
  );
}
