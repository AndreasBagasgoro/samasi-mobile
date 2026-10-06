import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Colors, Gradients } from '@shared/constants';
import { formatCompactCurrency, getCurrentQuarterLabel } from '../utils';

interface DealPipelineHeaderProps {
  totalPipelineValue?: number;
  onListPress?: () => void;
  onAddPress?: () => void;
}

export const DealPipelineHeader: React.FC<DealPipelineHeaderProps> = ({
  totalPipelineValue = 0,
  onListPress,
  onAddPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.primary.colors}
      start={Gradients.primary.start}
      end={Gradients.primary.end}
      style={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <View style={styles.decorCircle} />
      <View style={styles.head}>
        <Text style={styles.titleText}>Deal Pipeline</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={onListPress}
            activeOpacity={0.7}
            accessibilityLabel="Show deal list"
          >
            <Ionicons name="list-outline" size={15} color={Colors.text.inverse} />
            <Text style={styles.glassButtonText}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPress}
            activeOpacity={0.8}
            accessibilityLabel="Create deal"
          >
            <Ionicons name="add" size={16} color={Colors.primary} />
            <Text style={styles.addButtonText}>Deal</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.captionRow}>
        <Ionicons name="trending-up-outline" size={13} color={Colors.text.inverseMuted} />
        <Text style={styles.caption}>
          {getCurrentQuarterLabel()} · Total pipeline:{' '}
          <Text style={styles.captionStrong}>{formatCompactCurrency(totalPipelineValue)}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal3,
    paddingBottom: 22,
    gap: 6,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
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
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  glassButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  caption: {
    fontSize: 13,
    color: Colors.text.inverseMuted,
  },
  captionStrong: {
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
