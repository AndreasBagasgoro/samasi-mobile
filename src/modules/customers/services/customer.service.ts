import { mobileApiService } from "@shared/services";

import {
    CustomerDetailItem,
    CustomerContactSummaryItem,
    CustomerListParams,
    CustomerListResponse,
    CustomerTypeResponse,
    CustomerTypeNameResponse,
    CreateCustomerPayload,
    CustomerTimelineResponse,
} from '../types';


export const customerService = {
    async createCustomer(payload: CreateCustomerPayload): Promise<CustomerDetailItem> {
        const response = await mobileApiService.post<CustomerDetailItem>('/customers', payload);
        return response.data;
    },

    async getCustomers(params?: CustomerListParams): Promise<CustomerListResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);
        if (params?.customer_type_id && params.customer_type_id !== 'all') {
            queryParams.customer_type_id = String(params.customer_type_id);
        }
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
    },

    async getCustomerDeals(id: string | number, params?: { page?: number; per_page?: number }): Promise<{ data: any[]; meta: { page: number; per_page: number; total: number; total_pages: number } }> {
        const queryParams: Record<string, string> = {};
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);
        const raw = await mobileApiService.get<any>(`/customers/${id}/deals`, queryParams) as any;
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

    async getCustomerTimeline(id: string | number, params?: { limit?: number; before?: string | null }): Promise<CustomerTimelineResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.limit !== undefined) queryParams.limit = String(params.limit);
        if (params?.before) queryParams.before = params.before;
        const raw = await mobileApiService.get<any>(`/customers/${id}/timeline`, queryParams) as any;
        return {
            data: raw.data ?? [],
            meta: {
                limit: raw.meta?.limit ?? params?.limit ?? 20,
                has_more: raw.meta?.has_more ?? false,
                next_cursor: raw.meta?.next_cursor ?? null,
            },
        };
    },

    async getCustomerTypes(params?: CustomerListParams): Promise<CustomerTypeResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);

        const raw = await mobileApiService.get<any>('/customers/types', queryParams) as any;

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

    async getCustomerTypeNames(params?: CustomerListParams): Promise<CustomerTypeNameResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);

        const raw = await mobileApiService.get<any>('/customers/type-name-list', queryParams) as any;

        return {
            data: raw.data ?? [],
            meta: {
                page: raw.meta?.page ?? 1,
                per_page: raw.meta?.per_page ?? params?.per_page ?? 10,
                total: raw.meta?.total ?? 0,
                total_pages: raw.meta?.total_pages ?? 1,
            },
        };
    }
}