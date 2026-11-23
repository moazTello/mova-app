import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { StorageKeys } from "@/constants/storageKeys";
import { Colors, Radius, Spacing } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const slides = [
  { key: "s1", image: require("../../../assets/images/onboarding-3.jpeg") },
  { key: "s2", image: require("../../../assets/images/onboarding-3.jpeg") },
  { key: "s3", image: require("../../../assets/images/onboarding-3.jpeg") },
];

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const finish = async (path: "/login" | "/home") => {
    await AsyncStorage.setItem(StorageKeys.onboardingSeen, "1");
    router.replace(path);
  };

  const next = () => {
    if (isLast) return finish("/login");
    pagerRef.current?.setPage(index + 1);
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={StyleSheet.absoluteFill}
        initialPage={0}
        layoutDirection={isAr ? "rtl" : "ltr"}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
      >
        {slides.map((item) => (
          <ImageBackground
            key={item.key}
            source={item.image}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={[styles.textBox, { bottom: 290 + insets.bottom }]}>
              <AppText variant="h1" color={Colors.background} center>
                {t(`onboarding.${item.key}Title`)}
              </AppText>
              <AppText
                color={Colors.background}
                center
                style={{ marginTop: Spacing.sm }}
              >
                {t(`onboarding.${item.key}Text`)}
              </AppText>
            </View>
          </ImageBackground>
        ))}
      </PagerView>

      {!isLast && (
        <Pressable
          onPress={() => finish("/login")}
          style={[styles.skip, { top: insets.top + Spacing.sm }]}
        >
          <AppText color={Colors.background}>{t("onboarding.skip")}</AppText>
        </Pressable>
      )}

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}
      >
        <View style={styles.dots}>
          {slides.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <AppButton
          title={isLast ? t("onboarding.start") : t("onboarding.next")}
          onPress={next}
          style={styles.mainButton}
        />

        {/* {isLast && (
          <AppButton
            title={t("onboarding.guest")}
            variant="ghost"
            textColor={Colors.beige}
            onPress={() => finish("/home")}
          />
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(46, 58, 40, 0.35)",
  },
  textBox: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
  },
  skip: {
    position: "absolute",
    end: Spacing.lg,
    padding: Spacing.sm,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: "rgba(212, 201, 184, 0.5)",
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.background,
  },
  mainButton: {
    borderWidth: 1,
    borderColor: Colors.beige,
  },
});