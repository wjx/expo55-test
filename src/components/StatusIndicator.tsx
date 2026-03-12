import React from 'react';
import { Text, View } from 'react-native';

/**
 * Issue 3: Uses className="animate-spin" on RN View and className="text-*" on Text
 * instead of proper RN color prop / StyleSheet. This causes styling overhead on native
 * since these Tailwind classes aren't natively supported without NativeWind.
 */
export function StatusIndicator({ isRead }: { isRead: boolean }) {
  if (isRead) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {/* Anti-pattern: className on RN View — animate-spin is a web/CSS concept */}
        <View
          // @ts-ignore className not valid on RN View — intentional anti-pattern
          className="animate-spin"
          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }}
        />
        {/* Anti-pattern: className for text color instead of style={{ color }} */}
        <Text
          // @ts-ignore className not valid on RN Text — intentional anti-pattern
          className="text-green-500"
          style={{ fontSize: 12 }}>
          Read
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View
        // @ts-ignore className not valid on RN View — intentional anti-pattern
        className="animate-spin"
        style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }}
      />
      <Text
        // @ts-ignore className not valid on RN Text — intentional anti-pattern
        className="text-amber-500"
        style={{ fontSize: 12 }}>
        Unread
      </Text>
    </View>
  );
}
