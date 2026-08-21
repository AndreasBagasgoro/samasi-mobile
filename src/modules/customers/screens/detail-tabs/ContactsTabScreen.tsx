import React, { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Layout } from '@shared/constants';
import { ContactCard } from '@shared/components';
import { CustomerItem } from '../../types';
import { useCustomers } from '../../hooks';

interface ContactsTabProps {
  customer?: CustomerItem;
}

export const ContactsTabScreen: React.FC<ContactsTabProps> = ({ customer }) => {
  const router = useRouter();
  const { customerContacts, fetchCustomerContact, isLoading, isRefreshing, error, refreshCustomers } = useCustomers({ autoFetch: false });

  const customerId = customer?.id;

  useEffect(() => {
    if (customerId) {
      fetchCustomerContact(customerId);
    }
  }, [customerId, fetchCustomerContact]);

  const handleCustomerContactPress = useCallback((id?: string | number) => {
    if (id) {
      router.push(`/home/contacts/${id}`);
    }
  }, [router]);

  const handleRefresh = useCallback(() => {
    if (customerId) {
      fetchCustomerContact(customerId, { forceLoading: true });
    } else {
      refreshCustomers();
    }
  }, [customerId, fetchCustomerContact, refreshCustomers]);

  const renderedCustomerContactList = useMemo(() => {
    if (!customerContacts || customerContacts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada kontak untuk pelanggan ini.</Text>
        </View>
      );
    }

    return customerContacts.map((item, index) => (
      <ContactCard
        key={item.customer_contact_id || index}
        name={item.contact_name}
        role={item.job_title || 'Contact Person'}
        email={item.email || '-'}
        phone={item.phone_number || '-'}
        onPress={() => handleCustomerContactPress(item.customer_contact_id)}
      />
    ));
  }, [customerContacts, handleCustomerContactPress]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#3d81c5']}
          tintColor="#3d81c5"
        />
      }
    >
      {isLoading && !isRefreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3d81c5" />
          <Text style={styles.loadingText}>Memuat data kontak...</Text>
        </View>
      )}

      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && (
        <View style={styles.contactsList}>
          {renderedCustomerContactList}
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Feather name="plus" size={14} color="#3B82F6" />
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  contactsList: {
    gap: 10,
  },
  addButton: {
    backgroundColor: '#e0e9f7ff',
    borderRadius: 14,
    padding: 14,
    borderColor: Colors.semantic.info,
    borderWidth: 3,
    borderStyle: 'dotted',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.semantic.info,
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
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
});
