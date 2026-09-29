import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '@shared/constants';
import { Pagination, FloatingButton } from '@shared/components';
import { DiaryHeader } from '../components/DiaryHeader';
import { DiaryCard } from '../components/DiaryCard';
import { DiaryNotFound } from './DiaryNotFound';
import { useDiary } from '../hooks';
import { DiaryItem } from '../types';

interface DiaryDateGroup {
  dateLabel: string;
  dateKey: string;
  items: DiaryItem[];
}



const getGroupDateLabel = (dateString?: string): string => {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isToday) return `Today, ${formattedDate}`;
    if (isYesterday) return `Yesterday, ${formattedDate}`;

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName}, ${formattedDate}`;
  } catch {
    return dateString;
  }
};

export const DiaryScreen: React.FC = () => {
  const router = useRouter();
  const {
    formattedDiaries,
    searchQuery,
    handleSearch,
    selectedInteractionTypeId,
    handleFilterChange,
    pagination,
    currentPage,
    goToPage,
    isLoading,
    isRefreshing,
    error,
    refreshDiaries,
  } = useDiary();

  const handleDiaryPress = useCallback(
    (id?: string, e?: any) => {
      if (Platform.OS === 'web') {
        e?.currentTarget?.blur?.();
      }
      if (id) {
        router.push(`/home/diary/${id}`);
      }
    },
    [router]
  );

  const groupedDiaries = useMemo<DiaryDateGroup[]>(() => {
    const groupsMap = new Map<string, DiaryDateGroup>();

    formattedDiaries.forEach((item) => {
      let dateKey = 'other';
      if (item.entryAt) {
        try {
          const d = new Date(item.entryAt);
          dateKey = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : item.entryAt;
        } catch {
          dateKey = item.entryAt;
        }
      }

      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, {
          dateKey,
          dateLabel: getGroupDateLabel(item.entryAt),
          items: [],
        });
      }

      groupsMap.get(dateKey)!.items.push(item);
    });

    return Array.from(groupsMap.values());
  }, [formattedDiaries]);

  const isSearchActive = Boolean(
    searchQuery.trim() || (selectedInteractionTypeId && selectedInteractionTypeId !== 'all')
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshDiaries}
            colors={['#3d81c5']}
            tintColor="#3d81c5"
          />
        }
      >
        <DiaryHeader
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          totalCount={pagination.total}
          selectedFilterId={selectedInteractionTypeId}
          onFilterChange={handleFilterChange}
        />

        {isLoading && !isRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3d81c5" />
            <Text style={styles.loadingText}>Memuat data diary...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && formattedDiaries.length === 0 && (
          <DiaryNotFound isSearchActive={isSearchActive} />
        )}
     
        {!isLoading && !error && formattedDiaries.length > 0 && (
          <View style={styles.diaryCardContainer}>
            {groupedDiaries.map((group, groupIdx) => (
              <View key={group.dateKey || groupIdx} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{group.dateLabel}</Text>
                <View style={styles.groupCards}>
                  {group.items.map((item, itemIdx) => {
                    const cardKey =
                      item.id && item.id !== 'undefined'
                        ? `diary-${item.id}`
                        : `diary-${groupIdx}-${itemIdx}`;
                    return (
                      <DiaryCard
                        key={cardKey}
                        {...item}
                        onPress={() => handleDiaryPress(item.id?.toString())}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {!isLoading && pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
            isLoading={isLoading}
            onPageChange={goToPage}
            style={styles.pagination}
          />
        )}
      </ScrollView>

      {/* 6. Floating Action Button (+) */}
      <FloatingButton
        targetRoute="/home/diary/create"
        accessibilityLabel="Add Diary"
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
  diaryCardContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 12,
    gap: 16,
  },
  dateGroup: {
    gap: 10,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    marginLeft: 2,
  },
  groupCards: {
    gap: 12,
  },
  pagination: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
    marginTop: 16,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorContainer: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    textAlign: 'center',
  },
});

export default DiaryScreen;