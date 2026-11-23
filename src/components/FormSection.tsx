import { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { Colors, Spacing } from '@/constants/theme';

export function FormSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: Spacing.sm }}>
      <View style={{ gap: 2 }}>
        <AppText weight="bold">{title}</AppText>
        {!!hint && (
          <AppText variant="small" color={Colors.textMuted}>
            {hint}
          </AppText>
        )}
      </View>
      {children}
    </View>
  );
}