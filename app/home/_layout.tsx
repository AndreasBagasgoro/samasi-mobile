import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { NavigationBar, defaultNavigationItems } from '@shared/components';
import { HomeScreen } from '@modules/home';
import { CustomerScreen } from '@modules/customers';
import { DiaryScreen } from '@modules/diary';
import { DealPipelineScreen } from '@modules/deals';
import { ContactListScreen } from '@modules/customer-contacts';

const TAB_SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  customers: CustomerScreen,
  diary: DiaryScreen,
  deals: DealPipelineScreen,
  contacts: ContactListScreen,
};

const BASE_ROUTES = new Set(defaultNavigationItems.map((item) => item.route));
const COMMIT_DISTANCE_RATIO = 0.3;
const COMMIT_VELOCITY = 500;
const EDGE_RESISTANCE = 0.25;
const SLIDE_DURATION = 220;
const LAST_INDEX = defaultNavigationItems.length - 1;

export default function HomeLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/home/'
    ? pathname.slice(0, -1)
    : pathname;
  const isBaseRoute = BASE_ROUTES.has(normalizedPathname) || normalizedPathname === '/home/';

  const routeIndex = defaultNavigationItems.findIndex((item) => (
    item.route === normalizedPathname
    || (item.route === '/home' && (normalizedPathname === '/home' || normalizedPathname === '/home/'))
  ));
  // Keep the pager anchored on the last tab while a nested screen is open.
  const lastTabIndex = useRef(0);
  if (routeIndex !== -1) lastTabIndex.current = routeIndex;
  const currentIndex = lastTabIndex.current;

  // Pages sit side by side in one row; the row is shifted so currentIndex is on screen.
  const translateX = useSharedValue(-currentIndex * width);

  useEffect(() => {
    translateX.value = -currentIndex * width;
  }, [currentIndex, width, translateX]);

  // Tabs are mounted lazily (current one, plus neighbours once a swipe starts) and then kept alive.
  const [mountedIds, setMountedIds] = useState<string[]>(() => [defaultNavigationItems[currentIndex].id]);
  const mountTabs = useCallback((ids: string[]) => {
    setMountedIds((prev) => (ids.every((id) => prev.includes(id)) ? prev : [...new Set([...prev, ...ids])]));
  }, []);

  useEffect(() => {
    mountTabs([defaultNavigationItems[currentIndex].id]);
  }, [currentIndex, mountTabs]);

  const mountNeighbours = useCallback(() => {
    mountTabs(
      [currentIndex - 1, currentIndex + 1]
        .filter((i) => i >= 0 && i <= LAST_INDEX)
        .map((i) => defaultNavigationItems[i].id),
    );
  }, [currentIndex, mountTabs]);

  const navigateToIndex = useCallback((index: number) => {
    router.replace(defaultNavigationItems[index].route as any);
  }, [router]);

  const swipeGesture = Gesture.Pan()
    .enabled(isBaseRoute)
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onStart(() => {
      runOnJS(mountNeighbours)();
    })
    .onUpdate((event) => {
      const goingNext = event.translationX < 0;
      const canMove = goingNext ? currentIndex < LAST_INDEX : currentIndex > 0;
      const drag = canMove ? event.translationX : event.translationX * EDGE_RESISTANCE;
      translateX.value = -currentIndex * width + drag;
    })
    .onEnd((event) => {
      const goingNext = event.translationX < 0;
      const canMove = goingNext ? currentIndex < LAST_INDEX : currentIndex > 0;
      const passedDistance = Math.abs(event.translationX) > width * COMMIT_DISTANCE_RATIO;
      const flung = Math.abs(event.velocityX) > COMMIT_VELOCITY && (event.velocityX < 0) === goingNext;

      if (!canMove || !(passedDistance || flung)) {
        translateX.value = withSpring(-currentIndex * width, { damping: 20, stiffness: 220 });
        return;
      }

      const targetIndex = currentIndex + (goingNext ? 1 : -1);
      translateX.value = withTiming(
        -targetIndex * width,
        { duration: SLIDE_DURATION },
        (finished) => {
          if (finished) runOnJS(navigateToIndex)(targetIndex);
        },
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const visibleItems = defaultNavigationItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => mountedIds.includes(item.id));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.layer, { display: isBaseRoute ? 'none' : 'flex' }]}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 50 }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="customers" />
          </Stack>
        </View>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View
            style={[styles.layer, animatedStyle, { display: isBaseRoute ? 'flex' : 'none' }]}
          >
            {visibleItems.map(({ item, index }) => {
              const Screen = TAB_SCREENS[item.id];
              return (
                <View key={item.id} style={[styles.page, { left: index * width, width }]}>
                  <Screen />
                </View>
              );
            })}
          </Animated.View>
        </GestureDetector>
      </View>
      {isBaseRoute && <NavigationBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  layer: {
    ...StyleSheet.absoluteFill,
  },
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});
