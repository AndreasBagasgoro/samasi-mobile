import { mobileApiService } from '@shared/services';
import {
  CreateCustomerContactPayload,
  CustomerContactDetail,
  CustomerContactListParams,
  CustomerContactListResponse,
  UpdateCustomerContactPayload,
} from '../types';

/**
 * Respons POST /customer-contacts berbentuk camelCase dan membawa nama customer
 * di objek `customer`, bukan `customer_name`. Dinormalkan ke bentuk CustomerContactDetail.
 */
const normalizeCreatedContact = (raw: any): CustomerContactDetail => ({
  ...raw,
  customer_contact_id: raw.customer_contact_id ?? raw.customerContactId,
  customer_id: raw.customer_id ?? raw.customerId,
  customer_name: raw.customer_name ?? raw.customer?.customerName ?? null,
  contact_name: raw.contact_name ?? raw.contactName,
  job_title: raw.job_title ?? raw.jobTitle,
  phone_number: raw.phone_number ?? raw.phoneNumber,
  is_primary: raw.is_primary ?? raw.isPrimary,
});

export const customerContactService = {
  async getContacts(params?: CustomerContactListParams): Promise<CustomerContactListResponse> {
    const queryParams: Record<string, string> = {};
    if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params?.page !== undefined) queryParams.page = String(params.page);
    if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);
    if (params?.customer_id) queryParams.customer_id = String(params.customer_id);

    const raw = (await mobileApiService.get<any>('/customer-contacts/summary', queryParams)) as any;

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

  async getContactDetail(id: string | number): Promise<CustomerContactDetail> {
    const response = await mobileApiService.get<CustomerContactDetail>(`/customer-contacts/${id}`);
    return response.data;
  },

  async createContact(payload: CreateCustomerContactPayload): Promise<CustomerContactDetail> {
    const response = await mobileApiService.post<any>('/customer-contacts', payload);
    return normalizeCreatedContact(response.data);
  },

  async updateContact(
    id: string | number,
    payload: UpdateCustomerContactPayload
  ): Promise<CustomerContactDetail> {
    const response = await mobileApiService.patch<any>(`/customer-contacts/${id}`, payload);
    return normalizeCreatedContact(response.data);
  },

  async deleteContact(id: string | number): Promise<void> {
    await mobileApiService.delete<any>(`/customer-contacts/${id}`);
  },
};
