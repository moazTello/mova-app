import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { BackHeader } from "@/components/BackHeader";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
// import { StorageKeys } from "@/constants/storageKeys";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useAddresses } from "@/hooks/useAddresses";
import { useCart } from "@/hooks/useCart";
import { ordersService } from "@/services/orders";
import { parseApiError } from "@/utils/apiError";
import { formatPrice } from "@/utils/product";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppCheckbox } from "@/components/AppCheckbox";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardFooter, FOOTER_KEYBOARD_OFFSET } from "@/components/KeyboardFooter";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function CheckoutAddress() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { data: cart } = useCart();

  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   AsyncStorage.getItem(StorageKeys.lastAddress).then(
  //     (v) => v && setAddress(v),
  //   );
  // }, []);
  const addresses = useAddresses();
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [saveNew, setSaveNew] = useState(true);

  // أول ما يتحمّلوا، منختار أحدث عنوان
  useEffect(() => {
    if (
      addresses.loaded &&
      addresses.items.length &&
      selectedId === "new" &&
      !address
    ) {
      setSelectedId(addresses.items[0].id);
    }
  }, [addresses.loaded]);

  const selected = addresses.items.find((a) => a.id === selectedId);
  const finalAddress = selected ? selected.details : address.trim();
  const onContinue = async () => {
    // const value = address.trim();
    // if (!value) return setError(t("checkout.addressRequired"));
    const value = finalAddress;
    if (!value) return setError(t("checkout.addressRequired"));
    setError("");
    setLoading(true);
    try {
      const orders = await ordersService.create(value);
      // await AsyncStorage.setItem(StorageKeys.lastAddress, value);
      if (selected) addresses.touch(selected.id);
      else if (saveNew) addresses.add({ label: "", details: value });
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      router.replace({
        pathname: "/checkout/receipt",
        params: { ids: orders.map((o) => o.id).join(",") },
      });
    } catch (e) {
      const { message, fieldErrors } = parseApiError(e);
      if (fieldErrors.delivery_address) setError(fieldErrors.delivery_address);
      else Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const lang = i18n.language === "ar" ? "ar" : "en";

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <BackHeader title={t("checkout.title")} />

      <KeyboardAwareScrollView
        bottomOffset={FOOTER_KEYBOARD_OFFSET}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <CheckoutSteps current={0} />

        <AppText variant="h3">{t("checkout.addressTitle")}</AppText>
        {/* <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder={t("checkout.addressPlaceholder")}
          placeholderTextColor={Colors.textMuted}
          multiline
          style={[
            styles.input,
            { fontFamily: Fonts[lang].regular },
            !!error && { borderColor: Colors.danger },
          ]}
        />
        {!!error && (
          <AppText variant="caption" color={Colors.danger}>
            {error}
          </AppText>
        )} */}

        {addresses.items.map((a) => {
          const active = a.id === selectedId;
          return (
            <Pressable
              key={a.id}
              onPress={() => setSelectedId(a.id)}
              style={[styles.addr, active && styles.addrActive]}
            >
              <Ionicons
                name={active ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={active ? Colors.primary : Colors.textMuted}
              />
              <View style={{ flex: 1 }}>
                {!!a.label && <AppText weight="medium">{a.label}</AppText>}
                <AppText variant="caption" color={Colors.textMuted}>
                  {a.details}
                </AppText>
              </View>
            </Pressable>
          );
        })}

        {addresses.items.length > 0 && (
          <Pressable
            onPress={() => setSelectedId("new")}
            style={[styles.addr, selectedId === "new" && styles.addrActive]}
          >
            <Ionicons
              name={
                selectedId === "new" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color={selectedId === "new" ? Colors.primary : Colors.textMuted}
            />
            <AppText>{t("addresses.new")}</AppText>
          </Pressable>
        )}

        {selectedId === "new" && (
          <>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder={t("checkout.addressPlaceholder")}
              placeholderTextColor={Colors.textMuted}
              multiline
              style={[
                styles.input,
                { fontFamily: Fonts[lang].regular },
                !!error && { borderColor: Colors.danger },
              ]}
            />
            <AppCheckbox
              checked={saveNew}
              onChange={setSaveNew}
              label={t("addresses.saveForLater")}
            />
          </>
        )}

        {!!error && (
          <AppText variant="caption" color={Colors.danger}>
            {error}
          </AppText>
        )}

        {cart && (
          <View style={styles.summary}>
            <AppText variant="h3">{t("checkout.orderSummary")}</AppText>
            <View style={styles.row}>
              <AppText color={Colors.textMuted}>{t("checkout.items")}</AppText>
              <AppText>{cart.items.length}</AppText>
            </View>
            <View style={styles.row}>
              <AppText weight="bold">{t("cart.total")}</AppText>
              <AppText weight="bold" color={Colors.primary}>
                {formatPrice(cart.total_price)}
              </AppText>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>

      <KeyboardFooter
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
      >
        <AppButton
          title={t("checkout.continue")}
          onPress={onContinue}
          loading={loading}
        />
      </KeyboardFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.sm },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.text,
    textAlignVertical: "top",
    textAlign: "left",
  },
  summary: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  addr: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addrActive: { borderColor: Colors.primary },
});
