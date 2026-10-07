import { useState, useEffect, useCallback, useRef } from 'react';
import { customerService } from '../services/customer.service';
import { CustomerTimelineEvent } from '../types';

const PAGE_SIZE = 20;

interface TimelineCacheEntry {
  items: CustomerTimelineEvent[];
  nextCursor: string | null;
  hasMore: boolean;
}

const cachedTimelineMap = new Map<string, TimelineCacheEntry>();

interface Options {
  enabled?: boolean;
}

export const useCustomerTimeline = (customerId?: string | number, { enabled = true }: Options = {}) => {
  const key = customerId !== undefined ? String(customerId) : '';
  const cached = key ? cachedTimelineMap.get(key) : undefined;

  const [events, setEvents] = useState<CustomerTimelineEvent[]>(cached?.items ?? []);
  const [nextCursor, setNextCursor] = useState<string | null>(cached?.nextCursor ?? null);
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const fetchPage = useCallback(
    async (cursor: string | null, mode: 'initial' | 'refresh' | 'more') => {
      if (!key || inFlight.current) return;
      inFlight.current = true;
      if (mode === 'initial') setIsLoading(true);
      if (mode === 'refresh') setIsRefreshing(true);
      if (mode === 'more') setIsLoadingMore(true);
      setError(null);

      try {
        const response = await customerService.getCustomerTimeline(key, { limit: PAGE_SIZE, before: cursor });
        const previous = cachedTimelineMap.get(key)?.items ?? [];
        const merged = mode === 'more' ? [...previous, ...response.data] : response.data;
        const entry: TimelineCacheEntry = {
          items: merged,
          nextCursor: response.meta.next_cursor,
          hasMore: response.meta.has_more,
        };

        cachedTimelineMap.set(key, entry);
        setEvents(merged);
        setNextCursor(entry.nextCursor);
        setHasMore(entry.hasMore);
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil timeline customer.');
      } finally {
        inFlight.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [key]
  );

  useEffect(() => {
    if (!enabled || !key) return;
    fetchPage(null, cachedTimelineMap.has(key) ? 'refresh' : 'initial');
  }, [enabled, key, fetchPage]);

  const refresh = useCallback(() => fetchPage(null, 'refresh'), [fetchPage]);
  const loadMore = useCallback(() => {
    if (hasMore && nextCursor) fetchPage(nextCursor, 'more');
  }, [hasMore, nextCursor, fetchPage]);

  return { events, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore };
};
