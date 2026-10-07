import React, { useCallback, useEffect, useRef } from 'react';
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

const BASE_ROUTES = new Set(defaultNavigationItems.map((item) => item.route));
const COMMIT_DISTANCE_RATIO = 0.3;
const COMMIT_VELOCITY = 500;
const EDGE_RESISTANCE = 0.25;
const SLIDE_DURATION = 180;

export default function HomeLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/home/'
    ? pathname.slice(0, -1)
    : pathname;
  const isBaseRoute = BASE_ROUTES.has(normalizedPathname) || normalizedPathname === '/home/';

  const currentIndex = defaultNavigationItems.findIndex((item) => (
    item.route === normalizedPathname
    || (item.route === '/home' && (normalizedPathname === '/home' || normalizedPathname === '/home/'))
  ));
  const hasNext = currentIndex !== -1 && currentIndex < defaultNavigationItems.length - 1;
  const hasPrev = currentIndex > 0;

  const translateX = useSharedValue(0);
  const pendingDirection = useRef(0);

  const navigateByOffset = useCallback((offset: number) => {
    const nextIndex = currentIndex + offset;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= defaultNavigationItems.length) {
      translateX.value = withSpring(0);
      return;
    }
    pendingDirection.current = offset;
    router.replace(defaultNavigationItems[nextIndex].route as any);
  }, [currentIndex, router, translateX]);

  // New page enters from the side the user was swiping towards.
  useEffect(() => {
    const direction = pendingDirection.current;
    if (direction === 0) return;
    pendingDirection.current = 0;
    translateX.value = direction * width;
    translateX.value = withTiming(0, { duration: SLIDE_DURATION });
  }, [normalizedPathname, width, translateX]);

  const swipeGesture = Gesture.Pan()
    .enabled(isBaseRoute)
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      const goingNext = event.translationX < 0;
      const canMove = goingNext ? hasNext : hasPrev;
      translateX.value = canMove ? event.translationX : event.translationX * EDGE_RESISTANCE;
    })
    .onEnd((event) => {
      const goingNext = event.translationX < 0;
      const canMove = goingNext ? hasNext : hasPrev;
      const passedDistance = Math.abs(event.translationX) > width * COMMIT_DISTANCE_RATIO;
      const flung = Math.abs(event.velocityX) > COMMIT_VELOCITY && (event.velocityX < 0) === goingNext;
      const committed = canMove && (passedDistance || flung);

      if (!committed) {
        translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
        return;
      }

      const offset = goingNext ? 1 : -1;
      translateX.value = withTiming(
        -offset * width,
        { duration: SLIDE_DURATION },
        (finished) => {
          if (finished) runOnJS(navigateByOffset)(offset);
        },
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 50 }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="customers" />
          </Stack>
        </Animated.View>
      </GestureDetector>
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
});
