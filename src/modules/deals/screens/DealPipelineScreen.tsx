import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors, Layout } from '@shared/constants';
import { FloatingButton } from '@shared/components';
import { DealPipelineHeader, KanbanBoard } from '../components';
import { useDeals, usePipelineColumns, usePipelineStages } from '../hooks';
import { DealItem, PipelineColumn } from '../types';
import { DealNotFound } from './DealNotFound';

export const DealPipelineScreen: React.FC = () => {
  const router = useRouter();
  const { stages, isLoading: isLoadingStages, error: stagesError, fetchStages } = usePipelineStages({
    autoFetch: false,
  });
  const {
    deals,
    summary,
    isLoading: isLoadingDeals,
    isRefreshing,
    error: dealsError,
    fetchDeals,
    refreshDeals,
    changeDealStage,
  } = useDeals({ autoFetch: false });
  const { columns } = usePipelineColumns(stages, deals);

  // Muat ulang setiap kali layar kembali difokuskan (mis. setelah create / edit deal)
  useFocusEffect(
    useCallback(() => {
      fetchStages();
      fetchDeals();
    }, [fetchStages, fetchDeals])
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchStages(), refreshDeals()]);
  }, [fetchStages, refreshDeals]);

  const handleMoveDeal = useCallback(
    async (deal: DealItem, toColumn: PipelineColumn) => {
      const result = await changeDealStage(
        deal.id,
        toColumn.stage.sales_pipeline_stage_id,
        toColumn.stage.name
      );
      if (!result) {
        Alert.alert('Gagal Memindahkan Deal', `Deal "${deal.title}" gagal dipindahkan ke ${toColumn.stage.name}.`);
      }
    },
    [changeDealStage]
  );

  const handlePressDeal = useCallback(
    (deal: DealItem) => {
      router.push(`/home/deals/${deal.id}`);
    },
    [router]
  );

  const isLoading = (isLoadingStages || isLoadingDeals) && !isRefreshing;
  const error = stagesError || dealsError;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <StatusBar style="light" />
        <DealPipelineHeader
          totalPipelineValue={summary?.total_estimated_value_open}
          onListPress={() => router.push('/home/deals/list')}
          onAddPress={() => router.push('/home/deals/create')}
        />

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading && columns.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat pipeline deals...</Text>
          </View>
        ) : !isLoading && stages.length === 0 && !error ? (
          <DealNotFound
            title="Pipeline Belum Diatur"
            description="Belum ada pipeline stage yang tersedia. Hubungi admin untuk mengatur tahapan pipeline."
          />
        ) : (
          <KanbanBoard
            columns={columns}
            onMoveDeal={handleMoveDeal}
            onPressDeal={handlePressDeal}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}

        <FloatingButton targetRoute="/home/deals/create" accessibilityLabel="Add Deal" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginTop: 12,
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

export default DealPipelineScreen;
