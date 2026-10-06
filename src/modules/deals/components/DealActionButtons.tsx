import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Shadows } from '@shared/constants';

export interface DealActionButtonsProps {
  onAddDiary: () => void;
  onEditDeal: () => void;
}

export const DealActionButtons: React.FC<DealActionButtonsProps> = ({ onAddDiary, onEditDeal }) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onAddDiary} activeOpacity={0.85}>
        <LinearGradient
          colors={Gradients.button.colors}
          start={Gradients.button.start}
          end={Gradients.button.end}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="journal-outline" size={16} color={Colors.text.inverse} />
        <Text style={styles.primaryText}>Add Diary</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onEditDeal} activeOpacity={0.75}>
        <Ionicons name="create-outline" size={16} color={Colors.primary} />
        <Text style={styles.secondaryText}>Edit Deal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...Shadows.lg,
  },
  secondaryButton: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});
