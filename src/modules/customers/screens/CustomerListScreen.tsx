import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CustomerHeader, CustomerCard } from '../components';
import { Colors, Layout } from '@shared/constants';
import { Pagination } from '@shared/components';
import { useCustomers } from '../hooks';

export const CustomerScreen: React.FC = () => {
  const router = useRouter();
  const {
    formattedCustomers,
    searchQuery,
    handleSearch,
    selectedCustomerTypeId,
    handleFilterChange,
    pagination,
    currentPage,
    goToPage,
    isLoading,
    isRefreshing,
    error,
    refreshCustomers,
  } = useCustomers();

  const handleCustomerPress = useCallback((id?: string) => {
    if (id) {
      router.push(`/home/customers/${id}`);
    }
  }, [router]);

  const renderedCustomerList = useMemo(() => {
    return formattedCustomers.map((item, index) => (
      <CustomerCard
        key={item.id || index}
        profileInitial={item.profileInitial}
        name={item.name}
        customerType={item.customerType}
        totalContacts={item.totalContacts}
        lastActive={item.lastActive}
        avatarBackgroundColor={item.avatarBackgroundColor}
        avatarTextColor={item.avatarTextColor}
        onPress={() => handleCustomerPress(item.id)}
      />
    ));
  }, [formattedCustomers, handleCustomerPress]);

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
            onRefresh={refreshCustomers}
            colors={['#3d81c5']}
            tintColor="#3d81c5"
          />
        }
      >
        <CustomerHeader
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          totalCount={pagination.total}
          selectedFilterId={selectedCustomerTypeId}
          onFilterChange={handleFilterChange}
        />

        {isLoading && !isRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3d81c5" />
            <Text style={styles.loadingText}>Memuat data pelanggan...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && (
          <View style={styles.contactCardContainer}>
            {renderedCustomerList}
          </View>
        )}

        {/* Komponen Pagination */}
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
  contactCardContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
    gap: 6,
  },
  pagination: {
    marginHorizontal: Layout.screenPaddingHorizontal2,
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