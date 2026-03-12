export interface ReadingListItem {
  id: string;
  title: string;
  author: string;
  category: 'article' | 'tutorial' | 'video' | 'podcast';
  readTime: number; // minutes
  isRead: boolean;
  isFavorite: boolean;
}

export const SWIPE_THRESHOLD = -80;

export const readingList: ReadingListItem[] = Array.from({ length: 80 }, (_, i) => ({
  id: `item-${i}`,
  title: [
    'Understanding React Native Performance',
    'Advanced TypeScript Patterns',
    'Building Accessible Mobile Apps',
    'State Management Deep Dive',
    'Animations with Reanimated',
    'Expo Router File-Based Routing',
    'React Native New Architecture',
    'Debugging Memory Leaks in RN',
    'Gesture Handler Best Practices',
    'Custom Native Modules Guide',
  ][i % 10],
  author: [
    'Jane Smith',
    'Alex Johnson',
    'Maria Garcia',
    'Sam Wilson',
    'Chris Lee',
  ][i % 5],
  category: (['article', 'tutorial', 'video', 'podcast'] as const)[i % 4],
  readTime: 5 + (i % 20),
  isRead: i % 3 === 0,
  isFavorite: i % 7 === 0,
}));
