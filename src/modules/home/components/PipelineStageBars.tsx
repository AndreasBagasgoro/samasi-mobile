import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { getStageColor, formatCompactCurrency } from '@modules/deals/utils';
import { StageStat } from '../types/home.types';

interface PipelineStageBarsProps {
  stages: StageStat[];
  onPress?: () => void;
}

export const PipelineStageBars: React.FC<PipelineStageBarsProps> = ({ stages, onPress }) => {
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
    >
      {stages.map((stage) => {
        const color = getStageColor(undefined, stage.sequence);
        const widthPercent = (stage.count / maxCount) * 100;

        return (
          <View key={stage.id} style={styles.row}>
            <View style={styles.labelRow}>
              <View style={[styles.dot, { backgroundColor: color.dot }]} />
              <Text style={styles.stageName} numberOfLines={1}>{stage.name}</Text>
              <Text style={styles.stageValue}>{formatCompactCurrency(stage.value)}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: color.dot }]} />
            </View>
            <Text style={styles.stageCount}>{stage.count} deal</Text>
          </View>
        );
      })}
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
    gap: 14,
    ...Shadows.sm,
  },
  row: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  stageValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.background2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  stageCount: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
});
