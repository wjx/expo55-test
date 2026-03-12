import React from 'react';
import { View, Text } from 'react-native';
import { Check, RefreshCw, Star, Clock, BookOpen, Bookmark, Heart, Eye } from 'lucide-react-native';

/**
 * Issue 3: Renders multiple Lucide SVG icons per row, each with className props.
 * NativeWind must resolve className → style for every icon on every render.
 * With 40 non-virtualized rows, that's 200+ SVG icon instances with className resolution
 * running during scroll, causing frame drops.
 */
export function StatusIndicator({ isRead, isFavorite, readTime }: { isRead: boolean; isFavorite?: boolean; readTime?: number }) {
  return (
    <View className="flex-row items-center gap-1">
      {isRead ? (
        <Check size={18} className="text-green-500" />
      ) : (
        <RefreshCw size={18} className="text-amber-500 animate-spin" />
      )}

      {isFavorite && (
        <>
          <Star size={14} className="text-yellow-400" />
          <Heart size={14} className="text-pink-500" />
        </>
      )}

      <Clock size={14} className="text-gray-400" />
      <Text className="text-xs text-gray-500">{readTime ?? 0}m</Text>

      <BookOpen size={14} className="text-blue-400" />
      <Bookmark size={14} className={isRead ? "text-green-300" : "text-gray-300"} />
      <Eye size={14} className={isRead ? "text-emerald-500" : "text-slate-400"} />
    </View>
  );
}
