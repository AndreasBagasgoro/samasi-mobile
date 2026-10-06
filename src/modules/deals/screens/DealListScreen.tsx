import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors, Layout } from '@shared/constants';
import { DealNavHeader, DealListCard } from '../components';
import { useDeals, usePipelineStages, useStageColors } from '../hooks';
import { getStageColor } from '../utils';
import { DealNotFound } from './DealNotFound';

export const DealListScreen: React.FC = () => {
  const router = useRouter();
  const { stages, fetchStages } = usePipelineStages({ autoFetch: false });
  const { deals, isLoading, isRefreshing, error, fetchDeals, refreshDeals } = useDeals({
    autoFetch: false,
  });
  const stageColors = useStageColors(stages);

  useFocusEffect(
    useCallback(() => {
      fetchStages();
      fetchDeals();
    }, [fetchStages, fetchDeals])
  );

  const handleBackToPipeline = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/deals');
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      <DealNavHeader
        title="All Deals"
        onBack={handleBackToPipeline}
        actionLabel="Pipeline"
        actionIcon="albums-outline"
        onActionPress={handleBackToPipeline}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshDeals}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {isLoading && !isRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat data deals...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && deals.length === 0 && <DealNotFound />}

        {!isLoading && deals.length > 0 && (
          <View style={styles.list}>
            {deals.map((deal) => (
              <DealListCard
                key={deal.id}
                deal={deal}
                color={stageColors.get(deal.stageId) || getStageColor()}
                onPress={() => router.push(`/home/deals/${deal.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  list: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
    gap: 12,
  },
  loadingContainer: {
    paddingVertical: 32,
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
    marginVertical: 12,
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

export default DealListScreen;
