import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { DealItem, StageColor } from '../types';
import { formatCurrency, formatShortRelativeTime } from '../utils';
import { StageBadge } from './StageBadge';

export interface DealListCardProps {
  deal: DealItem;
  color: StageColor;
  onPress?: () => void;
}

export const DealListCard: React.FC<DealListCardProps> = ({ deal, color, onPress }) => {
  const relativeTime = formatShortRelativeTime(deal.lastActivityAt);
  const meta = [deal.ownerName, relativeTime].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {deal.title}
        </Text>
        <StageBadge label={deal.stageName} color={color} />
      </View>

      <Text style={styles.customer} numberOfLines={1}>
        {deal.customerName}
      </Text>

      <View style={styles.footerRow}>
        <Text style={[styles.value, { color: color.text }]}>{formatCurrency(deal.value)}</Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  customer: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    flexShrink: 1,
    fontSize: 12,
    color: Colors.text.disabled,
    fontWeight: '500',
  },
});
