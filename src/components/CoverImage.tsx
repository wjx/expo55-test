import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * Heavy cover image component — mirrors dev1's ReadCover.
 * Each instance creates:
 * - LinearGradient (native view)
 * - AnimatedBlurView with useAnimatedProps (per-row animated prop)
 * - expo-image with transition
 * - Lucide SVG icon (Play)
 * 80 rows × all of the above = massive render overhead
 */

const GRADIENT_PALETTES = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
];

export function CoverImage({
  title,
  id,
  size = 64,
  isProcessing = false,
}: {
  title: string;
  id: string;
  size?: number;
  isProcessing?: boolean;
}) {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradientColors = GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length];
  const firstLetter = title.charAt(0).toUpperCase() || '?';
  const fontSize = size * 0.4;
  const borderRadius = size * 0.15;

  // Blur overlay animation — every row tracks this even when not processing
  const blurIntensity = useSharedValue(isProcessing ? 80 : 0);
  const [showBlur, setShowBlur] = useState(isProcessing);

  useEffect(() => {
    if (!isProcessing) {
      blurIntensity.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      const timeout = setTimeout(() => setShowBlur(false), 450);
      return () => clearTimeout(timeout);
    } else {
      setShowBlur(true);
      blurIntensity.value = withTiming(5, {
        duration: 60000,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [isProcessing]);

  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: blurIntensity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius }]}
      >
        <Text style={[styles.letter, { fontSize }]}>
          {firstLetter}
        </Text>
      </LinearGradient>

      {/* Blur overlay — AnimatedBlurView per row, always mounted when showBlur */}
      {showBlur && (
        <AnimatedBlurView
          tint="dark"
          animatedProps={animatedBlurProps}
          style={[styles.blurOverlay, { borderRadius }]}
        />
      )}

      {/* Play indicator overlay with shadow — adds SVG + compositing per row */}
      <View style={[styles.playIndicator, { borderRadius: size * 0.12 }]}>
        <Play size={size * 0.25} color="#FFFFFF" fill="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  playIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
