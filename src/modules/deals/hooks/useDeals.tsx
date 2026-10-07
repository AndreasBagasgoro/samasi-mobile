import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@modules/auth';
import { dealService } from '../services/deal.service';
import {
  CreateDealPayload,
  DealItem,
  DealSummary,
  SalesDealEntryItem,
  UpdateDealPayload,
} from '../types';
import { DEAL_BOARD_LIMIT } from '../constants/deal.constants';
import { parseMoney, toDateOnly } from '../utils';

export interface UseDealsOptions {
  autoFetch?: boolean;
}

let cachedDeals: DealItem[] | null = null;
let cachedSummary: DealSummary | null = null;
const cachedDealDetailMap = new Map<string, DealItem>();

/** Reset cache deals, dipanggil saat logout agar user berikutnya tidak melihat data lama. */
export const clearDealsCache = () => {
  cachedDeals = null;
  cachedSummary = null;
  cachedDealDetailMap.clear();
};

export const formatDealData = (item: SalesDealEntryItem): DealItem => {
  const contact = item.customerContact;
  const customer = contact?.customer;

  return {
    id: String(item.sales_deal_id),
    title: item.title || 'Untitled Deal',
    value: parseMoney(item.estimated_value),
    status: item.status,
    stageId: String(item.sales_pipeline_stage_id),
    stageName: item.pipeline_stage_name || '-',
    stageCode: item.pipeline_stage_code || undefined,
    customerId: customer?.customerId != null ? String(customer.customerId) : contact?.customerId != null ? String(contact.customerId) : undefined,
    customerName: customer?.customerName || contact?.contactName || '-',
    customerContactId: String(item.customer_contact_id),
    contactName: contact?.contactName,
    ownerName: item.owner_name || undefined,
    expectedCloseDate: toDateOnly(item.expected_close_date),
    notes: item.notes,
    lastActivityAt: item.last_activity_at || item.createdAt,
    createdAt: item.createdAt,
  };
};

export const useDeals = (options: UseDealsOptions = {}) => {
  const { autoFetch = true } = options;
  const authUser = useAuthStore((state) => state.user);
  const ownerId = authUser?.employee_id;

  const [deals, setDeals] = useState<DealItem[]>(cachedDeals || []);
  const [summary, setSummary] = useState<DealSummary | null>(cachedSummary);
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(autoFetch && !cachedDeals);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeals = useCallback(async () => {
    const [listResponse, summaryResponse] = await Promise.all([
      dealService.getDeals({ page: 1, per_page: DEAL_BOARD_LIMIT, owner_id: ownerId }),
      dealService.getDealSummary({ owner_id: ownerId }).catch(() => null),
    ]);

    const formatted = listResponse.data.map(formatDealData);
    cachedDeals = formatted;
    cachedSummary = summaryResponse;
    setDeals(formatted);
    setSummary(summaryResponse);
  }, [ownerId]);

  const fetchDeals = useCallback(async () => {
    if (!cachedDeals) {
      setIsLoading(true);
    }
    setError(null);
    try {
      await loadDeals();
    } catch (err: any) {
      setError(err?.message || 'Gagal mengambil data deals dari server.');
    } finally {
      setIsLoading(false);
    }
  }, [loadDeals]);

  const refreshDeals = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await loadDeals();
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui data deals.');
    } finally {
      setIsRefreshing(false);
    }
  }, [loadDeals]);

  const fetchDealDetail = useCallback(async (id: string) => {
    const cachedDetail = cachedDealDetailMap.get(id) || cachedDeals?.find((deal) => deal.id === id);
    if (cachedDetail) {
      setSelectedDeal(cachedDetail);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = formatDealData(await dealService.getDealById(id));
      cachedDealDetailMap.set(id, data);
      setSelectedDeal(data);
      return data;
    } catch (err: any) {
      setError(err?.message || `Gagal mengambil detail deal dengan ID: ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Sinkronkan satu deal hasil mutasi ke state & cache lokal */
  const syncDeal = useCallback((deal: DealItem) => {
    cachedDealDetailMap.set(deal.id, deal);
    if (cachedDeals) {
      cachedDeals = cachedDeals.map((item) => (item.id === deal.id ? deal : item));
    }
    setDeals((prev) => prev.map((item) => (item.id === deal.id ? deal : item)));
    setSelectedDeal((prev) => (prev?.id === deal.id ? deal : prev));
  }, []);

  /**
   * Pindahkan deal ke stage lain secara optimistic: UI langsung berubah,
   * lalu dikembalikan jika request ke server gagal.
   */
  const changeDealStage = useCallback(
    async (id: string, stageId: string, stageName?: string): Promise<DealItem | null> => {
      const previous =
        cachedDeals?.find((deal) => deal.id === id) ||
        cachedDealDetailMap.get(id);

      if (previous) {
        syncDeal({ ...previous, stageId, stageName: stageName || previous.stageName });
      }
      setError(null);

      try {
        const updated = formatDealData(await dealService.changeDealStage(id, stageId));
        syncDeal(updated);
        // Nilai total pipeline bergantung pada status deal (OPEN/WON/LOST)
        dealService
          .getDealSummary({ owner_id: ownerId })
          .then((data) => {
            cachedSummary = data;
            setSummary(data);
          })
          .catch(() => undefined);
        return updated;
      } catch (err: any) {
        if (previous) {
          syncDeal(previous);
        }
        setError(err?.message || 'Gagal memindahkan stage deal.');
        return null;
      }
    },
    [syncDeal, ownerId]
  );

  const createDeal = useCallback(async (payload: CreateDealPayload): Promise<DealItem | null> => {
    setIsSaving(true);
    setError(null);
    try {
      const data = formatDealData(await dealService.createDeal(payload));
      cachedDealDetailMap.set(data.id, data);
      // Invalidate cache agar board & list memuat data terbaru
      cachedDeals = null;
      cachedSummary = null;
      return data;
    } catch (err: any) {
      setError(err?.message || 'Gagal menambahkan deal baru.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateDeal = useCallback(
    async (id: string, payload: UpdateDealPayload): Promise<DealItem | null> => {
      setIsSaving(true);
      setError(null);
      try {
        const data = formatDealData(await dealService.updateDeal(id, payload));
        syncDeal(data);
        cachedSummary = null;
        return data;
      } catch (err: any) {
        setError(err?.message || `Gagal memperbarui deal dengan ID: ${id}`);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [syncDeal]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchDeals();
    }
  }, [autoFetch, fetchDeals]);

  return {
    deals,
    summary,
    selectedDeal,
    isLoading,
    isRefreshing,
    isSaving,
    error,
    setError,
    fetchDeals,
    refreshDeals,
    fetchDealDetail,
    changeDealStage,
    createDeal,
    updateDeal,
  };
};

export default useDeals;
