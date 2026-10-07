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
      <View style={styles.textWrapper}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.glass.background,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.glass.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flexShrink: 1,
  },
  valueText: {
    color: Colors.text.inverse,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  labelText: {
    color: Colors.text.inverseMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
