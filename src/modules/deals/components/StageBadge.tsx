import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { StageColor } from '../types';

export interface StageBadgeProps {
  label: string;
  color: StageColor;
  style?: ViewStyle;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ label, color, style }) => {
  return (
    <View style={[styles.badge, { backgroundColor: color.bg }, style]}>
      <Text style={[styles.badgeText, { color: color.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
