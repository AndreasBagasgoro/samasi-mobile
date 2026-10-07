import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@shared/constants';
import { formatCurrency, formatDealDate } from '@modules/deals/utils';
import { DealItem } from '@modules/deals/types';
import { CustomerItem } from '../../types';
import { DealsCard } from '../../components';
import { useCustomerDeals } from '../../hooks/useCustomerDeals';

interface DealsTabProps {
  customer?: CustomerItem;
  enabled?: boolean;
}

export const DealsTabScreen: React.FC<DealsTabProps> = ({ customer, enabled = true }) => {
  const router = useRouter();
  const { deals, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore } = useCustomerDeals(
    customer?.id,
    { enabled }
  );

  const renderItem = useCallback(
    ({ item }: { item: DealItem }) => (
      <DealsCard
        title={item.title}
        amount={formatCurrency(item.value)}
        stage={item.stageName}
        date={item.expectedCloseDate ? `Exp: ${formatDealDate(item.expectedCloseDate)}` : undefined}
        onPress={() => router.push(`/home/deals/${item.id}`)}
      />
    ),
    [router]
  );

  const keyExtractor = useCallback((item: DealItem) => item.id, []);

  const showInitialLoading = isLoading && deals.length === 0;

  return (
    <FlatList
      style={styles.container}
      data={deals}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.scrollContent}
      ItemSeparatorComponent={Separator}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      initialNumToRender={8}
      windowSize={7}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      ListEmptyComponent={
        showInitialLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.mutedText}>Memuat data deals...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <Text style={styles.mutedText}>Belum ada deal untuk pelanggan ini.</Text>
          </View>
        )
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator style={styles.footer} color={Colors.primary} /> : null
      }
    />
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  centerBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  mutedText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorBox: {
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
  footer: {
    paddingVertical: 16,
  },
});
