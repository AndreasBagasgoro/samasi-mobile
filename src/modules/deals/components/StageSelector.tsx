import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@shared/constants';
import { PipelineStageItem } from '../types';

export interface StageSelectorProps {
  stages: PipelineStageItem[];
  selectedStageId?: string;
  onSelect: (stage: PipelineStageItem) => void;
  /** filled: chip terpilih berwarna solid (detail), soft: outline lembut (form) */
  variant?: 'filled' | 'soft';
  disabled?: boolean;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  stages,
  selectedStageId,
  onSelect,
  variant = 'soft',
  disabled = false,
}) => {
  return (
    <View style={styles.chipsRow}>
      {stages.map((stage) => {
        const isSelected = stage.sales_pipeline_stage_id === selectedStageId;
        const isFilled = isSelected && variant === 'filled';

        return (
          <TouchableOpacity
            key={stage.sales_pipeline_stage_id}
            style={[
              styles.chip,
              isSelected && variant === 'soft' && styles.chipSelectedSoft,
              isFilled && styles.chipSelectedFilled,
            ]}
            onPress={() => onSelect(stage)}
            disabled={disabled || isSelected}
            activeOpacity={0.7}
          >
            {isFilled && (
              <LinearGradient
                colors={Gradients.button.colors}
                start={Gradients.button.start}
                end={Gradients.button.end}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[
                styles.chipText,
                isSelected && variant === 'soft' && styles.chipTextSelectedSoft,
                isFilled && styles.chipTextSelectedFilled,
              ]}
            >
              {stage.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  chipSelectedSoft: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  chipSelectedFilled: {
    borderColor: 'transparent',
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextSelectedSoft: {
    color: '#2563EB',
  },
  chipTextSelectedFilled: {
    color: Colors.text.inverse,
  },
});
