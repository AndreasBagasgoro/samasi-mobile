import { useState, useEffect, useCallback, useRef } from 'react';
import { customerService } from '../services/customer.service';
import { formatDealData } from '@modules/deals/hooks/useDeals';
import { DealItem } from '@modules/deals/types';

const PAGE_SIZE = 10;

interface DealsCacheEntry {
  items: DealItem[];
  page: number;
  totalPages: number;
}

const cachedDealsMap = new Map<string, DealsCacheEntry>();

interface Options {
  enabled?: boolean;
}

export const useCustomerDeals = (customerId?: string | number, { enabled = true }: Options = {}) => {
  const key = customerId !== undefined ? String(customerId) : '';
  const cached = key ? cachedDealsMap.get(key) : undefined;

  const [deals, setDeals] = useState<DealItem[]>(cached?.items ?? []);
  const [page, setPage] = useState(cached?.page ?? 1);
  const [totalPages, setTotalPages] = useState(cached?.totalPages ?? 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const fetchPage = useCallback(
    async (targetPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (!key || inFlight.current) return;
      inFlight.current = true;
      if (mode === 'initial') setIsLoading(true);
      if (mode === 'refresh') setIsRefreshing(true);
      if (mode === 'more') setIsLoadingMore(true);
      setError(null);

      try {
        const response = await customerService.getCustomerDeals(key, { page: targetPage, per_page: PAGE_SIZE });
        const formatted = response.data.map(formatDealData);
        const previous = cachedDealsMap.get(key)?.items ?? [];
        const merged = targetPage === 1 ? formatted : [...previous, ...formatted];

        cachedDealsMap.set(key, { items: merged, page: response.meta.page, totalPages: response.meta.total_pages });
        setDeals(merged);
        setPage(response.meta.page);
        setTotalPages(response.meta.total_pages);
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil data deals customer.');
      } finally {
        inFlight.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [key]
  );

  // Fetch hanya saat tab aktif pertama kali; cache ditampilkan dulu lalu diperbarui di belakang.
  useEffect(() => {
    if (!enabled || !key) return;
    fetchPage(1, cachedDealsMap.has(key) ? 'refresh' : 'initial');
  }, [enabled, key, fetchPage]);

  const refresh = useCallback(() => fetchPage(1, 'refresh'), [fetchPage]);
  const loadMore = useCallback(() => {
    if (page < totalPages) fetchPage(page + 1, 'more');
  }, [page, totalPages, fetchPage]);

  return { deals, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore };
};
