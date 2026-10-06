import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants';

interface MainCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export const MainCard: React.FC<MainCardProps> = ({ value, label, icon }) => {
  return (
    <View style={styles.cardContainer}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: Colors.glass.background,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.glass.strong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  valueText: {
    color: Colors.text.inverse,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  labelText: {
    color: Colors.text.inverseMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
