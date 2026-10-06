import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';
import { MyProfileDto, ProfileViewModel } from '../types';

export interface UseProfileOptions {
  autoFetch?: boolean;
}

let cachedProfile: ProfileViewModel | null = null;

/** Reset cache profil, dipanggil saat logout agar user berikutnya tidak melihat data lama. */
export const clearProfileCache = () => {
  cachedProfile = null;
};

const formatProfileData = (dto: MyProfileDto): ProfileViewModel => ({
  employeeId: dto.employee_id,
  fullName: dto.full_name,
  username: dto.username,
  email: dto.email,
  positionName: dto.position?.position_name || undefined,
  officeName: dto.office?.office_name || undefined,
  divisionName: dto.division?.division_name || undefined,
});

export const useProfile = (options: UseProfileOptions = {}) => {
  const { autoFetch = true } = options;

  const [profile, setProfile] = useState<ProfileViewModel | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedProfile);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (opts?: { silent?: boolean }) => {
    if (!cachedProfile && !opts?.silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const dto = await profileService.getMyProfile();
      const formatted = formatProfileData(dto);
      cachedProfile = formatted;
      setProfile(formatted);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat profil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const dto = await profileService.getMyProfile();
      const formatted = formatProfileData(dto);
      cachedProfile = formatted;
      setProfile(formatted);
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch, fetchProfile]);

  return {
    profile,
    isLoading,
    isRefreshing,
    error,
    fetchProfile,
    refreshProfile,
  };
};

export default useProfile;
