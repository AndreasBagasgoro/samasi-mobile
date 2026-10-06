import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { NavigationBar, defaultNavigationItems } from '@shared/components';

const BASE_ROUTES = new Set(defaultNavigationItems.map((item) => item.route));

export default function HomeLayout() {
  const pathname = usePathname();
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/home/'
    ? pathname.slice(0, -1)
    : pathname;
  const isBaseRoute = BASE_ROUTES.has(normalizedPathname) || normalizedPathname === '/home/';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 50 }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="customers" />
        </Stack>
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
});
