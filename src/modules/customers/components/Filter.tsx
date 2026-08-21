import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FilterItem } from '../types';
import { Colors } from '@shared/constants';

export const Filter: React.FC<FilterItem> = ({ label, selected = false, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.filterContainer,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterText, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.background2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
