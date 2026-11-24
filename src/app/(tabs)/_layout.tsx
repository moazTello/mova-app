import { Colors } from "@/constants/theme";
import { useCart } from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { name: string; label: string; icon: IconName }[] = [
  { name: "home", label: "tabs.home", icon: "home-outline" },
  { name: "categories", label: "tabs.categories", icon: "grid-outline" },
  { name: "cart", label: "tabs.cart", icon: "bag-outline" },
  { name: "account", label: "tabs.account", icon: "person-outline" },
];

export default function TabsLayout() {
  const { data: cart } = useCart();
  const cartCount = cart?.items.length ?? 0;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarBadge:
              tab.name === "cart" && cartCount > 0 ? cartCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: Colors.gold,
              color: Colors.white,
              fontSize: 10,
            },
            title: t(tab.label),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
