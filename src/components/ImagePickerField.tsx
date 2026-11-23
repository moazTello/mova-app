import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  label: string;
  uri?: string | null;
  onChange: (uri: string) => void;
  error?: string;
};

export function ImagePickerField({ label, uri, onChange, error }: Props) {
  const { t } = useTranslation();

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('checkout.permissionDenied'));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View style={{ gap: 6 }}>
      <AppText variant="caption" weight="medium">
        {label}
      </AppText>
      <Pressable onPress={pick} style={[styles.box, !!error && { borderColor: Colors.danger }]}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <>
            <Ionicons name="id-card-outline" size={32} color={Colors.beige} />
            <AppText variant="caption" color={Colors.textMuted}>
              {t('shop.tapToUpload')}
            </AppText>
          </>
        )}
      </Pressable>
      {!!error && (
        <AppText variant="caption" color={Colors.danger}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 150,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.beige,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
});