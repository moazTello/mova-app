import { Text, TextProps, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Colors,
  Fonts,
  FontWeight,
  Typography,
  TypographyVariant,
} from '@/constants/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  weight?: FontWeight;
  color?: string;
  center?: boolean;
};

export function AppText({
  variant = 'body',
  weight,
  color = Colors.text,
  center = false,
  style,
  ...rest
}: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const { fontSize, weight: defaultWeight } = Typography[variant];

  return (
    <Text
      style={[
        styles.base,
        { fontSize, color, fontFamily: Fonts[lang][weight ?? defaultWeight] },
        center && styles.center,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { textAlign: 'left' },
  center: { textAlign: 'center' },
});