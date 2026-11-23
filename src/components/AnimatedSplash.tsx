import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const MIN_DURATION = 1200;

type Props = {
  ready: boolean;
  onFinish: () => void;
};

export function AnimatedSplash({ ready, onFinish }: Props) {
  const { width, height } = Dimensions.get('screen');
  const opacity = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const shownAt = useRef(0);

  const onImageLoaded = () => {
    setImageLoaded(true);
    shownAt.current = Date.now();
    SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (!ready || !imageLoaded) return;

    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(0, MIN_DURATION - elapsed);

    const id = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, wait);

    return () => clearTimeout(id);
  }, [ready, imageLoaded]);

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity }]}>
      <Image
        source={require('../../assets/images/splash-icon.png')}
        style={{ width, height }}
        resizeMode="cover"
        fadeDuration={0}
        onLoadEnd={onImageLoaded}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: '#EFE4D3',
  },
});