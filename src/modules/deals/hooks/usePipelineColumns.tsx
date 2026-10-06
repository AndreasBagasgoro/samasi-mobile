import { useMemo } from 'react';
import { DealItem, PipelineColumn, PipelineStageItem, StageColor } from '../types';
import { getStageColor } from '../utils';

/** Peta warna per stage id; stage aktif diberi warna bergiliran sesuai urutannya */
export const useStageColors = (stages: PipelineStageItem[]) =>
  useMemo(() => {
    const map = new Map<string, StageColor>();
    let activeIndex = 0;
    stages.forEach((stage) => {
      const isActive = !stage.is_won_stage && !stage.is_lost_stage;
      map.set(stage.sales_pipeline_stage_id, getStageColor(stage, activeIndex));
      if (isActive) activeIndex += 1;
    });
    return map;
  }, [stages]);

/** Kelompokkan deals ke kolom kanban berdasarkan pipeline stage */
export const usePipelineColumns = (stages: PipelineStageItem[], deals: DealItem[]) => {
  const stageColors = useStageColors(stages);

  const columns = useMemo<PipelineColumn[]>(() => {
    return stages.map((stage) => {
      const stageDeals = deals.filter((deal) => deal.stageId === stage.sales_pipeline_stage_id);
      return {
        stage,
        color: stageColors.get(stage.sales_pipeline_stage_id) || getStageColor(stage),
        deals: stageDeals,
        totalValue: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
      };
    });
  }, [stages, deals, stageColors]);

  return { columns, stageColors };
};
