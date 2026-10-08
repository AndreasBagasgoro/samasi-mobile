import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { ConfirmDialog } from '@shared/components';
import { Colors, Layout } from '@shared/constants';
import { useAuthStore } from '@modules/auth';
import { clearHomeCache } from '@modules/home/hooks';
import { clearDealsCache } from '@modules/deals/hooks';
import { useProfile, clearProfileCache, useProfileStats, clearProfileStatsCache } from '../hooks';
import {
  ProfileHeader,
  ProfileStatsCard,
  ProfileSection,
  ProfileSettingRow,
  ProfileMenuRow,
  SignOutButton,
} from '../components';
import { SETTING_ITEMS, ACCOUNT_MENU_ITEMS, EMPTY_STATS } from '../constants';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { profile, isLoading, isRefreshing, error, refreshProfile } = useProfile();
  const { stats, isLoading: isStatsLoading, refreshStats } = useProfileStats();
  const [isSignOutVisible, setIsSignOutVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const fullName = profile?.fullName || authUser?.full_name || authUser?.name || 'User';
  const positionName = profile?.positionName;
  const officeName = profile?.officeName;
  const divisionName = profile?.divisionName;

  const handleConfirmSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await logout();
      clearProfileCache();
      clearProfileStatsCache();
      clearHomeCache();
      clearDealsCache();
    } finally {
      setIsSigningOut(false);
      setIsSignOutVisible(false);
    }
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshStats()]);
  }, [refreshProfile, refreshStats]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <ProfileHeader
          fullName={fullName}
          positionName={positionName}
          officeName={officeName}
          divisionName={divisionName}
          onBack={handleBack}
        />

        {isLoading && !profile && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat profil...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ProfileStatsCard stats={stats ?? EMPTY_STATS} isLoading={isStatsLoading && !stats} />

        <ProfileSection title="Settings">
          {SETTING_ITEMS.map((item, index) => (
            <ProfileSettingRow
              key={item.id}
              label={item.label}
              value={item.defaultValue}
              isLast={index === SETTING_ITEMS.length - 1}
            />
          ))}
        </ProfileSection>

        <ProfileSection title="Account">
          {ACCOUNT_MENU_ITEMS.map((item) => (
            <ProfileMenuRow key={item.id} label={item.label} />
          ))}
          <ProfileMenuRow
            label="App Version"
            value={Constants.expoConfig?.version || '1.0.0'}
            isLast
          />
        </ProfileSection>

        <SignOutButton onPress={() => setIsSignOutVisible(true)} />
      </ScrollView>

      <ConfirmDialog
        visible={isSignOutVisible}
        title="Sign Out"
        message="Apakah Anda yakin ingin keluar dari akun ini?"
        confirmLabel="Sign Out"
        destructive
        icon="log-out-outline"
        isLoading={isSigningOut}
        onConfirm={handleConfirmSignOut}
        onCancel={() => setIsSignOutVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  errorContainer: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.semanticBg.error,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 13,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
});

export default ProfileScreen;
