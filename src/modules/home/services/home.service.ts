import { mobileApiService } from '@shared/services';
import { HomeSummaryDto } from '../types/home.types';

export const homeService = {
  async getSummary(): Promise<HomeSummaryDto> {
    const response = await mobileApiService.get<HomeSummaryDto>('/home/summary');
    return response.data;
  },
};
