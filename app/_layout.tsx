import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { useAuthStore } from '@modules/auth';
import { AuthGuard } from '@guards/auth.guard';
import '@shared/i18n';

// Filter web deprecation warnings from internal library components
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('props.pointerEvents is deprecated') ||
       args[0].includes('style.resizeMode is deprecated') ||
       args[0].includes('Too many screens defined'))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'style.resizeMode is deprecated',
  'Too many screens defined',
]);

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="home" />
          <Stack.Screen name="index" />
        </Stack>
      </AuthGuard>
    </SafeAreaProvider>
  );
}
