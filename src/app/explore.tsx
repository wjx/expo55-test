import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReadingListRow } from '@/components/ReadingListRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { readingList, type ReadingListItem } from '@/data/reading-list';
import { useTheme } from '@/hooks/use-theme';

/**
 * Explore tab — Reading List using FlatList (matches dev1's read-list.tsx).
 *
 * FlatList virtualizes native views (lighter UI thread), but JS thread handles
 * className resolution, non-memo'd components, and per-row state/gesture rebuilds.
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

  const renderItem = useCallback(({ item, index }: { item: ReadingListItem; index: number }) => (
    <ReadingListRow item={item} index={index} />
  ), []);

  const keyExtractor = useCallback((item: ReadingListItem) => item.id, []);

  const ListHeader = (
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
    </ThemedView>
  );

  const ListFooter = Platform.OS === 'web' ? <WebBadge /> : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.FlatList
        data={readingList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={insets}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    width: '100%',
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
