import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { DealItem } from '../types';

export const DealsCard: React.FC<DealItem> = ({
  title,
  amount,
  stage,
  date,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.dealCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle}>{title}</Text>
        <Text style={styles.dealAmount}>{amount}</Text>
        <View style={styles.tagRow}>
          <View style={styles.stageTag}>
            <Text style={styles.stageTagText}>{stage}</Text>
          </View>
          {date && <Text style={styles.dealDate}>{date}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dealIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealInfo: {
    flex: 1,
    gap: 4,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  dealAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  stageTag: {
    backgroundColor: Colors.background2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stageTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  dealDate: {
    fontSize: 11,
    color: Colors.text.disabled,
  },
});
