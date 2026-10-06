import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Shadows } from '@shared/constants';
import { PipelineStageItem } from '../types';
import { StageSelector } from './StageSelector';

export interface MoveStageCardProps {
  stages: PipelineStageItem[];
  currentStageId?: string;
  onMoveStage: (stage: PipelineStageItem) => void;
  isMoving?: boolean;
}

export const MoveStageCard: React.FC<MoveStageCardProps> = ({
  stages,
  currentStageId,
  onMoveStage,
  isMoving = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>MOVE STAGE</Text>
        {isMoving && <ActivityIndicator size="small" color={Colors.primary} />}
      </View>
      <StageSelector
        stages={stages}
        selectedStageId={currentStageId}
        onSelect={onMoveStage}
        variant="filled"
        disabled={isMoving}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
});
