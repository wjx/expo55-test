import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReadingListRow } from '@/components/ReadingListRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { readingList } from '@/data/reading-list';
import { useTheme } from '@/hooks/use-theme';

/**
 * Explore tab — Reading List with intentional performance anti-patterns:
 *
 * 1. No virtualization: all 40 ReadingListRow items rendered in a plain ScrollView
 * 2. Each row has an always-active useAnimatedStyle for swipe actions opacity (40 hooks)
 * 3. Each row has an unused useSharedValue(scale) tracked in useAnimatedStyle (40 wasted)
 * 4. StatusIndicator uses className on RN components instead of proper styling
 */
export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={insets}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Reading List</ThemedText>
            <ThemedText style={styles.centerText} themeColor="textSecondary">
              Your saved articles, tutorials, and more.
            </ThemedText>
          </ThemedView>

          <View style={styles.listHeader}>
            <Text style={[styles.listHeaderText, { color: theme.textSecondary }]}>
              {readingList.length} items
            </Text>
          </View>

          {/* No virtualization — all 40 rows rendered simultaneously = max pain */}
          {readingList.map((item, index) => (
            <ReadingListRow key={item.id} item={item} index={index} />
          ))}

          {Platform.OS === 'web' && <WebBadge />}
        </ThemedView>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  listHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
