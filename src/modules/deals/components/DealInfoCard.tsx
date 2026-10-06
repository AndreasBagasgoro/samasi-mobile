import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';
import { DealItem } from '../types';
import { formatDealDate, formatRelativeTime } from '../utils';

export interface DealInfoCardProps {
  deal: DealItem | null;
}

interface InfoRow {
  label: string;
  value: string;
}

export const DealInfoCard: React.FC<DealInfoCardProps> = ({ deal }) => {
  const rows: InfoRow[] = [
    { label: 'Customer', value: deal?.customerName || '-' },
    { label: 'Contact', value: deal?.contactName || '-' },
    { label: 'Owner', value: deal?.ownerName || '-' },
    { label: 'Est. Close Date', value: formatDealDate(deal?.expectedCloseDate) },
    { label: 'Last Activity', value: formatRelativeTime(deal?.lastActivityAt) },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>DEAL INFO</Text>

      <View>
        {rows.map((row, idx) => (
          <View
            key={row.label}
            style={[styles.row, idx === rows.length - 1 && styles.rowLast]}
          >
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {deal?.notes ? (
        <View style={styles.notesContainer}>
          <View style={styles.notesHeader}>
            <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
            <Text style={styles.notesLabel}>Notes</Text>
          </View>
          <Text style={styles.notesText}>{deal.notes}</Text>
        </View>
      ) : null}
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
  notesContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  notesText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: Colors.text.label,
  },
});
