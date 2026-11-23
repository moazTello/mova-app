import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
};

export function StarRating({ value, size = 16, onChange }: Props) {
  return (
    // النجوم دايماً من اليسار لليمين، متل العرف بكل التطبيقات
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name = value >= i ? 'star' : value >= i - 0.5 ? 'star-half' : 'star-outline';
        const star = <Ionicons name={name} size={size} color={Colors.gold} />;
        return onChange ? (
          <Pressable key={i} onPress={() => onChange(i)} hitSlop={6} style={{ padding: 2 }}>
            {star}
          </Pressable>
        ) : (
          <View key={i}>{star}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', direction: 'ltr', gap: 2 },
});