import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { MenuRow } from '@/components/MenuRow';
import { Support } from '@/constants/support';
import { Colors, Radius, Spacing } from '@/constants/theme';

const FAQ = ['1', '2', '3', '4', '5'];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onPress={() => setOpen((v) => !v)} style={styles.faq}>
      <View style={styles.faqHeader}>
        <AppText weight="medium" style={{ flex: 1 }}>
          {q}
        </AppText>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
      </View>
      {open && (
        <AppText variant="caption" color={Colors.textMuted} style={{ lineHeight: 21 }}>
          {a}
        </AppText>
      )}
    </Pressable>
  );
}

export default function SupportScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <BackHeader title={t('support.title')} />

      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h3">{t('support.contact')}</AppText>
        <View style={styles.menu}>
          <MenuRow
            icon="logo-whatsapp"
            label={t('support.whatsapp')}
            value={t('support.whatsappDesc')}
            onPress={() => Linking.openURL(`https://wa.me/${Support.whatsapp}`)}
          />
          <MenuRow
            icon="call-outline"
            label={t('support.call')}
            value={Support.phone}
            onPress={() => Linking.openURL(`tel:${Support.phone}`)}
          />
          <MenuRow
            icon="mail-outline"
            label={t('support.email')}
            value={Support.email}
            onPress={() => Linking.openURL(`mailto:${Support.email}`)}
          />
        </View>

        <AppText variant="h3" style={{ marginTop: Spacing.md }}>
          {t('support.faq')}
        </AppText>
        {FAQ.map((n) => (
          <FaqItem key={n} q={t(`support.q${n}`)} a={t(`support.a${n}`)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xl },
  menu: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  faq: {
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});