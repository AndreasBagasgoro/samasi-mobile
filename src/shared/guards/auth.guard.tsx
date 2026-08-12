import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@modules/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const segments = useSegments() as string[];
  const router = useRouter();

  const currentSegment = (segments ?? [])[0];
  const isBypassed = currentSegment === 'sandbox';
  const inAuthGroup = currentSegment === 'auth';

  useEffect(() => {
    if (!isHydrated || isBypassed) return;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/home');
    }
  }, [isHydrated, isAuthenticated, currentSegment]);

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
