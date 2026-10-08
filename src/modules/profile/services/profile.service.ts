import { authApiService, mobileApiService } from '@shared/services';
import { MyProfileDto, ProfileStats } from '../types';

export const profileService = {
  /** Ambil profil employee yang sedang login. */
  async getMyProfile(): Promise<MyProfileDto> {
    const response = await authApiService.get<MyProfileDto>('/auth/me');
    return response.data;
  },

  /** Ambil statistik bulan berjalan (diary, customer, deal won) employee yang login. */
  async getMonthlyStats(): Promise<ProfileStats> {
    const response = await mobileApiService.get<ProfileStats>('/home/monthly-stats');
    return response.data;
  },
};
