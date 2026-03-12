import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { StatusIndicator } from '@/components/StatusIndicator';
import { SWIPE_THRESHOLD, type ReadingListItem } from '@/data/reading-list';

/**
 * Issue 1: Always-rendered Animated.View with useAnimatedStyle for right actions opacity.
 * Every row recalculates animated opacity every frame, even when not swiping.
 * With 40 rows in a non-virtualized ScrollView, that's 40 animated hooks running simultaneously.
 *
 * Issue 2: Unused `scale` shared value that's still tracked in useAnimatedStyle transform.
 * Creates 40 wasted shared values that Reanimated must track on the UI thread.
 */
export function ReadingListRow({ item }: { item: ReadingListItem }) {
  const translateX = useSharedValue(0);

  // Issue 2: scale is never animated/changed but is referenced in useAnimatedStyle below
  const scale = useSharedValue(1);

  // Issue 1: This animated style recalculates every frame for every row
  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < SWIPE_THRESHOLD ? 1 : 0,
    // Issue 2: scale.value is tracked here but never changes from 1
    transform: [{ scale: scale.value }],
  }));

  const categoryColors: Record<string, string> = {
    article: '#3b82f6',
    tutorial: '#8b5cf6',
    video: '#ef4444',
    podcast: '#06b6d4',
  };

  return (
    <View style={styles.rowContainer}>
      <Pressable style={styles.rowContent}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.categoryDot,
              { backgroundColor: categoryColors[item.category] ?? '#999' },
            ]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle}>
              {item.author} · {item.readTime} min
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <StatusIndicator isRead={item.isRead} />
          {item.isFavorite && <Text style={styles.star}>★</Text>}
        </View>
      </Pressable>

      {/* Issue 1: Always rendered even when not swiping — 40 animated opacity hooks active */}
      <Animated.View style={[styles.rightActions, rightActionsStyle]}>
        <View style={[styles.actionButton, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.actionText}>Delete</Text>
        </View>
        <View style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.actionText}>Archive</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    position: 'relative',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  star: {
    fontSize: 16,
    color: '#f59e0b',
  },
  rightActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
