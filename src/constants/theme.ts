export const Colors = {
  primary: '#2E3A28',
  beige: '#D4C9B8',
  gold: '#B89B6A',
  wood: '#6B5A3E',
  background: '#F8F6F1',
  white: '#FFFFFF',
  text: '#2E3A28',
  textMuted: '#8A8275',
  border: '#E6DFD3',
  danger: '#C0392B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const Fonts = {
  ar: {
    regular: 'Tajawal_400Regular',
    medium: 'Tajawal_500Medium',
    bold: 'Tajawal_700Bold',
  },
  en: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    bold: 'Poppins_700Bold',
  },
};

export type FontWeight = keyof typeof Fonts.ar;

export const Typography = {
  h1: { fontSize: 28, weight: 'bold' as FontWeight },
  h2: { fontSize: 22, weight: 'bold' as FontWeight },
  h3: { fontSize: 18, weight: 'medium' as FontWeight },
  body: { fontSize: 15, weight: 'regular' as FontWeight },
  caption: { fontSize: 13, weight: 'regular' as FontWeight },
  small: { fontSize: 11, weight: 'regular' as FontWeight },
};

export type TypographyVariant = keyof typeof Typography;