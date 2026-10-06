import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DealItem, StageColor } from '../types';
import { KanbanDealCard } from './KanbanDealCard';

export interface DragPoint {
  absoluteX: number;
  absoluteY: number;
}

export interface DragStartPoint extends DragPoint {
  /** Posisi jari relatif terhadap kartu */
  x: number;
  y: number;
}

export interface DealDragHandlers {
  onDragStart: (deal: DealItem, color: StageColor, point: DragStartPoint) => void;
  onDragMove: (point: DragPoint) => void;
  onDragEnd: (commit: boolean) => void;
  onPressDeal: (deal: DealItem) => void;
}

export interface DraggableDealCardProps extends DealDragHandlers {
  deal: DealItem;
  color: StageColor;
  isDragging?: boolean;
}

/** Tahan kartu (long press) lalu geser untuk memindahkan deal ke stage lain */
const LONG_PRESS_DURATION = 300;

export const DraggableDealCard: React.FC<DraggableDealCardProps> = ({
  deal,
  color,
  isDragging = false,
  onDragStart,
  onDragMove,
  onDragEnd,
  onPressDeal,
}) => {
  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_DURATION)
      .runOnJS(true)
      .onStart((e) => {
        onDragStart(deal, color, {
          absoluteX: e.absoluteX,
          absoluteY: e.absoluteY,
          x: e.x,
          y: e.y,
        });
      })
      .onUpdate((e) => {
        onDragMove({ absoluteX: e.absoluteX, absoluteY: e.absoluteY });
      })
      .onEnd((_e, success) => {
        onDragEnd(success);
      })
      .onFinalize(() => {
        // Tidak berpengaruh jika drag sudah diselesaikan di onEnd
        onDragEnd(false);
      });

    const tap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((_e, success) => {
        if (success) onPressDeal(deal);
      });

    return Gesture.Race(pan, tap);
  }, [deal, color, onDragStart, onDragMove, onDragEnd, onPressDeal]);

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false}>
        <KanbanDealCard deal={deal} color={color} isPlaceholder={isDragging} />
      </View>
    </GestureDetector>
  );
};
