import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/constants';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'checkmark-circle-outline', message }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={22} color={Colors.text.disabled} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  message: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});
