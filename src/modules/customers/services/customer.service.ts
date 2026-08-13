import { mobileApiService } from "@shared/services";

import {
    CustomerSummaryItem,
    CustomerDetailItem,
    CustomerContactSummaryItem
} from '../types';

export interface CustomerListParams {
    search?: string;
    page?: number;
    per_page?: number;
}

export interface CustomerListResponse {
    data: CustomerSummaryItem[];
    meta: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
    };
}

export const customerService = {
    async getCustomers(params?: CustomerListParams): Promise<CustomerListResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);

        // Backend response: { data: [...], meta: { page, per_page, total, total_pages } }
        const raw = await mobileApiService.get<any>('/customers', queryParams) as any;

        return {
            data: raw.data ?? [],
            meta: {
                page: raw.meta?.page ?? 1,
                per_page: raw.meta?.per_page ?? params?.per_page ?? 10,
                total: raw.meta?.total ?? 0,
                total_pages: raw.meta?.total_pages ?? 1,
            },
        };
    },

    async getCustomerDetail(id: string | number): Promise<CustomerDetailItem> {
        const response = await mobileApiService.get<CustomerDetailItem>(`/customers/${id}`);
        return response.data;
    },

    async getCustomerContact(id: string | number): Promise<CustomerContactSummaryItem[]> {
        const response = await mobileApiService.get<CustomerContactSummaryItem[]>(`/customers/${id}/contacts`);
        return response.data;
    }
}