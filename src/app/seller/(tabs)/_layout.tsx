import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { name: string; label: string; icon: IconName; adminOnly?: boolean }[] = [
  { name: 'index', label: 'sellerTabs.dashboard', icon: 'grid-outline' },
  { name: 'products', label: 'sellerTabs.products', icon: 'cube-outline' },
  { name: 'orders', label: 'sellerTabs.orders', icon: 'receipt-outline' },
  { name: 'manage', label: 'sellerTabs.manage', icon: 'shield-checkmark-outline', adminOnly: true },
  { name: 'account', label: 'sellerTabs.account', icon: 'person-outline' },
];

export default function SellerTabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  return (
    <Tabs
      screenOptions={{
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
            title: t(tab.label),
            // href: null بيخفي التاب بدون ما يحذف الشاشة
            href: tab.adminOnly && !isAdmin ? null : undefined,
            tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}