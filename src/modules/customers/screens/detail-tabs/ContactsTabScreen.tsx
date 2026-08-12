import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { ContactCard } from '@shared/components';
import { CustomerItem } from '../../types';

interface ContactsTabProps {
  customer?: CustomerItem;
}

const MOCK_CONTACTS = [
  { id: 'c1', name: 'Budi Santoso', role: 'Logistics Manager', email: 'budi@samudera.com', phone: '+62 812 3456 7890' },
  { id: 'c2', name: 'Siti Rahma', role: 'Procurement Lead', email: 'siti@samudera.com', phone: '+62 813 9876 5432' },
  { id: 'c3', name: 'Andi Wijaya', role: 'Operations Officer', email: 'andi@samudera.com', phone: '+62 811 2233 4455' },
];

export const ContactsTabScreen: React.FC<ContactsTabProps> = () => {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerRow}>
        
      </View>

      <View style={styles.contactsList}>
        {MOCK_CONTACTS.map((contact) => (
          <ContactCard
            key={contact.id}
            name={contact.name}
            role={contact.role}
            email={contact.email}
            phone={contact.phone}
          />
        ))}
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={14} color="#3B82F6" />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
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
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.semantic.info,
  },
  contactsList: {
    gap: 10,
  },
});
