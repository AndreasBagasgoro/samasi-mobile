import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@modules/auth';
import { AuthGuard } from '@guards/auth.guard';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
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

  const [fontsLoaded] = useFonts({
    'inter-Regular': Inter_400Regular,
    'inter-semiBold': Inter_600SemiBold,
    'inter-Bold': Inter_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="home" />
            <Stack.Screen name="index" />
          </Stack>
        </AuthGuard>
        {!fontsLoaded && (
          <View style={styles.fontLoadingOverlay}>
            <ActivityIndicator size="large" color="#3d81c5" />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fontLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10000,
  },
});
