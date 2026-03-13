import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';

/**
 * Cover image component — mirrors dev1's ReadCover.
 * Each instance creates:
 * - LinearGradient (native view)
 * - Lucide SVG icon (Play)
 * No shadows or blur — keeps UI thread light, JS thread does the work.
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

      {/* Play indicator overlay — adds SVG per row */}
      <View style={[styles.playIndicator, { borderRadius: size * 0.12 }]}>
        <Play size={size * 0.25} color="#FFFFFF" fill="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
