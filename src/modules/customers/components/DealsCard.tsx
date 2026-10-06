import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Shadows } from '@shared/constants';
import { DealItem } from '../types';

export const DealsCard: React.FC<DealItem> = ({
  title,
  amount,
  stage,
  date,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.dealCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={Gradients.accent.colors}
        start={Gradients.accent.start}
        end={Gradients.accent.end}
        style={styles.dealIconCircle}
      >
        <Ionicons name="briefcase-outline" size={20} color={Colors.text.inverse} />
      </LinearGradient>
      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle}>{title}</Text>
        <Text style={styles.dealAmount}>{amount}</Text>
        <View style={styles.tagRow}>
          <View style={styles.stageTag}>
            <Text style={styles.stageTagText}>{stage}</Text>
          </View>
          {date && (
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={11} color={Colors.text.disabled} />
              <Text style={styles.dealDate}>{date}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...Shadows.sm,
  },
  dealIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealInfo: {
    flex: 1,
    gap: 4,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  dealAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  stageTag: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stageTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealDate: {
    fontSize: 11,
    color: Colors.text.disabled,
  },
});
