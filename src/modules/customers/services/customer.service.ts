import { mobileApiService } from "@shared/services";

import {
    CustomerSummaryItem,
    CustomerDetailItem
} from '../types';

export const customerService = {
    async getCustomers(): Promise<CustomerSummaryItem[]> {
        const response = await mobileApiService.get<CustomerSummaryItem[]>('/customers');
        return response.data;
    },
    async getCustomerDetail(id: string | number): Promise<CustomerDetailItem> {
        const response = await mobileApiService.get<CustomerDetailItem>(`/customers/${id}`);
        return response.data;
    },
}