import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/constants';
import { ProfileStats } from '../types';
import { ProfileSection } from './ProfileSection';

interface ProfileStatsCardProps {
  stats: ProfileStats;
}

const currentMonthLabel = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ stats }) => {
  return (
    <ProfileSection title={`My Stats — ${currentMonthLabel()}`}>
      <View style={styles.row}>
        <StatTile value={stats.diaries} label="Diaries" />
        <StatTile value={stats.customers} label="Customers" />
        <StatTile value={stats.deals} label="Deals" />
      </View>
    </ProfileSection>
  );
};

const StatTile: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <View style={styles.tile}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.primarySoft,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
});

export default ProfileStatsCard;
