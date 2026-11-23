import { AppText } from "@/components/AppText";
import { ErrorState } from "@/components/ErrorState";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { categoryIcon } from "@/utils/category";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
type Props = {
  onPressCategory?: (category: Category) => void;
};

export function CategoryRow({ onPressCategory }: Props) {
  const { data, isLoading, isError, error, refetch } = useCategories();

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
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      //   keyExtractor={(item) => String(item.id)}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable style={styles.item} onPress={() => onPressCategory?.(item)}>
          <View style={styles.circle}>
            <Ionicons
              name={categoryIcon(item)}
              size={26}
              color={Colors.primary}
            />
          </View>
          <AppText variant="caption" center numberOfLines={1}>
            {item.name}
          </AppText>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.md, paddingBottom: Spacing.lg },
  item: { width: 72, alignItems: "center", gap: Spacing.xs },
  circle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
