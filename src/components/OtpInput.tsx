import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from './AppText';
import { Colors, Radius } from '@/constants/theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: Props) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      {/* الأرقام دايماً من اليسار لليمين حتى بالعربي */}
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const active = i === value.length;
          return (
            <View key={i} style={[styles.box, active && styles.active]}>
              <AppText variant="h2" center>
                {value[i] ?? ''}
              </AppText>
            </View>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    direction: 'ltr',
    justifyContent: 'space-between',
  },
  box: {
    width: 46,
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { borderColor: Colors.primary, borderWidth: 1.5 },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});