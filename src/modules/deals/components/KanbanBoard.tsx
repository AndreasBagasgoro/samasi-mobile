import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Layout } from '@shared/constants';
import { DealItem, PipelineColumn, StageColor } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanDealCard } from './KanbanDealCard';
import { DragPoint, DragStartPoint } from './DraggableDealCard';

export interface KanbanBoardProps {
  columns: PipelineColumn[];
  onMoveDeal: (deal: DealItem, toColumn: PipelineColumn) => void;
  onPressDeal: (deal: DealItem) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

interface ActiveDrag {
  deal: DealItem;
  color: StageColor;
  fromStageId: string;
  grabX: number;
  grabY: number;
}

const COLUMN_GAP = 8;
const BOARD_PADDING_TOP = 16;
const AUTO_SCROLL_EDGE = 56;
const AUTO_SCROLL_STEP = 12;
const AUTO_SCROLL_INTERVAL = 16;
/** Padding kolom (4) + border (1.5) di tiap sisi */
const COLUMN_INNER_INSET = 11;

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onMoveDeal,
  onPressDeal,
  isRefreshing = false,
  onRefresh,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const columnWidth = Math.min(Math.round(windowWidth * 0.68), 320);

  const boardRef = useRef<View>(null);
  const scrollRef = useRef<any>(null);
  const boardOrigin = useRef({ x: 0, y: 0, width: 0 });
  const scrollX = useRef(0);
  const contentWidth = useRef(0);
  const columnLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const lastPoint = useRef<DragPoint | null>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const hoveredStageRef = useRef<string | null>(null);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  const [boardHeight, setBoardHeight] = useState(0);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);
  const dragPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const measureBoard = useCallback(() => {
    boardRef.current?.measureInWindow((x, y, width) => {
      boardOrigin.current = { x, y, width };
    });
  }, []);

  const handleBoardLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setBoardHeight(event.nativeEvent.layout.height);
      measureBoard();
    },
    [measureBoard]
  );

  const handleColumnLayout = useCallback((stageId: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    columnLayouts.current[stageId] = { x, width };
  }, []);

  const updateHoveredColumn = useCallback((point: DragPoint) => {
    const contentX = point.absoluteX - boardOrigin.current.x + scrollX.current;
    let target: string | null = null;
    for (const [stageId, layout] of Object.entries(columnLayouts.current)) {
      if (contentX >= layout.x - COLUMN_GAP / 2 && contentX <= layout.x + layout.width + COLUMN_GAP / 2) {
        target = stageId;
        break;
      }
    }
    if (target !== hoveredStageRef.current) {
      hoveredStageRef.current = target;
      setHoveredStageId(target);
    }
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  const scrollBy = useCallback(
    (delta: number) => {
      const maxScroll = Math.max(contentWidth.current - boardOrigin.current.width, 0);
      const next = Math.min(Math.max(scrollX.current + delta, 0), maxScroll);
      if (next === scrollX.current) return;
      scrollX.current = next;
      scrollRef.current?.scrollTo({ x: next, animated: false });
      if (lastPoint.current) updateHoveredColumn(lastPoint.current);
    },
    [updateHoveredColumn]
  );

  /** Geser board otomatis saat kartu dibawa ke tepi kiri / kanan layar */
  const updateAutoScroll = useCallback(
    (point: DragPoint) => {
      const relativeX = point.absoluteX - boardOrigin.current.x;
      let direction = 0;
      if (relativeX < AUTO_SCROLL_EDGE) direction = -1;
      else if (relativeX > boardOrigin.current.width - AUTO_SCROLL_EDGE) direction = 1;

      if (direction === 0) {
        stopAutoScroll();
        return;
      }
      stopAutoScroll();
      autoScrollTimer.current = setInterval(
        () => scrollBy(direction * AUTO_SCROLL_STEP),
        AUTO_SCROLL_INTERVAL
      );
    },
    [scrollBy, stopAutoScroll]
  );

  const handleDragStart = useCallback(
    (deal: DealItem, color: StageColor, point: DragStartPoint) => {
      measureBoard();
      const drag: ActiveDrag = {
        deal,
        color,
        fromStageId: deal.stageId,
        grabX: point.x,
        grabY: point.y,
      };
      activeDragRef.current = drag;
      lastPoint.current = point;
      dragPosition.setValue({
        x: point.absoluteX - boardOrigin.current.x - point.x,
        y: point.absoluteY - boardOrigin.current.y - point.y,
      });
      setActiveDrag(drag);
      updateHoveredColumn(point);
    },
    [dragPosition, measureBoard, updateHoveredColumn]
  );

  const handleDragMove = useCallback(
    (point: DragPoint) => {
      const drag = activeDragRef.current;
      if (!drag) return;
      lastPoint.current = point;
      dragPosition.setValue({
        x: point.absoluteX - boardOrigin.current.x - drag.grabX,
        y: point.absoluteY - boardOrigin.current.y - drag.grabY,
      });
      updateHoveredColumn(point);
      updateAutoScroll(point);
    },
    [dragPosition, updateAutoScroll, updateHoveredColumn]
  );

  const handleDragEnd = useCallback(
    (commit: boolean) => {
      const drag = activeDragRef.current;
      if (!drag) return;

      stopAutoScroll();
      const targetStageId = hoveredStageRef.current;
      activeDragRef.current = null;
      hoveredStageRef.current = null;
      lastPoint.current = null;
      setActiveDrag(null);
      setHoveredStageId(null);

      if (!commit || !targetStageId || targetStageId === drag.fromStageId) return;
      const targetColumn = columnsRef.current.find(
        (column) => column.stage.sales_pipeline_stage_id === targetStageId
      );
      if (targetColumn) {
        onMoveDeal(drag.deal, targetColumn);
      }
    },
    [onMoveDeal, stopAutoScroll]
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = event.nativeEvent.contentOffset.x;
  }, []);

  useEffect(() => stopAutoScroll, [stopAutoScroll]);

  const isDragging = activeDrag !== null;
  const columnHeight = boardHeight > 0 ? boardHeight - BOARD_PADDING_TOP : undefined;

  return (
    <View ref={boardRef} style={styles.board} onLayout={handleBoardLayout} collapsable={false}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isDragging}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(width) => {
          contentWidth.current = width;
        }}
        contentContainerStyle={styles.boardContent}
      >
        {columns.map((column) => {
          const stageId = column.stage.sales_pipeline_stage_id;
          return (
            <KanbanColumn
              key={stageId}
              column={column}
              width={columnWidth}
              height={columnHeight}
              draggingDealId={activeDrag?.deal.id}
              isDropTarget={isDragging && hoveredStageId === stageId && stageId !== activeDrag?.fromStageId}
              scrollEnabled={!isDragging}
              isRefreshing={isRefreshing}
              onRefresh={onRefresh}
              onLayout={(event) => handleColumnLayout(stageId, event)}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onPressDeal={onPressDeal}
            />
          );
        })}
      </ScrollView>

      {activeDrag && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingCard,
            {
              width: columnWidth - COLUMN_INNER_INSET,
              transform: dragPosition.getTranslateTransform(),
            },
          ]}
        >
          <KanbanDealCard deal={activeDrag.deal} color={activeDrag.color} isFloating />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
  },
  boardContent: {
    paddingTop: BOARD_PADDING_TOP,
    paddingHorizontal: Layout.screenPaddingHorizontal2 - 4,
    gap: COLUMN_GAP,
  },
  floatingCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 999,
    elevation: 12,
  },
});
