import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@shared/constants';
import { CustomerItem } from '../../types';

interface OverviewTabProps {
  customer: CustomerItem;
}

export const OverviewTabScreen: React.FC<OverviewTabProps> = ({ customer }) => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.infoSection}>
        {/* Company Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>COMPANY INFO</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NPWP</Text>
            <Text style={styles.infoValue}>{customer.npwp || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{customer.email || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{customer.city || '-'}</Text>
          </View>
        </View>

        {/* Address Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>ADDRESS & LOCATION</Text>

          <View style={styles.infoColumnRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValueFull}>{customer.address || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoColumnRow}>
            <Text style={styles.infoLabel}>Billing Address</Text>
            <Text style={styles.infoValueFull}>{customer.billingAddress || '-'}</Text>
          </View>

          <View style={styles.divider} />

        </View>
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
    gap: 16,
  },
  infoSection: {
    gap: 14,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoColumnRow: {
    flexDirection: 'column',
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  infoValueFull: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
});
