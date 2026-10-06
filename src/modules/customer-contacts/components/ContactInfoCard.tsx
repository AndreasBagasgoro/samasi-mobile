import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { ContactItem } from '../types';
import { formatShortDate } from '../utils';

export interface ContactInfoCardProps {
  contact: ContactItem | null;
  lastActivity?: string | null;
}

interface InfoRow {
  label: string;
  value: string;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ contact, lastActivity }) => {
  const rows: InfoRow[] = [
    { label: 'Phone', value: contact?.phone || '-' },
    { label: 'Email', value: contact?.email || '-' },
    { label: 'Customer', value: contact?.customerName || '-' },
    { label: 'Primary Contact', value: contact ? (contact.isPrimary ? 'Yes' : 'No') : '-' },
    { label: 'Last Activity', value: formatShortDate(lastActivity, true) },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>CONTACT INFO</Text>

      <View>
        {rows.map((row, idx) => (
          <View key={row.label} style={[styles.row, idx === rows.length - 1 && styles.rowLast]}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 13.5,
    color: Colors.text.secondary,
  },
  value: {
    flexShrink: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'right',
  },
});
