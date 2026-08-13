import { mobileApiService } from "@shared/services";

import {
    CustomerSummaryItem,
    CustomerDetailItem,
    CustomerContactSummaryItem
} from '../types';

export const customerService = {
    async getCustomers(search?: string): Promise<CustomerSummaryItem[]> {
        const params = search && search.trim() ? { search: search.trim() } : undefined;
        const response = await mobileApiService.get<CustomerSummaryItem[]>('/customers', params);
        return response.data;
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