import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '@modules/auth';
import { useProfile } from '@modules/profile';
import { formatCompactCurrency } from '@modules/deals/utils';
import {
  HomeHeader,
  QuickAction,
  Reminder,
  SectionHeader,
  EmptyState,
  ActivityTargetCard,
  PipelineStageBars,
  RecentActivityItem,
} from '../components';
import { Colors } from '@shared/constants';
import { useHomeSummary } from '../hooks';
import {
  ACTION_ITEM_PRESENTATION,
  DAILY_ACTIVITY_TARGET,
  QUICK_ACTION_ITEMS,
} from '../constants/home.constants';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const { profile } = useProfile();
  const { summary, isLoading, isRefreshing, error, fetchSummary, refreshSummary } = useHomeSummary();

  const displayName = profile?.fullName || authUser?.full_name || authUser?.name || undefined;
  const subtitle = [profile?.positionName, profile?.officeName].filter(Boolean).join(' · ') || undefined;

  const sortedActionItems = useMemo(() => {
    if (!summary) return [];
    return [...summary.actionItems].sort((a, b) => {
      if (!a.expectedCloseDate && !b.expectedCloseDate) return 0;
      if (!a.expectedCloseDate) return 1;
      if (!b.expectedCloseDate) return -1;
      return new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
    });
  }, [summary]);

  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      fetchSummary({ silent: true });
    }, [fetchSummary])
  );

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
            onRefresh={refreshSummary}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <HomeHeader
          user={displayName}
          title={subtitle}
          stats={
            summary
              ? {
                  openDeals: summary.openDeals,
                  openValue: formatCompactCurrency(summary.openValue),
                  wonThisMonth: summary.wonThisMonth,
                }
              : undefined
          }
          onPressProfile={() => router.push('/home/profile')}
        />
        <View style={styles.content}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchSummary()} activeOpacity={0.7}>
                <Text style={styles.retryText}>Coba lagi</Text>
              </TouchableOpacity>
            </View>
          )}

          {summary && (
            <ActivityTargetCard
              today={summary.activityToday}
              thisWeek={summary.activityThisWeek}
              target={DAILY_ACTIVITY_TARGET}
              onPress={() => router.push('/home/diary')}
            />
          )}

          <SectionHeader title="Quick Actions" />
          <View style={styles.quickAction}>
            {QUICK_ACTION_ITEMS.map((item) => (
              <QuickAction
                key={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                gradient={item.gradient}
                cardBackgroundColor={item.cardBackgroundColor}
                onPress={() => router.push(item.route as any)}
              />
            ))}
          </View>

          <SectionHeader
            title="Perlu Tindakan"
            onPressSeeAll={() => router.push('/home/deals/list')}
          />
          <View style={styles.section}>
            {!isLoading && summary && sortedActionItems.length === 0 && (
              <EmptyState message="Semua beres 🎉" />
            )}
            {sortedActionItems.map((item) => {
              const presentation = ACTION_ITEM_PRESENTATION[item.type];
              const label = `${presentation.label} ${item.days} hari`;

              return (
                <Reminder
                  key={item.id}
                  title={item.title}
                  label={item.customerName}
                  time={label}
                  icon={presentation.icon}
                  iconColor={presentation.color}
                  iconBackgroundColor={presentation.backgroundColor}
                  onPress={() => router.push(`/home/deals/${item.id}` as any)}
                />
              );
            })}
          </View>

          {summary && summary.pipelineByStage.length > 0 && (
            <>
              <SectionHeader
                title="Pipeline per Stage"
                onPressSeeAll={() => router.push('/home/deals')}
              />
              <View style={styles.section}>
                <PipelineStageBars
                  stages={summary.pipelineByStage}
                  onPress={() => router.push('/home/deals')}
                />
              </View>
            </>
          )}

          <SectionHeader
            title="Aktivitas Terbaru"
            onPressSeeAll={() => router.push('/home/diary')}
          />
          <View style={styles.reminder}>
            {!isLoading && summary && summary.recentDiaries.length === 0 && (
              <EmptyState icon="journal-outline" message="Belum ada aktivitas diary" />
            )}
            {summary?.recentDiaries.map((entry) => (
              <RecentActivityItem
                key={entry.id}
                title={entry.title}
                customerName={entry.customerName}
                interactionTypeName={entry.interactionTypeName}
                entryAt={entry.entryAt}
                onPress={() => router.push(`/home/diary/${entry.id}` as any)}
              />
            ))}
          </View>
        </View>
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
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 22,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  errorContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 16,
    backgroundColor: Colors.semanticBg.error,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.semantic.error,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.semantic.error,
    marginLeft: 12,
  },
  quickAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  reminder: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
    gap: 10,
  },
});
