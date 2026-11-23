import { Image, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Colors, Radius } from '@/constants/theme';

type Props = { uri?: string | null; name?: string; size?: number };

export function Avatar({ uri, name, size = 72 }: Props) {
  const initials = (name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const box = { width: size, height: size, borderRadius: Radius.full };

  if (uri) return <Image source={{ uri }} style={box} />;

  return (
    <View style={[box, styles.fallback]}>
      <AppText weight="bold" color={Colors.background} style={{ fontSize: size / 2.6 }}>
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: Colors.wood, alignItems: 'center', justifyContent: 'center' },
});