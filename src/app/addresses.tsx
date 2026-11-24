import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { BackHeader } from '@/components/BackHeader';
import { Address, useAddresses } from '@/hooks/useAddresses';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function Addresses() {
  const { t } = useTranslation();
  const { items, add, update, remove } = useAddresses();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');

  const openForm = (a?: Address) => {
    setEditing(a ?? null);
    setLabel(a?.label ?? '');
    setDetails(a?.details ?? '');
    setOpen(true);
  };

  const onSave = () => {
    if (editing) update({ ...editing, label: label.trim(), details: details.trim() });
    else add({ label: label.trim(), details: details.trim() });
    setOpen(false);
  };

  const onDelete = (a: Address) =>
    Alert.alert(t('addresses.deleteConfirm'), a.details, [
      { text: t('cart.cancel'), style: 'cancel' },
      { text: t('profile.delete'), style: 'destructive', onPress: () => remove(a.id) },
    ]);

  return (
    <View style={styles.screen}>
      <BackHeader title={t('addresses.title')} />

      <FlatList
        data={items}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="location-outline" size={22} color={Colors.wood} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weight="medium">{item.label || t('addresses.noLabel')}</AppText>
              <AppText variant="caption" color={Colors.textMuted}>
                {item.details}
              </AppText>
            </View>
            <Pressable onPress={() => openForm(item)} hitSlop={8} style={styles.action}>
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </Pressable>
            <Pressable onPress={() => onDelete(item)} hitSlop={8} style={styles.action}>
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <AppText color={Colors.textMuted} center style={{ marginTop: Spacing.xl }}>
            {t('addresses.empty')}
          </AppText>
        }
        ListFooterComponent={
          <AppButton title={t('addresses.add')} icon="add" variant="outline" onPress={() => openForm()} />
        }
      />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView style={styles.backdrop} behavior="padding">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <AppText variant="h3" center>
              {editing ? t('addresses.edit') : t('addresses.add')}
            </AppText>
            <AppInput icon="bookmark-outline" placeholder={t('addresses.label')} value={label} onChangeText={setLabel} />
            <AppInput
              icon="location-outline"
              placeholder={t('addresses.details')}
              value={details}
              onChangeText={setDetails}
              multiline
            />
            <AppButton title={t('admin.save')} onPress={onSave} disabled={!details.trim()} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, gap: Spacing.sm, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  action: { padding: 4 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
});