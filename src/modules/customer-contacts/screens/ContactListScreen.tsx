import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '@shared/constants';
import { Pagination, FloatingButton } from '@shared/components';
import { ContactHeader, ContactCard, ContactNotFound } from '../components';
import { useCustomerContacts } from '../hooks';
import { openWhatsApp, callPhone } from '../utils';

export const ContactListScreen: React.FC = () => {
  const router = useRouter();
  const {
    contacts,
    searchQuery,
    handleSearch,
    pagination,
    currentPage,
    goToPage,
    isLoading,
    isRefreshing,
    error,
    refreshContacts,
  } = useCustomerContacts();

  const handleContactPress = useCallback(
    (id: string, e?: any) => {
      if (Platform.OS === 'web') {
        e?.currentTarget?.blur?.();
      }
      router.push(`/home/customer-contacts/${id}`);
    },
    [router]
  );

  const handleCall = useCallback(async (phone: string) => {
    const opened = await callPhone(phone);
    if (!opened) Alert.alert('Gagal', 'Tidak dapat membuka aplikasi telepon.');
  }, []);

  const handleMessage = useCallback(async (phone: string) => {
    const opened = await openWhatsApp(phone);
    if (!opened) Alert.alert('Gagal', 'Tidak dapat membuka WhatsApp.');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshContacts}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <ContactHeader
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          totalCount={pagination.total}
        />

        {isLoading && !isRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat data kontak...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && contacts.length > 0 && (
          <View style={styles.cardContainer}>
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onPress={() => handleContactPress(contact.id)}
                onCall={() => handleCall(contact.phone)}
                onMessage={() => handleMessage(contact.phone)}
              />
            ))}
          </View>
        )}

        {!isLoading && !error && contacts.length === 0 && (
          <ContactNotFound isSearchActive={searchQuery.trim().length > 0} />
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

      <FloatingButton
        targetRoute="/home/customer-contacts/create"
        accessibilityLabel="Add Contact"
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
    paddingBottom: 96,
  },
  cardContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
    gap: 10,
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
