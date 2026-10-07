import { mobileApiService } from "@shared/services";
import {
    CreateDealPayload,
    DealListParams,
    DealListResponse,
    DealSummary,
    PipelineStageListResponse,
    SalesDealEntryItem,
    UpdateDealPayload,
} from '../types';

export const dealService = {
    async getPipelineStages(): Promise<PipelineStageListResponse> {
        const raw = await mobileApiService.get<any>('/pipeline-stages', { per_page: '100' }) as any;

        return {
            data: raw?.data ?? [],
            meta: {
                page: raw?.meta?.page ?? 1,
                per_page: raw?.meta?.per_page ?? 100,
                total: raw?.meta?.total ?? 0,
                total_pages: raw?.meta?.total_pages ?? 1,
            },
        };
    },

    async getDeals(params?: DealListParams): Promise<DealListResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);
        if (params?.status) queryParams.status = params.status;
        if (params?.customer_contact_id) queryParams.customer_contact_id = String(params.customer_contact_id);
        if (params?.owner_id) queryParams.owner_id = String(params.owner_id);

        const raw = await mobileApiService.get<any>('/deals', queryParams) as any;

        return {
            data: raw?.data ?? [],
            meta: {
                page: raw?.meta?.page ?? 1,
                per_page: raw?.meta?.per_page ?? params?.per_page ?? 10,
                total: raw?.meta?.total ?? 0,
                total_pages: raw?.meta?.total_pages ?? 1,
            },
        };
    },

    async getDealSummary(params?: { owner_id?: string | number }): Promise<DealSummary> {
        const queryParams: Record<string, string> = {};
        if (params?.owner_id) queryParams.owner_id = String(params.owner_id);

        const response = await mobileApiService.get<DealSummary>('/deals/summary', queryParams);
        return response.data;
    },

    async getDealById(id: string): Promise<SalesDealEntryItem> {
        const response = await mobileApiService.get<SalesDealEntryItem>(`/deals/${id}`);
        return response.data;
    },

    async createDeal(payload: CreateDealPayload): Promise<SalesDealEntryItem> {
        const response = await mobileApiService.post<SalesDealEntryItem>('/deals', payload);
        return response.data;
    },

    async updateDeal(id: string, payload: UpdateDealPayload): Promise<SalesDealEntryItem> {
        const response = await mobileApiService.patch<SalesDealEntryItem>(`/deals/${id}`, payload);
        return response.data;
    },

    async changeDealStage(id: string, stageId: string): Promise<SalesDealEntryItem> {
        const response = await mobileApiService.patch<SalesDealEntryItem>(`/deals/${id}/stage`, {
            sales_pipeline_stage_id: stageId,
        });
        return response.data;
    },
};
