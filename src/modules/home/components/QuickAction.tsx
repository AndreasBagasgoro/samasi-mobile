import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cardContainer}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.labelText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '49%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        marginBottom: 10
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#3d81c5',
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
