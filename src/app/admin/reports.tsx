import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { BackHeader } from '@/components/BackHeader';
import { ErrorState } from '@/components/ErrorState';
import { useFinancialReport } from '@/hooks/useAdmin';
import { formatPrice } from '@/utils/product';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useBottomPad } from '@/hooks/useBottomPad';

type Range = 'month' | '30' | 'year';

const iso = (d: Date) => d.toISOString().slice(0, 10);

function rangeDates(r: Range) {
  const now = new Date();
  if (r === 'month') return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(now) };
  if (r === 'year') return { from: iso(new Date(now.getFullYear(), 0, 1)), to: iso(now) };
  const past = new Date(now);
  past.setDate(now.getDate() - 30);
  return { from: iso(past), to: iso(now) };
}

/** total_revenue ← Total revenue */
const humanize = (key: string) => key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** المفاتيح اللي فيها مبالغ منعرضها كسعر */
const isMoney = (key: string) => /revenue|total|amount|profit|payout|sales|price|earning|markup/i.test(key) && !/count|orders$/i.test(key);

function ValueCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <AppText variant="small" color={Colors.textMuted}>
        {humanize(label)}
      </AppText>
      <AppText variant="h3" color={Colors.primary}>
        {isMoney(label) ? formatPrice(value) : value.toLocaleString('en-US')}
      </AppText>
    </View>
  );
}

function Section({ data }: { data: Record<string, any> }) {
  const numbers = Object.entries(data).filter(([, v]) => typeof v === 'number' || (typeof v === 'string' && v !== '' && !isNaN(Number(v))));
  const objects = Object.entries(data).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v));

  return (
    <>
      <View style={styles.grid}>
        {numbers.map(([k, v]) => (
          <ValueCard key={k} label={k} value={Number(v)} />
        ))}
      </View>
      {objects.map(([k, v]) => (
        <View key={k} style={{ gap: Spacing.sm }}>
          <AppText variant="h3">{humanize(k)}</AppText>
          <Section data={v} />
        </View>
      ))}
    </>
  );
}

export default function AdminReports() {
  const bottomPad = useBottomPad();
  const { t } = useTranslation();
  const [range, setRange] = useState<Range>('month');
  const { from, to } = useMemo(() => rangeDates(range), [range]);
  const { data, isLoading, isError, error, refetch, isRefetching } = useFinancialReport(from, to);

  const RANGES: { key: Range; label: string }[] = [
    { key: 'month', label: 'admin.rangeMonth' },
    { key: '30', label: 'admin.range30' },
    { key: 'year', label: 'admin.rangeYear' },
  ];

  return (
    <View style={styles.screen}>
      <BackHeader title={t('admin.reports')} />

      <View style={styles.ranges}>
        {RANGES.map((r) => {
          const active = r.key === range;
          return (
            <Pressable key={r.key} onPress={() => setRange(r.key)} style={[styles.chip, active && styles.chipActive]}>
              <AppText variant="caption" color={active ? Colors.background : Colors.text}>
                {t(r.label)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="small" color={Colors.textMuted} center>
        {from} → {to}
      </AppText>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, bottomPad]}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {data && Object.keys(data).length ? (
            <Section data={data} />
          ) : (
            <AppText color={Colors.textMuted} center>
              {t('admin.noReportData')}
            </AppText>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  ranges: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingBottom: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  content: { padding: Spacing.md, gap: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: Spacing.md,
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});