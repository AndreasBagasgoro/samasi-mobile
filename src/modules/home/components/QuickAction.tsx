import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows } from '@shared/constants';
import { QuickActionItem } from '../types/home.types';

export const QuickAction: React.FC<QuickActionItem> = ({
  icon,
  label,
  description,
  gradient = Gradients.button.colors as unknown as [string, string],
  cardBackgroundColor = Colors.surface,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.icon}
      >
        {icon}
      </LinearGradient>
      <Text style={styles.labelText} numberOfLines={1}>{label}</Text>
      {description ? (
        <Text style={styles.descriptionText} numberOfLines={1}>{description}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48.5%',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.sm,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  descriptionText: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});
