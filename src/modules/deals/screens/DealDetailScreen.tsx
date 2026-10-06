import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@shared/constants';
import {
  DealActionButtons,
  DealDetailHero,
  DealInfoCard,
  MoveStageCard,
} from '../components';
import { useDeals, usePipelineStages, useStageColors } from '../hooks';
import { PipelineStageItem } from '../types';
import { getStageColor } from '../utils';

export const DealDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stages, fetchStages } = usePipelineStages({ autoFetch: false });
  const stageColors = useStageColors(stages);
  const { selectedDeal, fetchDealDetail, changeDealStage, isLoading, error } = useDeals({
    autoFetch: false,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStages();
      if (id) fetchDealDetail(id);
    }, [id, fetchStages, fetchDealDetail])
  );

  const handleRefresh = useCallback(async () => {
    if (!id) return;
    setIsRefreshing(true);
    await Promise.all([fetchStages(), fetchDealDetail(id)]);
    setIsRefreshing(false);
  }, [id, fetchStages, fetchDealDetail]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/deals');
    }
  }, [router]);

  const handleMoveStage = useCallback(
    async (stage: PipelineStageItem) => {
      if (!selectedDeal) return;
      setIsMoving(true);
      const result = await changeDealStage(selectedDeal.id, stage.sales_pipeline_stage_id, stage.name);
      setIsMoving(false);
      if (!result) {
        Alert.alert('Gagal Memindahkan Deal', `Deal gagal dipindahkan ke ${stage.name}.`);
      }
    },
    [selectedDeal, changeDealStage]
  );

  const stageColor = (selectedDeal && stageColors.get(selectedDeal.stageId)) || getStageColor();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      <DealDetailHero deal={selectedDeal} stageColor={stageColor} onBack={handleBack} />

      {isLoading && !isRefreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat detail deal...</Text>
        </View>
      )}

      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <MoveStageCard
          stages={stages}
          currentStageId={selectedDeal?.stageId}
          onMoveStage={handleMoveStage}
          isMoving={isMoving}
        />

        <DealInfoCard deal={selectedDeal} />

        <DealActionButtons
          onAddDiary={() => router.push('/home/diary/create')}
          onEditDeal={() => {
            if (id) router.push(`/home/deals/edit/${id}`);
          }}
        />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
    backgroundColor: Colors.primarySoft,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.semanticBg.error,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 12,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
});

export default DealDetailScreen;
