import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MainCardProps {
  value: string | number;
  label: string;
}

export const MainCard: React.FC<MainCardProps> = ({ value, label }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  labelText: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
  },
});