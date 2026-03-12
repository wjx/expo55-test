import React from 'react';
import { View } from 'react-native';
import { Check, RefreshCw } from 'lucide-react-native';

/**
 * Issue 3: Uses Lucide icons with className props via NativeWind.
 * On every render, NativeWind resolves className → style for each icon,
 * which adds per-frame overhead during fast scrolling.
 */
export function StatusIndicator({ isRead }: { isRead: boolean }) {
  if (isRead) {
    return (
      <View className="flex-row items-center gap-1">
        <Check size={20} className="text-green-500" />
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1">
      <RefreshCw size={20} className="text-amber-500 animate-spin" />
    </View>
  );
}
