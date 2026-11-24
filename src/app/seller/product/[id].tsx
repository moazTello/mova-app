import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { AppText } from "@/components/AppText";
import { BackHeader } from "@/components/BackHeader";
import { FormSection } from "@/components/FormSection";
import { CategoryPicker } from "@/components/seller/CategoryPicker";
import { ImagesPicker } from "@/components/seller/ImagesPicker";
import { OptionsEditor } from "@/components/seller/OptionsEditor";
import { Colors, Spacing } from "@/constants/theme";
import {
  useAddImages,
  useAddOption,
  useAddVideos,
  useDeleteOption,
  useSellerProducts,
  useUpdateProduct,
} from "@/hooks/useSellerProducts";
import { parseApiError } from "@/utils/apiError";
import { mediaUrl } from "@/utils/product";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { KeyboardFooter, FOOTER_KEYBOARD_OFFSET } from "@/components/KeyboardFooter";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export default function EditProduct() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // ما في endpoint لمنتج تاجر واحد، فمنجيبه من القائمة
  const { data: products, isLoading } = useSellerProducts();
  const product = products?.find((p) => p.id === id);

  const update = useUpdateProduct(id);
  const addOption = useAddOption(id);
  const deleteOption = useDeleteOption(id);
  const addImages = useAddImages(id);
  const addVideos = useAddVideos(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  // منعبّي الحقول مرة وحدة بس، مشان تحديثات الخيارات والصور ما تمسح تعديلات المستخدم
  useEffect(() => {
    if (product && !loaded) {
      setName(product.name);
      setDescription(product.description ?? "");
      setPrice(String(product.price));
      setStock(String(product.stock));
      setCategoryId(product.category?.id);
      setLoaded(true);
    }
  }, [product, loaded]);

  const onError = (e: unknown) => Alert.alert(parseApiError(e).message);

  if (isLoading || (!product && !products)) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t("productForm.editTitle")} />
        <ActivityIndicator
          color={Colors.primary}
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t("productForm.editTitle")} />
        <AppText
          center
          color={Colors.textMuted}
          style={{ marginTop: Spacing.xl }}
        >
          {t("productForm.notFound")}
        </AppText>
      </View>
    );
  }

  const imageUrls = (product.images ?? [])
    .map(mediaUrl)
    .filter(Boolean) as string[];
  const pickVideo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t("checkout.permissionDenied"));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      videoMaxDuration: 60,
      quality: 0.7,
    });
    if (result.canceled) return;

    // السيرفر بيقبل لحد 20MB للفيديو، فمنوقف قبل ما يضيع وقت المستخدم بالرفع
    const video = result.assets[0];
    if (video.fileSize && video.fileSize > MAX_VIDEO_BYTES) {
      return Alert.alert(t("productForm.videoTooLarge"));
    }
    addVideos.mutate([video.uri], { onError });
  };
  const onSave = () => {
    setErrors({});
    update.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        price: price.trim(),
        stock: stock.trim(),
        category_id: categoryId,
      },
      {
        onSuccess: () => {
          Alert.alert(t("productForm.saved"));
          router.back();
        },
        onError: (e) => {
          const { message, fieldErrors } = parseApiError(e);
          setErrors(fieldErrors);
          if (!Object.keys(fieldErrors).length) Alert.alert(message);
        },
      },
    );
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t("productForm.editTitle")} />

      <KeyboardAwareScrollView
        bottomOffset={FOOTER_KEYBOARD_OFFSET}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <FormSection
          title={t("productForm.images")}
          hint={t("productForm.instantSave")}
        >
          <ImagesPicker
            images={imageUrls}
            busy={addImages.isPending}
            onAdd={(uris) => addImages.mutate(uris, { onError })}
          />
        </FormSection>

        <FormSection
          title={t("productForm.videos")}
          hint={t("productForm.videoHint")}
        >
          <AppButton
            title={
              product.videos?.length
                ? `${t("productForm.addVideo")} · ${t("productForm.videoCount", { count: product.videos.length })}`
                : t("productForm.addVideo")
            }
            icon="videocam-outline"
            variant="outline"
            loading={addVideos.isPending}
            onPress={pickVideo}
          />
        </FormSection>

        <FormSection title={t("productForm.name")}>
          <AppInput value={name} onChangeText={setName} error={errors.name} />
        </FormSection>

        <FormSection title={t("productForm.description")}>
          <AppInput
            value={description}
            onChangeText={setDescription}
            error={errors.description}
            multiline
          />
        </FormSection>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <FormSection title={t("productForm.price")}>
              <AppInput
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                error={errors.price}
              />
            </FormSection>
          </View>
          <View style={{ flex: 1 }}>
            <FormSection title={t("productForm.stock")}>
              <AppInput
                value={stock}
                onChangeText={setStock}
                keyboardType="number-pad"
                error={errors.stock}
              />
            </FormSection>
          </View>
        </View>
        <AppText
          variant="small"
          color={Colors.textMuted}
          style={{ marginTop: -Spacing.md }}
        >
          {t("productForm.priceHint")}
        </AppText>

        <FormSection title={t("productForm.category")}>
          <CategoryPicker
            value={categoryId}
            onChange={setCategoryId}
            error={errors.category_id}
          />
        </FormSection>

        <FormSection
          title={t("productForm.options")}
          hint={t("productForm.instantSave")}
        >
          <View
            style={{
              opacity: addOption.isPending || deleteOption.isPending ? 0.5 : 1,
            }}
          >
            <OptionsEditor
              options={product.options ?? []}
              onAdd={(o) => addOption.mutate(o, { onError })}
              onRemove={(i) => {
                const optionId = product.options[i]?.id;
                if (optionId) deleteOption.mutate(optionId, { onError });
              }}
            />
          </View>
        </FormSection>
      </KeyboardAwareScrollView>

      <KeyboardFooter
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
      >
        <AppButton
          title={t("productForm.save")}
          onPress={onSave}
          loading={update.isPending}
        />
      </KeyboardFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.lg, paddingBottom: Spacing.xl },
  row: { flexDirection: "row", gap: Spacing.md },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
