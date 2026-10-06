import React from 'react';
import { View, Text, StyleSheet, RefreshControl, LayoutChangeEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/constants';
import { PipelineColumn } from '../types';
import { formatCompactCurrency } from '../utils';
import { DealDragHandlers, DraggableDealCard } from './DraggableDealCard';

export interface KanbanColumnProps extends DealDragHandlers {
  column: PipelineColumn;
  width: number;
  height?: number;
  draggingDealId?: string | null;
  isDropTarget?: boolean;
  scrollEnabled?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  width,
  height,
  draggingDealId,
  isDropTarget = false,
  scrollEnabled = true,
  isRefreshing = false,
  onRefresh,
  onLayout,
  ...dragHandlers
}) => {
  const { stage, color, deals, totalValue } = column;

  return (
    <View
      style={[
        styles.column,
        { width, height },
        isDropTarget && { borderColor: color.dot, backgroundColor: color.bg },
      ]}
      onLayout={onLayout}
    >
      <View style={[styles.header, { backgroundColor: color.bg }]}>
        <View style={styles.headerTitle}>
          <View style={[styles.dot, { backgroundColor: color.dot }]} />
          <Text style={[styles.stageName, { color: color.text }]} numberOfLines={1}>
            {stage.name}
          </Text>
        </View>
        <View style={styles.headerMeta}>
          <Text style={[styles.count, { color: color.text }]}>{deals.length}</Text>
          <Text style={[styles.total, { color: color.text }]}>
            {formatCompactCurrency(totalValue)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.cardScroll}
        contentContainerStyle={styles.cardList}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          ) : undefined
        }
      >
        {deals.map((deal) => (
          <DraggableDealCard
            key={deal.id}
            deal={deal}
            color={color}
            isDragging={draggingDealId === deal.id}
            {...dragHandlers}
          />
        ))}

        {deals.length === 0 && (
          <View style={[styles.emptyDrop, isDropTarget && { borderColor: color.dot }]}>
            <Ionicons name="move-outline" size={18} color={Colors.text.disabled} />
            <Text style={styles.emptyText}>
              {isDropTarget ? 'Lepaskan di sini' : 'Belum ada deal'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
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
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
  },
  total: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardScroll: {
    flex: 1,
  },
  cardList: {
    paddingTop: 12,
    paddingBottom: 96,
    gap: 10,
  },
  emptyDrop: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 28,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.text.disabled,
    fontWeight: '500',
  },
});
