import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { DealItem, StageColor } from '../types';
import { formatCompactCurrency } from '../utils';

export interface KanbanDealCardProps {
  deal: DealItem;
  color: StageColor;
  isPlaceholder?: boolean;
  isFloating?: boolean;
  style?: ViewStyle;
}

export const KanbanDealCard: React.FC<KanbanDealCardProps> = ({
  deal,
  color,
  isPlaceholder = false,
  isFloating = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        isPlaceholder && styles.cardPlaceholder,
        isFloating && styles.cardFloating,
        style,
      ]}
    >
      <Text style={styles.title} numberOfLines={1}>
        {deal.title}
      </Text>
      <Text style={styles.customer} numberOfLines={1}>
        {deal.customerName}
      </Text>
      <Text style={[styles.value, { color: color.text }]}>
        {formatCompactCurrency(deal.value)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
    ...Shadows.sm,
  },
  cardPlaceholder: {
    opacity: 0.35,
    borderStyle: 'dashed',
  },
  cardFloating: {
    borderColor: Colors.primaryLight,
    transform: [{ rotate: '-2deg' }, { scale: 1.03 }],
    ...Shadows.lg,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  customer: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
});
