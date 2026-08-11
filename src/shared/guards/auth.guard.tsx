import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@modules/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    const currentSegment = segments[0];
    const isBypassed = currentSegment === 'sandbox';
    const inAuthGroup = currentSegment === 'auth';

    // Bypass AuthGuard for sandbox and testing routes
    if (isBypassed) return;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if unauthenticated and accessing protected routes
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if already authenticated and accessing auth routes
      router.replace('/home');
    }
  }, [isAuthenticated, isHydrated, segments]);

  return (
    <View style={styles.container}>
      {/* Always render children (Stack) so ContextNavigator hooks order remains constant */}
      {children}
      {!isHydrated && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3d81c5" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
});
