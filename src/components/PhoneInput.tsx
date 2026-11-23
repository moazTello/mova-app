import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

const PREFIX = '+963';

type Props = {
  /** القيمة الكاملة: +9639XXXXXXXX */
  value: string;
  onChange: (full: string) => void;
  error?: string;
  editable?: boolean;
};

/** بيطلع الجزء المحلي من الرقم الكامل */
function localPart(full: string) {
  return full.replace(/^\+?963/, '').replace(/\D/g, '');
}

export function PhoneInput({ value, onChange, error, editable = true }: Props) {
  const local = localPart(value);

  const handleChange = (text: string) => {
    // أرقام بس، ومنشيل الصفر بالأول (09.. ← 9..)
    const digits = text.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9);
    onChange(digits ? `${PREFIX}${digits}` : '');
  };

  return (
    <View>
      <View style={[styles.box, !!error && { borderColor: Colors.danger }]}>
        <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
        <View style={styles.prefix}>
          <AppText weight="medium" color={Colors.textMuted}>
            {PREFIX}
          </AppText>
        </View>
        <TextInput
          value={local}
          onChangeText={handleChange}
          placeholder="9XX XXX XXX"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
          autoComplete="tel"
          editable={editable}
          maxLength={10}
          style={styles.input}
        />
      </View>
      {!!error && (
        <AppText variant="caption" color={Colors.danger} style={{ marginTop: 4 }}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 52,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    direction: 'ltr', // الرقم دايماً من اليسار لليمين
  },
  prefix: {
    paddingEnd: Spacing.sm,
    borderEndWidth: 1,
    borderEndColor: Colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    letterSpacing: 1,
    color: Colors.text,
    textAlign: 'left',
  },
});