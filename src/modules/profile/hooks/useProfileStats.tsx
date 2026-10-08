import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';
import { ProfileStats } from '../types';

let cachedStats: ProfileStats | null = null;

/** Reset cache statistik, dipanggil saat logout agar user berikutnya tidak melihat data lama. */
export const clearProfileStatsCache = () => {
  cachedStats = null;
};

export const useProfileStats = () => {
  const [stats, setStats] = useState<ProfileStats | null>(cachedStats);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const data = await profileService.getMonthlyStats();
      cachedStats = data;
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat statistik bulanan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refreshStats: fetchStats };
};

export default useProfileStats;
