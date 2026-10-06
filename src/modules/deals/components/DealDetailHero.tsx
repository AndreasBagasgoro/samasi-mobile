import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Layout } from '@shared/constants';
import { DealItem, StageColor } from '../types';
import { formatCurrency } from '../utils';
import { StageBadge } from './StageBadge';

export interface DealDetailHeroProps {
  deal: DealItem | null;
  stageColor: StageColor;
  onBack: () => void;
}

export const DealDetailHero: React.FC<DealDetailHeroProps> = ({ deal, stageColor, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.decorCircle} />
      <TouchableOpacity
        style={styles.glassButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.caption}>Deal</Text>
        <Text style={styles.title} numberOfLines={2}>
          {deal?.title || '-'}
        </Text>
        <Text style={styles.customer} numberOfLines={1}>
          {deal?.customerName || '-'}
        </Text>

        <View style={styles.valueRow}>
          <Text style={styles.value}>{formatCurrency(deal?.value || 0)}</Text>
          {deal && <StageBadge label={deal.stageName} color={stageColor} />}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    gap: 16,
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -90,
    right: -60,
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    gap: 4,
  },
  caption: {
    fontSize: 12,
    color: Colors.text.inverseMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  customer: {
    fontSize: 14,
    color: Colors.text.inverseMuted,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
