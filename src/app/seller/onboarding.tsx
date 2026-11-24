import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { AppText } from "@/components/AppText";
import { ImagePickerField } from "@/components/ImagePickerField";
import { Colors, Spacing } from "@/constants/theme";
import { sellerService } from "@/services/seller";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/utils/apiError";
import { homeFor } from "@/utils/roleRoutes";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/BackHeader";
import { Ionicons } from "@expo/vector-icons";
export default function SellerOnboarding() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const logout = useAuthStore((s) => s.logout);

  // إذا عنده بيانات من قبل (مرفوض)، منعبّي النموذج فيها
  const existing = user?.seller_info;
  const isUpdate = !!existing;

  const { mode } = useLocalSearchParams<{ mode?: string }>();
  // وضع التعديل: تاجر مقبول جاي من حسابي
  const isEdit = mode === "edit" && existing?.approval_status === "approved";

  const [shopName, setShopName] = useState(existing?.shop_name ?? "");
  const [major, setMajor] = useState(existing?.major ?? "");
  const [location, setLocation] = useState(existing?.shop_location ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [payment, setPayment] = useState(existing?.payment_url ?? "");

  // الصور: منفرّق بين الصورة الموجودة على السيرفر والصورة الجديدة المختارة
  const [frontNew, setFrontNew] = useState<string>();
  const [backNew, setBackNew] = useState<string>();
  const frontShown = frontNew ?? existing?.id_front_image ?? null;
  const backShown = backNew ?? existing?.id_back_image ?? null;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErrors({});

    if (!frontShown || !backShown) {
      setErrors({
        id_front_image: !frontShown ? t("shop.imagesRequired") : "",
        id_back_image: !backShown ? t("shop.imagesRequired") : "",
      });
      return;
    }

    setLoading(true);
    try {
      await sellerService.submitInfo(
        {
          shop_name: shopName.trim(),
          major: major.trim(),
          shop_location: location.trim(),
          description: description.trim(),
          payment_url: payment.trim(),
          id_front_image: frontNew,
          id_back_image: backNew,
        },
        isUpdate,
      );
      const updated = await refreshUser();
      // if (updated) router.replace(homeFor(updated));
      if (!updated) return;

      // إذا رجع للمراجعة، أو إذا هو تسجيل أول مرة: منوجهه حسب حالته
      if (!isEdit || updated.seller_info?.approval_status !== "approved") {
        router.replace(homeFor(updated));
        return;
      }

      Alert.alert(t("shop.saved"));
      router.back();
    } catch (e) {
      const { message, fieldErrors } = parseApiError(e);
      setErrors(fieldErrors);
      if (!Object.keys(fieldErrors).length) Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
 <View style={{ flex: 1, backgroundColor: Colors.background }}>
    {isEdit && <BackHeader title={t('shop.editTitle')} />}

    <KeyboardAwareScrollView
        bottomOffset={Spacing.xl}
      contentContainerStyle={[styles.content, { paddingTop: isEdit ? 0 : insets.top + Spacing.lg }]}
      keyboardShouldPersistTaps="handled"
    >
      {isEdit ? (
        <View style={styles.warning}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.gold} />
          <AppText variant="small" color={Colors.wood} style={{ flex: 1 }}>
            {t('shop.editWarning')}
          </AppText>
        </View>
      ) : (
        <View style={styles.header}>
          <AppText variant="h2" center>
            {t('shop.title')}
          </AppText>
          <AppText variant="caption" color={Colors.textMuted} center>
            {t('shop.subtitle')}
          </AppText>
        </View>
      )}

        <AppInput
          icon="storefront-outline"
          placeholder={t("shop.name")}
          value={shopName}
          onChangeText={setShopName}
          error={errors.shop_name}
        />
        <AppInput
          icon="hammer-outline"
          placeholder={t("shop.major")}
          value={major}
          onChangeText={setMajor}
          error={errors.major}
        />
        <AppInput
          icon="location-outline"
          placeholder={t("shop.location")}
          value={location}
          onChangeText={setLocation}
          error={errors.shop_location}
        />
        <AppInput
          icon="document-text-outline"
          placeholder={t("shop.description")}
          value={description}
          onChangeText={setDescription}
          error={errors.description}
        />

        <View style={{ gap: 4 }}>
          <AppInput
            icon="wallet-outline"
            placeholder={t("shop.payment")}
            value={payment}
            onChangeText={setPayment}
            error={errors.payment_url}
            autoCapitalize="none"
          />
          <AppText
            variant="small"
            color={Colors.textMuted}
            style={{ marginStart: Spacing.md }}
          >
            {t("shop.paymentHint")}
          </AppText>
        </View>

        <ImagePickerField
          label={t("shop.idFront")}
          uri={frontShown}
          onChange={setFrontNew}
          error={errors.id_front_image}
        />
        <ImagePickerField
          label={t("shop.idBack")}
          uri={backShown}
          onChange={setBackNew}
          error={errors.id_back_image}
        />

        {/* <AppButton
          title={t("shop.submit")}
          onPress={onSubmit}
          loading={loading}
          style={{ marginTop: Spacing.sm }}
        />

        <Pressable
          onPress={onLogout}
          style={{ alignSelf: "center", padding: Spacing.sm }}
        >
          <AppText variant="caption" color={Colors.textMuted}>
            {t("account.logout")}
          </AppText>
        </Pressable> */}
        <AppButton
  title={isEdit ? t('shop.save') : t('shop.submit')}
  onPress={onSubmit}
  loading={loading}
  style={{ marginTop: Spacing.sm }}
/>

{!isEdit && (
  <Pressable onPress={onLogout} style={{ alignSelf: 'center', padding: Spacing.sm }}>
    <AppText variant="caption" color={Colors.textMuted}>
      {t('account.logout')}
    </AppText>
  </Pressable>
)}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  header: { gap: Spacing.xs, marginBottom: Spacing.sm },
  warning: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.sm,
  padding: Spacing.md,
  borderRadius: 12,
  backgroundColor: '#FBF4E6',
},
});
