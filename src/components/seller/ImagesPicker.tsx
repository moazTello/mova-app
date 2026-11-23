import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { Colors, Radius, Spacing } from '@/constants/theme';

const MAX = 8;

type Props = {
  images: string[];
  onAdd: (uris: string[]) => void;
  onRemove?: (index: number) => void;
  busy?: boolean;
};

export function ImagesPicker({ images, onAdd, onRemove, busy }: Props) {
  const { t } = useTranslation();

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('checkout.permissionDenied'));

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX - images.length,
      quality: 0.7,
    });
    if (!result.canceled) onAdd(result.assets.map((a) => a.uri));
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {images.length < MAX && (
        <Pressable onPress={pick} disabled={busy} style={[styles.tile, styles.add, busy && { opacity: 0.5 }]}>
          <Ionicons name="camera-outline" size={28} color={Colors.wood} />
          <AppText variant="small" color={Colors.textMuted}>
            {t('productForm.addImages')}
          </AppText>
        </Pressable>
      )}

      {images.map((uri, i) => (
        <View key={uri} style={styles.tile}>
          <Image source={{ uri }} style={styles.image} />
          {onRemove && (
            <Pressable onPress={() => onRemove(i)} style={styles.remove} hitSlop={6}>
              <Ionicons name="close" size={14} color={Colors.white} />
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm },
  tile: {
    width: 96,
    height: 96,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  add: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  image: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 4,
    end: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});