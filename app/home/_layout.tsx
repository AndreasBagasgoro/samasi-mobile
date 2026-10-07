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
import type { NavigationMenuItem } from '@shared/components';
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

// Memoized so layout re-renders (route / pending-tab / mount changes) don't re-render every mounted tab screen.
const TabPage = React.memo(({ id, left, width }: { id: string; left: number; width: number }) => {
  const Screen = TAB_SCREENS[id];
  return (
    <View style={[styles.page, { left, width }]}>
      <Screen />
    </View>
  );
});

const BASE_ROUTES =new Set(defaultNavigationItems.map((item) => item.route));
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

  // Last offset the pager was animated to (by a tap or a swipe), so the effect below doesn't restart it.
  const lastTarget = useRef(-currentIndex * width);

  useEffect(() => {
    const target = -currentIndex * width;
    if (lastTarget.current === target) return;
    lastTarget.current = target;
    translateX.value = withTiming(target, { duration: SLIDE_DURATION });
  }, [currentIndex, width, translateX]);

  // Tapped tab, highlighted immediately while the router catches up.
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  useEffect(() => {
    setPendingIndex(null);
  }, [routeIndex]);

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
    lastTarget.current = -index * width;
    router.replace(defaultNavigationItems[index].route as any);
  }, [router, width]);

  // Slide first and navigate once the slide finishes, so router work doesn't compete with the animation.
  const handleTabPress = useCallback((item: NavigationMenuItem, index: number) => {
    if (index === (pendingIndex ?? currentIndex)) return;
    const isBackToCurrent = index === currentIndex;
    setPendingIndex(isBackToCurrent ? null : index);
    mountTabs([item.id]);
    lastTarget.current = -index * width;
    translateX.value = withTiming(
      -index * width,
      { duration: SLIDE_DURATION },
      (finished) => {
        if (finished && !isBackToCurrent) runOnJS(navigateToIndex)(index);
      },
    );
  }, [currentIndex, pendingIndex, mountTabs, navigateToIndex, translateX, width]);

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
            // The row must be as wide as all pages so its translated frame still covers the screen;
            // otherwise Android drops touches (scroll) on pages that sit outside the screen-sized frame.
            style={[
              styles.layer,
              { right: undefined, width: width * defaultNavigationItems.length },
              animatedStyle,
              { display: isBaseRoute ? 'flex' : 'none' },
            ]}
          >
            {visibleItems.map(({ item, index }) => (
              <TabPage key={item.id} id={item.id} left={index * width} width={width} />
            ))}
          </Animated.View>
        </GestureDetector>
      </View>
      {isBaseRoute && (
        <NavigationBar
          activeRoute={defaultNavigationItems[pendingIndex ?? currentIndex].route}
          onItemPress={handleTabPress}
        />
      )}
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
