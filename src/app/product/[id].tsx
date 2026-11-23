import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { StarRating } from "@/components/StarRating";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAddToCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/authStore";
import { ProductOption } from "@/types/product";
import { parseApiError } from "@/utils/apiError";
import { formatPrice } from "@/utils/product";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function groupOptions(options: ProductOption[]) {
  return options.reduce<Record<string, string[]>>((acc, o) => {
    (acc[o.option_name] ??= []).push(o.option_value);
    return acc;
  }, {});
}

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const [qty, setQty] = useState(1);
  const isAr = i18n.language === "ar";
  const user = useAuthStore((s) => s.user);
  const addToCart = useAddToCart();
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <AppText>{t("product.notFound")}</AppText>
      </View>
    );
  }

  const outOfStock = product.stock <= 0;
  const groups = groupOptions(product.options ?? []);
  const onAdd = () => {
    if (user?.role !== "customer") {
      Alert.alert(t("cart.loginRequired"), t("cart.loginRequiredMsg"), [
        { text: t("cart.cancel"), style: "cancel" },
        { text: t("auth.login"), onPress: () => router.push("/login") },
      ]);
      return;
    }

    addToCart.mutate(
      { productId: product.id, quantity: qty },
      {
        onSuccess: () =>
          Alert.alert(t("cart.added"), undefined, [
            { text: t("cart.continueShopping"), style: "cancel" },
            { text: t("cart.viewCart"), onPress: () => router.push("/cart") },
          ]),
        onError: (e) => Alert.alert(parseApiError(e).message),
      },
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* <ProductGallery images={product.images ?? []} /> */}
          <ProductGallery images={product.images ?? []} videos={product.videos ?? []} />
          <Pressable
            onPress={() => router.back()}
            style={[styles.back, { top: insets.top + Spacing.sm }]}
          >
            <Ionicons
              name={isAr ? "chevron-forward" : "chevron-back"}
              size={22}
              color={Colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* الاسم والتقييم */}
          <AppText variant="h2">{product.name}</AppText>

          {/* <View style={styles.row}>
            <Ionicons name="star" size={14} color={Colors.gold} />
            <AppText variant="caption" color={Colors.textMuted}>
              {product.average_rating.toFixed(1)} ({product.ratings_count}{" "}
              {t("product.reviews")})
            </AppText>
          </View> */}
          <View style={styles.row}>
            <StarRating value={product.average_rating} size={14} />
            <AppText variant="caption" color={Colors.textMuted}>
              {product.average_rating.toFixed(1)} ({product.ratings_count}{" "}
              {t("product.reviews")})
            </AppText>
          </View>

          <AppText
            variant="h2"
            color={Colors.primary}
            style={{ marginTop: Spacing.xs }}
          >
            {formatPrice(product.price)}
          </AppText>

          {/* شارات */}
          <View style={styles.chips}>
            <View style={styles.chip}>
              <AppText variant="small">{product.category?.name}</AppText>
            </View>
            <View style={styles.chip}>
              <AppText variant="small">
                {t("product.seller")}: {product.seller?.name}
              </AppText>
            </View>
            {outOfStock && (
              <View style={[styles.chip, { backgroundColor: Colors.wood }]}>
                <AppText variant="small" color={Colors.background}>
                  {t("product.outOfStock")}
                </AppText>
              </View>
            )}
          </View>

          {/* المواصفات */}
          {Object.keys(groups).length > 0 && (
            <View style={styles.section}>
              <AppText variant="h3">{t("product.specs")}</AppText>
              {Object.entries(groups).map(([name, values]) => (
                <View key={name} style={styles.specRow}>
                  <AppText variant="caption" color={Colors.textMuted}>
                    {name}
                  </AppText>
                  <View style={styles.chips}>
                    {values.map((v) => (
                      <View key={v} style={styles.chip}>
                        <AppText variant="small">{v}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* الوصف */}
          {!!product.description && (
            <View style={styles.section}>
              <AppText variant="h3">{t("product.description")}</AppText>
              <AppText color={Colors.textMuted} style={{ lineHeight: 22 }}>
                {product.description}
              </AppText>
            </View>
          )}

          <ReviewsSection
            productId={product.id}
            average={product.average_rating}
            count={product.ratings_count}
          />
        </View>
      </ScrollView>

      {/* الشريط السفلي */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + Spacing.sm },
        ]}
      >
        <QuantityStepper
          value={qty}
          onChange={setQty}
          max={Math.max(product.stock, 1)}
        />
        <AppButton
          title={t("product.addToCart")}
          icon="bag-add-outline"
          disabled={outOfStock}
          loading={addToCart.isPending}
          onPress={onAdd}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  back: {
    position: "absolute",
    start: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: Spacing.md, gap: Spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  section: { marginTop: Spacing.lg, gap: Spacing.sm },
  specRow: { gap: 2 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
