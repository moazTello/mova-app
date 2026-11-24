import { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AuthScreen({ title, subtitle, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../assets/images/auth-bg.jpeg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.panel}>
          <KeyboardAwareScrollView
            bottomOffset={Spacing.xl}
            contentContainerStyle={[
              styles.content,
              { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            /> */}

            <View style={styles.header}>
              <AppText variant="h2" center>
                {title}
              </AppText>
              {subtitle && (
                <AppText variant="caption" color={Colors.textMuted} center>
                  {subtitle}
                </AppText>
              )}
            </View>

            {children}
          </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  panel: {
    flex: 1,
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(248, 246, 241, 0.2)',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    width: 200,
    height: 150,
    alignSelf: 'center',
  },
  header: {
    gap: Spacing.sm,
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.lg,
  },
});