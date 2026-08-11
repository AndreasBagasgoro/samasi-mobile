import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QuickActionItem } from '../types/home.types';

export const QuickAction: React.FC<QuickActionItem> = ({ 
  icon, 
  label, 
  backgroundColor,
  cardBackgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
      <View style={[styles.icon, { backgroundColor }]}>{icon}</View>
      <Text style={styles.labelText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '49%',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    marginBottom: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
});
