import { authApiService } from '@shared/services';
import { MyProfileDto } from '../types';

export const profileService = {
  /** Ambil profil employee yang sedang login. */
  async getMyProfile(): Promise<MyProfileDto> {
    const response = await authApiService.get<MyProfileDto>('/auth/me');
    return response.data;
  },
};
