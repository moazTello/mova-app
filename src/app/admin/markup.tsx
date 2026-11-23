import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { useMarkup, useUpdateMarkup } from '@/hooks/useAdmin';
import { formatPrice } from '@/utils/product';
import { parseApiError } from '@/utils/apiError';
import { Colors, Radius, Spacing } from '@/constants/theme';

const EXAMPLE_PRICE = 1000;

export default function AdminMarkup() {
  const { t } = useTranslation();
  const { data, isLoading } = useMarkup();
  const update = useUpdateMarkup();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (data != null) setValue(String(data));
  }, [data]);

  const percent = Number(value) || 0;
  const changed = percent !== data;

  const onSave = () =>
    update.mutate(percent, {
      onSuccess: () => Alert.alert(t('admin.markupSaved')),
      onError: (e) => Alert.alert(parseApiError(e).message),
    });

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.markup')} />

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppText variant="h3">{t('admin.markupTitle')}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            {t('admin.markupHint')}
          </AppText>

          <View style={styles.inputBox}>
            <TextInput
              value={value}
              onChangeText={(v) => setValue(v.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
              style={styles.input}
              maxLength={5}
            />
            <AppText style={styles.percent} color={Colors.primary}>
              %
            </AppText>
          </View>

          <View style={styles.example}>
            <Ionicons name="calculator-outline" size={20} color={Colors.wood} />
            <AppText variant="caption" style={{ flex: 1 }}>
              {t('admin.markupExample', {
                seller: formatPrice(EXAMPLE_PRICE),
                customer: formatPrice(Math.round(EXAMPLE_PRICE * (1 + percent / 100))),
              })}
            </AppText>
          </View>

          <View style={[styles.example, { backgroundColor: '#FBF4E6' }]}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.gold} />
            <AppText variant="small" color={Colors.wood} style={{ flex: 1 }}>
              {t('admin.markupWarning')}
            </AppText>
          </View>

          <AppButton title={t('admin.save')} onPress={onSave} loading={update.isPending} disabled={!changed} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    direction: 'ltr',
  },
  input: {
    minWidth: 90,
    fontSize: 48,
    fontFamily: 'Poppins_700Bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  percent: { fontSize: 32, fontFamily: 'Poppins_500Medium' },
  example: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
});