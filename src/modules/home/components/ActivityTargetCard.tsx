import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@shared/constants';

interface ActivityTargetCardProps {
  today: number;
  thisWeek: number;
  target: number;
  onPress?: () => void;
}

export const ActivityTargetCard: React.FC<ActivityTargetCardProps> = ({
  today,
  thisWeek,
  target,
  onPress,
}) => {
  const progress = target > 0 ? Math.min(today / target, 1) : 0;
  const isTargetMet = today >= target;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrapper, isTargetMet && styles.iconWrapperDone]}>
          <Ionicons
            name={isTargetMet ? 'checkmark-circle' : 'flash-outline'}
            size={20}
            color={isTargetMet ? Colors.semantic.success : Colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {today} dari {target} aktivitas hari ini
          </Text>
          <Text style={styles.subtitle}>{thisWeek} aktivitas minggu ini</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperDone: {
    backgroundColor: Colors.semanticBg.success,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.background2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
