import { useState, useEffect, useCallback } from 'react';
import { dealService } from '../services/deal.service';
import { PipelineStageItem } from '../types';

interface UsePipelineStagesOptions {
  autoFetch?: boolean;
}

let cachedStages: PipelineStageItem[] | null = null;

export const usePipelineStages = (options: UsePipelineStagesOptions = { autoFetch: true }) => {
  const { autoFetch = true } = options;

  const [stages, setStages] = useState<PipelineStageItem[]>(cachedStages || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedStages);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = useCallback(async () => {
    if (!cachedStages) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await dealService.getPipelineStages();
      const sorted = [...response.data].sort((a, b) => a.sequence - b.sequence);
      cachedStages = sorted;
      setStages(sorted);
      return sorted;
    } catch (err: any) {
      setError(err?.message || 'Gagal mengambil data pipeline stage dari server.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStages();
    }
  }, [autoFetch, fetchStages]);

  return {
    stages,
    isLoading,
    error,
    fetchStages,
  };
};

export default usePipelineStages;
