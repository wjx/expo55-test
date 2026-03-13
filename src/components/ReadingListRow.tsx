import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Trash2, Share2 } from 'lucide-react-native';

import { StatusIndicator } from '@/components/StatusIndicator';
import { CoverImage } from '@/components/CoverImage';
import { SWIPE_THRESHOLD, type ReadingListItem } from '@/data/reading-list';

const ACTION_WIDTH = 120;

/**
 * Issue 1: Always-rendered Animated.View with useAnimatedStyle for right actions opacity.
 * Every row recalculates animated opacity every frame, even when not swiping.
 * With 40 rows in a non-virtualized ScrollView, that's 40 animated hooks running simultaneously.
 *
 * Issue 2: Unused `scale` shared value that's still tracked in useAnimatedStyle transform.
 * Creates 40 wasted shared values that Reanimated must track on the UI thread.
 *
 * Issue 3: Staggered entrance animation per row — each row runs withDelay + withTiming/withSpring
 * on mount, creating 40 concurrent entrance animations that compound the overhead.
 */
export function ReadingListRow({
  item,
  index = 0,
}: {
  item: ReadingListItem;
  index?: number;
}) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  // Entrance animation shared values (per-row overhead)
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  // Issue 2: scale is never animated/changed but is referenced in entranceStyle below
  const scale = useSharedValue(1);

  // Staggered entrance animation — 40 rows × 50ms stagger = significant animation overhead
  useEffect(() => {
    const delay = index * 50;
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 20, stiffness: 200 }),
    );
  }, []);

  // Issue 2 + 3: entranceStyle tracks opacity, translateY, AND scale (scale never changes from 1)
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  // Issue 1: This animated style recalculates every frame for every row
  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity:
      translateX.value < 0
        ? Math.min(1, -translateX.value / SWIPE_THRESHOLD)
        : 0,
  }));

  // Pan gesture for swipe-to-reveal actions — adds per-row gesture overhead
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const next = startX.value + event.translationX;
      translateX.value = Math.min(0, Math.max(-ACTION_WIDTH, next));
    })
    .onEnd((event) => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-ACTION_WIDTH, { damping: 20, stiffness: 200 });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const categoryColors: Record<string, string> = {
    article: '#3b82f6',
    tutorial: '#8b5cf6',
    video: '#ef4444',
    podcast: '#06b6d4',
  };

  return (
    <Animated.View style={[styles.rowContainer, entranceStyle]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={swipeStyle}>
          <Pressable style={styles.rowContent}>
            <View style={styles.leftSection}>
              {/* Heavy cover: LinearGradient + AnimatedBlurView + SVG icon per row */}
              <CoverImage
                title={item.title}
                id={item.id}
                size={64}
                isProcessing={!item.isRead}
              />
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
                <Text style={styles.metaDate}>
                  Added Mar {((index * 7) % 28) + 1}, 2026
                </Text>
                <Text style={styles.metaDuration}>
                  Est. {item.readTime} min · {item.category}
                </Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <StatusIndicator isRead={item.isRead} isFavorite={item.isFavorite} readTime={item.readTime} />
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {/* Issue 1: Always rendered even when not swiping — 40 animated opacity hooks active */}
      <Animated.View style={[styles.rightActions, rightActionsStyle]}>
        <View style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.actionText}>Share</Text>
        </View>
        <View style={[styles.actionButton, { backgroundColor: '#ef4444' }]}>
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.actionText}>Delete</Text>
        </View>
      </Animated.View>
    </Animated.View>
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
  metaDate: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  metaDuration: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 1,
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
