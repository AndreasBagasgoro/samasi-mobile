import { useCallback, useEffect, useState } from 'react';
import { homeService } from '../services/home.service';
import { HomeSummary, HomeSummaryDto } from '../types/home.types';

export interface UseHomeSummaryOptions {
  autoFetch?: boolean;
}

let cachedSummary: HomeSummary | null = null;

/** Reset cache ringkasan Home, dipanggil saat logout agar user berikutnya tidak melihat data lama. */
export const clearHomeCache = () => {
  cachedSummary = null;
};

const formatHomeSummary = (dto: HomeSummaryDto): HomeSummary => ({
  openDeals: dto.deals.open,
  openValue: dto.deals.open_value,
  wonThisMonth: dto.deals.won_this_month,
  wonValueThisMonth: dto.deals.won_value_this_month,
  activityToday: dto.activity.today,
  activityThisWeek: dto.activity.this_week,
  actionItems: dto.action_items.map((item) => ({
    id: item.deal_id,
    type: item.type,
    days: item.days,
    title: item.title,
    customerName: item.customer_name || '-',
    contactName: item.contact_name || undefined,
    expectedCloseDate: item.expected_close_date,
    value: item.value,
  })),
  pipelineByStage: dto.pipeline_by_stage.map((stage) => ({
    id: stage.stage_id,
    name: stage.name,
    sequence: stage.sequence,
    count: stage.count,
    value: stage.value,
  })),
  recentDiaries: dto.recent_diaries.map((entry) => ({
    id: entry.id,
    title: entry.title || 'Aktivitas tanpa judul',
    customerName: entry.customer_name || '-',
    interactionTypeName: entry.interaction_type_name || undefined,
    entryAt: entry.entry_at,
  })),
});

export const useHomeSummary = (options: UseHomeSummaryOptions = {}) => {
  const { autoFetch = true } = options;

  const [summary, setSummary] = useState<HomeSummary | null>(cachedSummary);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch && !cachedSummary);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const dto = await homeService.getSummary();
    const formatted = formatHomeSummary(dto);
    cachedSummary = formatted;
    setSummary(formatted);
  }, []);

  const fetchSummary = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!cachedSummary && !opts?.silent) {
        setIsLoading(true);
      }
      setError(null);
      try {
        await load();
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat ringkasan home.');
      } finally {
        setIsLoading(false);
      }
    },
    [load]
  );

  const refreshSummary = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await load();
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui ringkasan home.');
    } finally {
      setIsRefreshing(false);
    }
  }, [load]);

  useEffect(() => {
    if (autoFetch) {
      fetchSummary();
    }
  }, [autoFetch, fetchSummary]);

  return {
    summary,
    isLoading,
    isRefreshing,
    error,
    fetchSummary,
    refreshSummary,
  };
};

export default useHomeSummary;
